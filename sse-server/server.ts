import express, { Response } from 'express';
import http from 'http';
import cors from 'cors';
import { getCookie } from './util/cookie';
import { verifyJWT } from './util/auth';
import { db } from './db/db';
import { UserProfileTable } from './db/schemas/user';
import { ChatMessage, ChatRoomTable, UserProfile_ChatRoom } from './db/schemas/chat';
import { eq } from 'drizzle-orm';

const PORT = process.env.SSE_PORT;

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());


type TMessageSave = {
    Username: string,
    Content: string,
    ChatRoomId: string;
}

type TMessageSend = {
    messageId: string,
    roomId: string | null,
    username: string,
    content: string,
    chatTime: Date,
}

type RoomId = string;

type User = {
    username: string,
    res: Response,
};

type RoomObject = Record<RoomId, User[]>

const rooms: RoomObject = {};

app.post('/send-message', async (req, res) => {
    const token = req.headers.bearer;
    if(token === undefined) return UnauthorizedRequest(res);

    const verifiedToken = Array.isArray(token) ? await verifyJWT(token[0]) :
                                            await verifyJWT(token);
    if(!verifiedToken) return ForbiddenRequest(res);

    const Username: string = verifiedToken.payload.username as string;
    if(!Username) return UnauthorizedRequest(res);

    const { Content, ChatRoomId } = req.body;

    if(!Content || !ChatRoomId) return BadRequest(res);

    const messageSave: TMessageSave = {
        Username,
        Content,
        ChatRoomId,
    }

    try {
        const messageSendArr: TMessageSend[] = await db.insert(ChatMessage).values(messageSave).returning({
            messageId: ChatMessage.ChatMessageId,
            roomId: ChatMessage.ChatRoomId,
            username: ChatMessage.Username,
            content: ChatMessage.Content,
            chatTime: ChatMessage.ChatTime,
        });

        if(messageSendArr.length === 0) return InternalServerError(res);
        const messageSend: TMessageSend = messageSendArr[0];

        const room = rooms[ChatRoomId]
        if(room) {
            // send message to users in this room (not self)
            for(const user of room) {
                if(user.username === Username) continue;

                user.res.write(`event: chat-message\ndata: ${JSON.stringify(messageSend)}\n\n`)
            }
        }

        return res.json(messageSend);
    } catch(err) {
        console.error(err);
        return InternalServerError(res);
    }
})

app.get('/chat-listen', async (req, res) => {
    if(req.headers.cookie === undefined) return UnauthorizedRequest(res);

    const token = getCookie(req.headers.cookie, 'token');
    if(token === undefined) return UnauthorizedRequest(res);

    const verifiedToken = await verifyJWT(token);
    if(!verifiedToken) return ForbiddenRequest(res);

    const username: string = verifiedToken.payload.username as string;
    if(!username) return UnauthorizedRequest(res);

    const roomIds = await db.select({
        roomId: UserProfile_ChatRoom.ChatRoomId,
    }).from(UserProfile_ChatRoom)
        .where(eq(UserProfile_ChatRoom.Username, username));

    if(roomIds.length === 0) {
        // user isn't a part of any message room
        return OkRequest(res);
    }

    // add user to rooms in object
    for(const roomId of roomIds) {
        if(rooms[roomId.roomId] === undefined) {
            rooms[roomId.roomId] = [{
                username,
                res
            }]
        } else {
            rooms[roomId.roomId].push({
                username,
                res
            });
        }
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
})


server.listen(PORT, () => {
    console.log(`sse server listening on port ${PORT}`)
})

function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function UnauthorizedRequest(res) {
    return res.status(401).end();
}

function ForbiddenRequest(res) {
    return res.status(403).end();
}

function BadRequest(res) {
    return res.status(400).end();
}

function InternalServerError(res) {
    return res.status(500).end();
}

function OkRequest(res) {
    return res.status(200).end();
}

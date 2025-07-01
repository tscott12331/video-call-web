import express from 'express';
import http from 'http';
import cors from 'cors';
import { getCookie } from './util/cookie';
import { verifyJWT } from './util/auth';
import { db } from './db/db';
import { UserProfileTable } from './db/schemas/user';

const PORT = process.env.SSE_PORT;

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.get('/chat-listen', async (req, res) => {
    if(req.headers.cookie === undefined) return UnauthorizedRequest(res);

    const token = getCookie(req.headers.cookie, 'token');
    if(token === undefined) return UnauthorizedRequest(res);

    const verifiedToken = await verifyJWT(token);
    if(!verifiedToken) return ForbiddenRequest(res);

    const username = verifiedToken.payload.username;
    if(!username) return UnauthorizedRequest(res);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.write(`data: hello world\n\n`);

    res.end();
})


server.listen(PORT, () => {
    console.log(`sse server listening on port ${PORT}`)
})

function UnauthorizedRequest(res){
    return res.status(401).end();
}

function ForbiddenRequest(res){
    return res.status(403).end();
}

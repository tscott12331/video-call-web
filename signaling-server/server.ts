import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { verifyJWT } from './jwt';

const PORT = process.env.SIGNAL_PORT;

const app = express();
app.use(express.static(__dirname));
//app.use(cors({
//    origin: 'http://localhost:3000',
//}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});


io.on('connection', async (socket) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        socket.disconnect();
        return
    }

    const verToken = await verifyJWT(token);
    if(!verToken) {
        socket.disconnect();
        return;
    }

    const { username } = verToken.payload;
    console.log(username);
})

server.listen(PORT, () => {
    console.log(`signalling server running on port ${PORT}`);
})

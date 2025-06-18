import express from 'express';
import { Server } from 'socket.io';
//import cors from 'cors';
import http from 'http';

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


io.on('connection', (socket) => {
    console.log('socket connection');
})

server.listen(PORT, () => {
    console.log(`signalling server running on port ${PORT}`);
})

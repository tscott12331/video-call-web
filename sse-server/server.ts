import express from 'express';
import http from 'http';
import cors from 'cors';

const PORT = process.env.SSE_PORT;

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
}));


function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

app.get('/chat-listen', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: hello world\n\n`);

    res.end();
})


server.listen(PORT, () => {
    console.log(`sse server listening on port ${PORT}`)
})

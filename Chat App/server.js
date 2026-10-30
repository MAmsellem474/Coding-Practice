import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const indexHTML =  fs.readFileSync("./public/index.html");
const server = http.createServer((req, res) =>{
    res.writeHead(200,{ 'Content-Type': 'text/html' });
    res.end(indexHTML);
})

const wss = new WebSocketServer({ server });

wss.on("connection",(socket, req) => {
    const username = new URL(req.url, "http://localhost")
        .searchParams.get("username",);
    const joinPayload = { "type": "system", "text": `${username} joined` };
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(joinPayload));
        };
    });

    socket.on('message', (data) => {
        const parsed = JSON.parse(data);
        const chatPayload = { 'type' : 'chat', 'username': parsed.username, 'text' : parsed.text };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(chatPayload));
            };
        });
    });

    socket.on('close', () => {
        const closePayload = { "type": "system", "text": `${username} left` };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(closePayload));
            };
        });
    });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
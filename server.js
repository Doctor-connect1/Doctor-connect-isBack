import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Update allowed origins to match your setup
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:4000"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling']
    }
});

// Keep track of connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    const userId = socket.id;
    const userInfo = { 
        id: userId,
        username: `User-${userId.substr(0, 4)}`
    };
    connectedUsers.set(userId, userInfo);
    
    socket.emit('me', userId);
    io.emit('users', Array.from(connectedUsers.values()));
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedUsers.delete(socket.id);
        io.emit('users', Array.from(connectedUsers.values()));
    });

    socket.on('callUser', ({ userToCall, signal, from }) => {
        console.log(`Call request from ${from} to ${userToCall}`);
        io.to(userToCall).emit('callUser', {
            signal,
            from,
            name: connectedUsers.get(from)?.username || 'Unknown User'
        });
    });

    socket.on('answerCall', ({ to, signal }) => {
        console.log(`Call answered by ${socket.id} to ${to}`);
        io.to(to).emit('callAccepted', { 
            signal,
            from: socket.id
        });
    });
});

server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
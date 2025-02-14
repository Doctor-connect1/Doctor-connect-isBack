import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import cors from 'cors';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow connections from your deployed frontend URL
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://your-frontend-url.vercel.app", // Add your deployed frontend URL
    "*" // For testing - remove in production
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
        credentials: true
    }
});

// Keep track of connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    connectedUsers.set(socket.id, { id: socket.id });
    socket.emit('me', socket.id);
    io.emit('users', Array.from(connectedUsers.values()));
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedUsers.delete(socket.id);
        io.emit('users', Array.from(connectedUsers.values()));
    });

    socket.on('callUser', ({ userToCall, signal, from }) => {
        io.to(userToCall).emit('callUser', { signal, from });
    });

    socket.on('answerCall', ({ to, signal }) => {
        io.to(to).emit('callAccepted', { signal });
    });
});

// Start servers
const startServers = async () => {
    try {
        // Start Socket.IO server
        await new Promise((resolve) => {
            server.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
                resolve();
            });
        });

        // Start Next.js server
        await nextApp.prepare();
        const nextServer = express();
        
        // Add CORS to Next.js server
        nextServer.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS'],
            credentials: true
        }));

        nextServer.all('*', (req, res) => {
            return nextHandler(req, res);
        });

        nextServer.listen(3000, () => {
            console.log('Next.js server running on port 3000');
        });
    } catch (err) {
        console.error('Error starting servers:', err);
    }
};

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

startServers();
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

// Update CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true
}));

// Configure Socket.IO with proper CORS and transport settings
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling']
    },
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
});

// Modify the tracking maps
const authenticatedUsers = new Map();
const onlineDoctors = new Map();

// Add a Map to track users
const roomUsers = new Map();

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Handle doctor connection
    socket.on('doctor-connect', (doctor) => {
        console.log('Doctor connected:', doctor);
        onlineDoctors.set(doctor.id, {
            id: doctor.id,
            name: doctor.name,
            socketId: socket.id,
            isOnline: true
        });
        // Broadcast updated online doctors list
        io.emit('online-doctors', Array.from(onlineDoctors.values()));
    });

    // Handle authentication with role awareness
    socket.on('authenticate', async ({ userId, role, name }) => {
        if (!userId) return;

        console.log('User authenticated:', { userId, role, name });
        authenticatedUsers.set(userId, {
            socketId: socket.id,
            role: role,
            name: name
        });

        // If it's a doctor, add to online doctors
        if (role === 'DOCTOR') {
            onlineDoctors.set(userId, {
                id: userId,
                name: name,
                socketId: socket.id,
                isOnline: true
            });
            // Broadcast updated online doctors list
            io.emit('online-doctors', Array.from(onlineDoctors.values()));
        }

        // Emit current online users
        const onlineUsers = Array.from(authenticatedUsers.entries()).map(([userId, data]) => ({
            userId: parseInt(userId),
            role: data.role
        }));
        io.emit('onlineUsers', onlineUsers);
    });

    // Handle get online doctors request
    socket.on('get-online-doctors', () => {
        socket.emit('online-doctors', Array.from(onlineDoctors.values()));
    });

    // Handle doctor disconnect
    socket.on('doctor-disconnect', (doctorId) => {
        console.log('Doctor disconnected:', doctorId);
        onlineDoctors.delete(doctorId);
        io.emit('online-doctors', Array.from(onlineDoctors.values()));
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', socket.id, 'Reason:', reason);
        
        // Remove from authenticated users and find their role
        let disconnectedDoctorId = null;
        for (const [userId, data] of authenticatedUsers.entries()) {
            if (data.socketId === socket.id) {
                if (data.role === 'DOCTOR') {
                    disconnectedDoctorId = userId;
                }
                authenticatedUsers.delete(userId);
                break;
            }
        }

        // If it was a doctor, remove from online doctors
        if (disconnectedDoctorId) {
            onlineDoctors.delete(disconnectedDoctorId);
            io.emit('online-doctors', Array.from(onlineDoctors.values()));
        }

        // Emit updated online users
        const onlineUsers = Array.from(authenticatedUsers.entries()).map(([userId, data]) => ({
            userId: parseInt(userId),
            role: data.role
        }));
        io.emit('onlineUsers', onlineUsers);

        // Clean up user from rooms
        roomUsers.forEach((users, roomId) => {
            users.delete(socket.id);
            if (users.size === 0) {
                roomUsers.delete(roomId);
            }
        });
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // Handle chat room events
    socket.on('joinRoom', (roomId) => {
        socket.join(`room-${roomId}`);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
        socket.leave(`room-${roomId}`);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('sendMessage', async ({ chatroomId, message, userId }) => {
        try {
            if (!authenticatedUsers.has(userId)) return;

            io.to(`room-${chatroomId}`).emit('newMessage', {
                chatroomId,
                message,
                userId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Send message error:', error);
        }
    });

    // Handle video call events (your existing code)
    socket.emit('me', socket.id);
    
    socket.on('callUser', ({ userToCall, signal, from }) => {
        console.log(`Call request from ${from} to ${userToCall}`);
        io.to(userToCall).emit('callUser', {
            signal,
            from,
            name: authenticatedUsers.get(from)?.username || 'Unknown User'
        });
    });

    socket.on('answerCall', ({ to, signal }) => {
        console.log(`Call answered by ${socket.id} to ${to}`);
        io.to(to).emit('callAccepted', { 
            signal,
            from: socket.id
        });
    });

    // Video consultation handlers
    socket.on('join-video-room', (roomId) => {
        const userId = socket.handshake.auth.userId || socket.id;
        console.log(`User ${userId} (Socket: ${socket.id}) joining video room ${roomId}`);
        
        // Track users in room
        if (!roomUsers.has(roomId)) {
            roomUsers.set(roomId, new Set());
        }
        roomUsers.get(roomId).add(userId);
        
        socket.join(roomId);
        
        const usersInRoom = roomUsers.get(roomId);
        console.log(`Room ${roomId} users:`, Array.from(usersInRoom));
        console.log(`Number of users in room: ${usersInRoom.size}`);

        // If this is the second unique user, notify both
        if (usersInRoom.size === 2) {
            console.log(`Two unique users in room ${roomId}, emitting user-joined`);
            io.to(roomId).emit('user-joined');
        }
    });

    socket.on('offer', (offer, roomId) => {
        console.log(`Received offer for room ${roomId}`);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
        console.log(`Received answer for room ${roomId}`);
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, roomId) => {
        console.log(`Received ICE candidate for room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', candidate);
    });
});

server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
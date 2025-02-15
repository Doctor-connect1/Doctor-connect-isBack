import { Server } from 'socket.io';
import { createServer } from 'http';
import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

let io: Server;

export async function GET(req: Request) {
  if (!io) {
    const httpServer = createServer();
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('join-video-room', (roomId) => {
        console.log(`Socket ${socket.id} joining room ${roomId}`);
        socket.join(roomId);
        
        const room = io.sockets.adapter.rooms.get(roomId);
        const numClients = room ? room.size : 0;
        console.log(`Clients in room ${roomId}: ${numClients}`);

        socket.to(roomId).emit('user-joined');
      });

      socket.on('offer', (offer, roomId) => {
        console.log(`Received offer from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit('offer', offer);
      });

      socket.on('answer', (answer, roomId) => {
        console.log(`Received answer from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit('answer', answer);
      });

      socket.on('ice-candidate', (candidate, roomId) => {
        console.log(`Received ICE candidate from ${socket.id} for room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', candidate);
      });

      socket.on('message', (message) => {
        console.log('Message received:', message);
        // Broadcast the message to all clients in the room except sender
        socket.to(message.roomId).emit('message', {
          ...message,
          sender: message.sender === 'You' ? 'Doctor' : 'You'
        });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    console.log('Starting socket server on port 3001');
    httpServer.listen(3001);
  }

  return new Response('Socket server running');
}

export const POST = GET;
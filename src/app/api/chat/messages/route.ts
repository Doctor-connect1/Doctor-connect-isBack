import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get messages for a specific chat room
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatroomId = searchParams.get('chatroomId');

    if (!chatroomId) {
      return NextResponse.json({ error: 'Missing chatroomId' }, { status: 400 });
    }

    const messages = await prisma.chatroomMessage.findMany({
      where: {
        chatroomID: parseInt(chatroomId)
      },
      orderBy: {
        sentAt: 'asc'
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const { chatroomId, senderId, message } = await request.json();

    const newMessage = await prisma.chatroomMessage.create({
      data: {
        chatroomID: parseInt(chatroomId),
        senderID: parseInt(senderId),
        messageText: message,
        sentAt: new Date()
      }
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

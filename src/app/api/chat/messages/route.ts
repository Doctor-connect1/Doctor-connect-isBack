import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number; role: string };
    const { chatroomId, senderId, messageText } = await request.json();

    const message = await prisma.chatroomMessage.create({
      data: {
        chatroomID: chatroomId,
        senderID: senderId,
        messageText,
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number; role: string };
    const { searchParams } = new URL(request.url);
    const chatroomId = searchParams.get('chatroomId');

    if (!chatroomId) {
      return NextResponse.json(
        { message: 'Missing chatroom ID' },
        { status: 400 }
      );
    }

    const messages = await prisma.chatroomMessage.findMany({
      where: {
        chatroomID: parseInt(chatroomId)
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      },
      orderBy: {
        sentAt: 'asc'
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
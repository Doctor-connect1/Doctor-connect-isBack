import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    const { doctorId, patientId } = body;

    // Validate IDs
    if (!doctorId || !patientId) {
      return NextResponse.json(
        { message: 'Missing required fields: doctorId and patientId' },
        { status: 400 }
      );
    }

    // Check if chatroom already exists
    const existingChatroom = await prisma.chatrooms.findFirst({
      where: {
        AND: [
          { doctorID: Number(doctorId) },
          { patientID: Number(patientId) }
        ]
      }
    });

    if (existingChatroom) {
      return NextResponse.json({ chatroom: existingChatroom });
    }

    // Create new chatroom
    const chatroom = await prisma.chatrooms.create({
      data: {
        doctorID: Number(doctorId),
        patientID: Number(patientId),
        startTime: new Date(),
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    console.log('Created chatroom:', chatroom); // Debug log
    return NextResponse.json({ chatroom }, { status: 201 });

  } catch (error) {
    console.error('Server error details:', error); // Debug log
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
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
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get chatrooms based on user role
    const chatrooms = await prisma.chatrooms.findMany({
      where: role === 'Doctor' 
        ? { doctorID: parseInt(userId) }
        : { patientID: parseInt(userId) },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          }
        },
        messages: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 1,
        }
      }
    });

    return NextResponse.json({ chatrooms });
  } catch (error) {
    console.error('Get chatrooms error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
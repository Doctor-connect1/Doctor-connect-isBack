import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get chat rooms for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing userId or role' },
        { status: 400 }
      );
    }

    const rooms = await prisma.chatrooms.findMany({
      where: role === 'Doctor' 
        ? { doctorID: parseInt(userId) }
        : { patientID: parseInt(userId) },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// Create a new chat room
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('1. Received request body:', body);

    const doctorId = parseInt(body.doctorId);
    const patientId = parseInt(body.patientId);
    console.log('2. Parsed IDs:', { doctorId, patientId });

    // Get users first
    const [doctorUser, patientUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: doctorId }
      }),
      prisma.user.findUnique({
        where: { id: patientId }
      })
    ]);
    console.log('3. Found users:', {
      doctor: { exists: !!doctorUser, id: doctorUser?.id, role: doctorUser?.role },
      patient: { exists: !!patientUser, id: patientUser?.id, role: patientUser?.role }
    });

    if (!doctorUser || !patientUser) {
      return NextResponse.json({ error: 'Users not found' }, { status: 404 });
    }

    // Create or get doctor profile
    let doctor = await prisma.doctor.findFirst({
      where: { userId: doctorId }
    });

    if (!doctor) {
      console.log('4. Creating doctor profile');
      doctor = await prisma.doctor.create({
        data: {
          userId: doctorId,
          firstName: doctorUser.firstName || '',
          lastName: doctorUser.lastName || '',
          email: doctorUser.email,
          password: doctorUser.password,
          phone: '0000000000', // Default value
          specialty: 'General',
          experience: 0
        }
      });
    }

    // Create or get patient profile
    let patient = await prisma.patient.findFirst({
      where: { userId: patientId }
    });

    if (!patient) {
      console.log('5. Creating patient profile');
      patient = await prisma.patient.create({
        data: {
          userId: patientId,
          firstName: patientUser.firstName || '',
          lastName: patientUser.lastName || '',
          email: patientUser.email,
          password: patientUser.password,
          phone: '0000000000', // Default value
          dateOfBirth: new Date(),
          gender: 'Male'
        }
      });
    }

    console.log('6. Profiles:', {
      doctor: { id: doctor.id, userId: doctor.userId },
      patient: { id: patient.id, userId: patient.userId }
    });

    // Find or create room
    let room = await prisma.chatrooms.findFirst({
      where: {
        AND: [
          { doctorID: doctor.id },
          { patientID: patient.id }
        ]
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!room) {
      console.log('7. Creating new room');
      room = await prisma.chatrooms.create({
        data: {
          doctorID: doctor.id,
          patientID: patient.id
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          patient: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
    }

    return NextResponse.json({ room });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
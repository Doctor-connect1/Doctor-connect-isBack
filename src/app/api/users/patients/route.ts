import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.user.findMany({
      where: {
        role: 'Patient'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        username: true
      }
    });

    return NextResponse.json({ users: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

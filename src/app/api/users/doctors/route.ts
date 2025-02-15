import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'Doctor'
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

    return NextResponse.json({ users: doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

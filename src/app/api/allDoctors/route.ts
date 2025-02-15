import { NextResponse } from 'next/server';  // Import NextResponse for returning JSON responses
import prisma from '@/lib/prisma';  // Adjust the import path according to your project structure

export async function GET(request: Request) {
  try {
    // Fetch all doctors from the database using Prisma
    const doctors = await prisma.doctor.findMany();

    // Return the doctors data in the response as JSON
    return NextResponse.json({
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    
    // Return a JSON error response with status code 500 (Internal Server Error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

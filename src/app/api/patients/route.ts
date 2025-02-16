import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        medicalHistory: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch patients' }, { status: 500 });
  }
}

// Update a specific patient
export async function PUT(request: Request, { params }: { params: { patientId: string } }) {
  try {
    const { patientId } = await params; // Await params to access patientId
    const data = await request.json();

    const updatedPatient = await prisma.patient.update({
      where: { id: Number(patientId) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        medicalHistory: data.medicalHistory,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ success: false, error: 'Failed to update patient' }, { status: 500 });
  }
}

// Fetch all patients (alternative endpoint)
export async function GETAll() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        firstName: true,
        lastName: true,
        medicalHistory: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching all patients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch all patients' }, { status: 500 });
  }
} 
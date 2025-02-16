import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch a specific patient
export async function getPatientData(patientId: number) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
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

  return patient;
}

// Update a specific patient
export async function PUT(request: Request, { params }: { params: { patientId: string } }) {
  try {
    const { patientId } = await params;
    const data = await request.json();

    // Validate input
    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: Number(patientId) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        medicalHistory: data.medicalHistory,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update patient' },
      { status: 500 }
    );
  }
} 
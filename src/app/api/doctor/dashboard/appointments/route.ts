import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Find doctor ID from user ID
    const doctor = await prisma.doctor.findFirst({
      where: { userId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const doctorId = doctor.id;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorID: doctorId,
        appointmentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
      time: new Date(apt.appointmentDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: apt.type || "Appointment",
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

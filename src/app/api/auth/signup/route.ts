import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role, specialty, experience } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and doctor if applicable
    if (role === 'DOCTOR') {
      // Validate doctor-specific fields
      if (!specialty || !experience) {
        return NextResponse.json(
          { error: 'Missing required doctor fields' },
          { status: 400 }
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role,
          },
        });

        // Create doctor
        const doctor = await tx.doctor.create({
          data: {
            userId: user.id,
            name,
            email,
            specialty,
            experience: parseInt(experience),
            isVerified: false,
          },
        });

        return { user, doctor };
      });

      return NextResponse.json({
        success: true,
        message: 'Doctor account created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        }
      });
    } else {
      // Create regular user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

    // Fix JWT signing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    };

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      signOptions
    );
   
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
        token: token,
        role: user.role,
      },
      { status: 201 }
    );
      return NextResponse.json({
        success: true,
        message: 'User account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    }

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { 
        success: false,
        error: 'Error creating account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

const prisma = new PrismaClient();

// Make sure to export the function with this exact name
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received signup data:', body);

    const { firstName, lastName, username, email, password, role } = body;

    // Validate required fields with better error messages
    if (!username || !email || !password || !role) {
      const missingFields = [];
      if (!username) missingFields.push('username');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!role) missingFields.push('role');
      
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Log the role value
    console.log('Role value:', role);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Fix JWT signing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const signOptions: SignOptions = {
      //@ts-ignore
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    };

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      signOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token,
    }, { status: 201 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      sameSite: "strict",
      path: "/"
    });
    return response;
  } catch (error) {
    console.error('Signup error details:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 
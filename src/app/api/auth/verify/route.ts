import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log("Auth header received:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No valid auth header");
      return NextResponse.json(
        { message: 'No token provided' }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;
    console.log("JWT_SECRET exists:", !!jwtSecret);

    if (!jwtSecret) {
      console.log("JWT_SECRET is missing");
      throw new Error('JWT_SECRET is not defined');
    }

    // Log the token being verified
    console.log("Attempting to verify token:", token.substring(0, 20) + "...");
    
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Token successfully verified. Decoded:", decoded);

    return NextResponse.json(
      { valid: true, user: decoded }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: 'Invalid token', error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 401 }
    );
  }
} 
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connection successful!");
    
    // Optional: Count users to verify data access
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: "success", 
      message: "Database connected",
      userCount 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 
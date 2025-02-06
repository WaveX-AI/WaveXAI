import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the database user ID using the Clerk ID
    const userMapping = await prisma.userMapping.findUnique({
      where: { clerkId: clerkUserId }
    });

    if (!userMapping) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch startups for this user
    const startups = await prisma.startup.findMany({
      where: { userId: userMapping.userId },
      select: {
        id: true,
        name: true,
        industry: true,
        sector: true,
        stage: true
      }
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error("Startups fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
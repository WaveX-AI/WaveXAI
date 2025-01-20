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

    // Find the database userId through the mapping
    const userMapping = await prisma.userMapping.findUnique({
      where: {
        clerkId: clerkUserId
      }
    });

    if (!userMapping) {
      console.log("No user mapping found for Clerk ID:", clerkUserId);
      return NextResponse.json([]);  // Return empty array if no mapping exists
    }

    const startups = await prisma.startup.findMany({
      where: {
        userId: userMapping.userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        industry: true,
        sector: true,
        stage: true,
        capital: true,
        createdAt: true,
        matches: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error("Error fetching user startups:", error);
    return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 });
  }
}

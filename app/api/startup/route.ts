import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { createInvestorMatchPrompt } from "@/lib/investorMatch";
import { auth } from "@clerk/nextjs/server";
// import { ChatCompletion } from "openai/resources";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Investor {
  name?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  investmentCriteria?: {
    minInvestment?: number;
    sectors?: string[];
  };
  website?: string;
  fitScore?: number;
  matchReason?: string;
  notablePortfolio?: string;
}


//TODO:new post route handler AFTER UPDATING SCHEMA IN DATABASE.
export async function POST(request: NextRequest) {
  console.log("1. Starting POST request handler");
  
  try {
    const body = await request.json();
    console.log("2. Received request body:", body);

    // Get the authenticated Clerk user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate payload
    if (!body || typeof body !== 'object') {
      console.log("Invalid payload detected:", body);
      return NextResponse.json({ error: "Invalid payload - request body is missing or malformed" }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['email', 'name', 'startupName'] as const;
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log("3. Missing required fields:", missingFields);
      return NextResponse.json({ 
        error: "Missing required fields", 
        fields: missingFields 
      }, { status: 400 });
    }

    // Combine user and startup creation in a single transaction
    const { startup } = await prisma.$transaction(async (tx) => {
      // Create or update the user
      const user = await tx.user.upsert({
        where: { email: body.email },
        update: { name: body.name },
        create: {
          email: body.email,
          name: body.name,
        },
      });

      // Create or update the mapping between Clerk user and database user
      await tx.userMapping.upsert({
        where: { clerkId: clerkUserId },
        update: { userId: user.id },
        create: {
          clerkId: clerkUserId,
          userId: user.id,
        }
      });

      const capital = parseFloat(body.capitalRequired.replace(/[^0-9.]/g, ''));
      if (isNaN(capital)) {
        throw new Error("Invalid capital amount");
      }

      // Create the startup with the database userId
      const startup = await tx.startup.create({
        data: {
          name: body.startupName,
          industry: body.industry,
          sector: body.sector,
          stage: body.stage,
          description: body.description,
          capital,
          userId: user.id, // Using the database userId, not the Clerk userId
        },
      });

      return { startup };
    });

// export async function POST(request: NextRequest) {
//   console.log("1. Starting POST request handler");
  
//   try {
//     const body = await request.json();
//     console.log("2. Received request body:", body);

//     // Validate payload
//     if (!body || typeof body !== 'object') {
//       console.log("Invalid payload detected:", body);
//       return NextResponse.json({ error: "Invalid payload - request body is missing or malformed" }, { status: 400 });
//     }

//     // Validate required fields
//     const requiredFields = ['email', 'name', 'startupName'] as const;
//     const missingFields = requiredFields.filter(field => !body[field]);
    
//     if (missingFields.length > 0) {
//       console.log("3. Missing required fields:", missingFields);
//       return NextResponse.json({ 
//         error: "Missing required fields", 
//         fields: missingFields 
//       }, { status: 400 });
//     }

//     // Combine user and startup creation in a single transaction
//     const { startup } = await prisma.$transaction(async (tx) => {
//       const user = await tx.user.upsert({
//         where: { email: body.email },
//         update: { name: body.name },
//         create: {
//           email: body.email,
//           name: body.name,
//         },
//       });

//       const capital = parseFloat(body.capitalRequired.replace(/[^0-9.]/g, ''));
//       if (isNaN(capital)) {
//         throw new Error("Invalid capital amount");
//       }

//       const startup = await tx.startup.create({
//         data: {
//           name: body.startupName,
//           industry: body.industry,
//           sector: body.sector,
//           stage: body.stage,
//           description: body.description,
//           capital,
//           userId: user.id,
//         },
//       });

//       return { startup };
//     });

    // Add timeout to OpenAI call
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
          { 
            role: "system", 
            content: `You are an expert AI investment analyst. Your primary task is to identify and match investors with startups based on:
              1. Industry/sector alignment
              2. Investment stage compatibility
              3. Investment size requirements
              4. Geographic considerations
              5. Strategic value add potential
      
              Always return at least 10 real, active investors that match the criteria.
              Each investor must include complete contact details and investment criteria.` 
          },
          { 
            role: "user", 
            content: createInvestorMatchPrompt({
              startupName: body.startupName,
              industry: body.industry,
              sector: body.sector,
              stage: body.stage,
              description: body.description,
              capitalRequired: body.capitalRequired,
            })
          }
        ],
        temperature: 0.9,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("OpenAI request timeout")), 60000)
      )
    ]) as { choices: { message: { content: string } }[] };

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI API returned empty content");
    }
    
    const analysis = JSON.parse(content);

    if (!analysis.investors || !Array.isArray(analysis.investors)) {
      throw new Error("Invalid or missing investors array in OpenAI response");
    }

    // Store matches in batches
    const investors = analysis.investors;
    for (let i = 0; i < investors.length; i += 5) {
      const batch = investors.slice(i, i + 5);
      await prisma.$transaction(
        batch.map((investor: Investor) => 
          prisma.match.create({
            data: {
              startupId: startup.id,
              vcName: investor.name || "Unknown",
              contactInfo: JSON.stringify(investor.contactInfo || {}),
              minimumInvestment: investor.investmentCriteria?.minInvestment || 0,
              sectors: (investor.investmentCriteria?.sectors || []).join(", "),
              website: investor.website || "N/A",
              fitScore: investor.fitScore || 0,
              matchReason: investor.matchReason || "N/A",
              notablePortfolio: investor.notablePortfolio || "N/A",
            },
          })
        )
      );
    }

    // Get complete startup data with matches
    const completeStartup = await prisma.startup.findUnique({
      where: { id: startup.id },
      include: {
        user: true,
        matches: true,
      },
    });

    return NextResponse.json({ 
      message: "Startup created and analyzed successfully",
      startup: completeStartup,
      analysis: analysis
    });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
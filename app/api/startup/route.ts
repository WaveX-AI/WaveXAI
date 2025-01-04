import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { createInvestorMatchPrompt } from "@/lib/investorMatch";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Remove the unused ApiError type
// type ApiError = {
//   message: string;
//   code?: string;
//   stack?: string;
// };

// Define an interface for the investor object
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
  notablePortfolio?: string[];
}

export async function POST(request: NextRequest) {
  console.log("1. Starting POST request handler");
  
  try {
    const body = await request.json();
    console.log("2. Received request body:", body);

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

    // User creation/update
    console.log("4. Creating/updating user:", { email: body.email, name: body.name });
    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: { name: body.name },
      create: {
        email: body.email,
        name: body.name,
      },
    });
    console.log("5. User operation completed:", user);

    // Capital conversion
    const capital = parseFloat(body.capitalRequired.replace(/[^0-9.]/g, ''));
    if (isNaN(capital)) {
      console.log("Invalid capital amount provided:", body.capitalRequired);
      return NextResponse.json({ error: "Invalid capital amount" }, { status: 400 });
    }
    console.log("6. Parsed capital amount:", capital);

    // Startup creation
    const startupData = {
      name: body.startupName,
      industry: body.industry,
      sector: body.sector,
      stage: body.stage,
      description: body.description,
      capital,
      userId: user.id,
    };
    console.log("7. Creating startup with data:", startupData);

    const startup = await prisma.startup.create({
      data: startupData,
    });
    console.log("8. Startup created successfully:", startup);

    // Generate OpenAI analysis
    console.log("9. Generating OpenAI prompt with startup data");
    const prompt = createInvestorMatchPrompt({
      startupName: body.startupName,
      industry: body.industry,
      sector: body.sector,
      stage: body.stage,
      description: body.description,
      capitalRequired: body.capitalRequired,
    });

    console.log("10. Calling OpenAI API");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an expert AI investment analyst. Provide detailed investor matches in the exact JSON format requested." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI API returned empty content");
    }
    
    console.log("Raw OpenAI response:", content);
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return NextResponse.json({ error: "Error parsing OpenAI response" }, { status: 500 });
    }
    console.log("11. Parsed OpenAI analysis:", analysis);

    if (!analysis.investors || !Array.isArray(analysis.investors)) {
      console.error("Invalid or missing investors array in OpenAI response");
      return NextResponse.json({ error: "Invalid OpenAI response format" }, { status: 500 });
    }

    // Store investor matches in database
    console.log("12. Storing investor matches in database");
    const matchPromises = analysis.investors.map((investor: Investor) => {
      return prisma.match.create({
        data: {
          startupId: startup.id,
          vcName: investor.name || "Unknown",
          contactInfo: JSON.stringify(investor.contactInfo || {}),
          minimumInvestment: investor.investmentCriteria?.minInvestment || 0,
          sectors: (investor.investmentCriteria?.sectors || []).join(", "),
          website: investor.website || "N/A",
          fitScore: investor.fitScore || 0,
          matchReason: investor.matchReason || "N/A",
          notablePortfolio: Array.isArray(investor.notablePortfolio) ? investor.notablePortfolio.join(", ") : "N/A",
        },
      });
    });

    const matches = await Promise.all(matchPromises);
    console.log("13. Successfully stored matches:", matches);

    // Get complete startup data with matches
    const completeStartup = await prisma.startup.findUnique({
      where: { id: startup.id },
      include: {
        user: true,
        matches: true,
      },
    });

    console.log("14. Returning complete response");

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
    console.log("15. Database connection closed");
  }
}
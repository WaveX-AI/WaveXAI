import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const prisma = new PrismaClient()
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  // cache: true 
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { startupId: string } }
) {
  const { startupId } = params

  try {
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: { matches: true }
    })

    if (!startup) {
      return NextResponse.json([], { status: 404 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: "Generate 6-month trend projection for startup metrics in JSON format with caching" 
        },
        { 
          role: "user", 
          content: `Please provide a JSON trend projection for:
            Startup: ${startup.name}
            Industry: ${startup.industry}
            Sector: ${startup.sector}
            Initial Capital: $${startup.capital}
            Investor Matches: ${startup.matches.length}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      // cache: true,
      response_format: { type: "json_object" }
    })

    console.log("Raw Completion:", completion);
    console.log("Message Content:", completion.choices[0].message.content);

    const trendContent = JSON.parse(completion.choices[0].message.content || '{}')

    const trendData = [
      { 
        month: "Jan", 
        funding: trendContent.janFunding || 50, 
        growth: trendContent.janGrowth || 30, 
        marketFit: trendContent.janMarketFit || 65 
      },
      { 
        month: "Feb", 
        funding: trendContent.febFunding || 55, 
        growth: trendContent.febGrowth || 32, 
        marketFit: trendContent.febMarketFit || 68 
      },
      { 
        month: "Mar", 
        funding: trendContent.marFunding || 60, 
        growth: trendContent.marGrowth || 35, 
        marketFit: trendContent.marMarketFit || 70 
      },
      { 
        month: "Apr", 
        funding: trendContent.aprFunding || 58, 
        growth: trendContent.aprGrowth || 38, 
        marketFit: trendContent.aprMarketFit || 73 
      },
      { 
        month: "May", 
        funding: trendContent.mayFunding || 62, 
        growth: trendContent.mayGrowth || 40, 
        marketFit: trendContent.mayMarketFit || 75 
      },
      { 
        month: "Jun", 
        funding: trendContent.junFunding || 65, 
        growth: trendContent.junGrowth || 45, 
        marketFit: trendContent.junMarketFit || 80 
      }
    ]

    return NextResponse.json(trendData)
  } catch (error) {
    console.error("Trend generation error:", error)
    return NextResponse.json([], { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
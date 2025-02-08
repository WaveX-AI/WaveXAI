import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const prisma = new PrismaClient()
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { startupId: string } }
) {
  const { startupId } = params

  try {
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: { 
        matches: true, 
        user: true
      }
    })

    if (!startup) {
      return NextResponse.json(null, { status: 404 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: "Provide a comprehensive startup analysis as an Investor in JSON FORMAT" 
        },
        { 
          role: "user", 
          content: `Perform a detailed startup analysis:
            Startup: ${startup.name}
            Industry: ${startup.industry}
            Sector: ${startup.sector}
            Stage: ${startup.stage}
            Initial Capital: $${startup.capital}
            Investor Matches: ${startup.matches.length}

            Provide:
            - Key strengths (3-4 points)
            - Strategic recommendations (3-4 points)
            - Comprehensive market analysis paragraph based on the startup Idea and its Value Proposition`
        }
      ],
      temperature: 0.6,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const analysisContent = JSON.parse(completion.choices[0].message.content || '{}')

    const analysis = {
      strengths: analysisContent.strengths || [
        "Innovative approach to market challenges",
        "Strong initial capital base",
        "Promising investor interest"
      ],
      recommendations: analysisContent.recommendations || [
        "Focus on targeted market segmentation",
        "Develop robust go-to-market strategy",
        "Enhance product-market fit"
      ],
      marketAnalysis: analysisContent.marketAnalysis || 
        "The startup shows potential in a competitive landscape, with unique value propositions that distinguish it from existing solutions."
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Analysis generation error:", error)
    return NextResponse.json(null, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
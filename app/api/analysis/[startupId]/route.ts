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
          content: `Generate a comprehensive startup analysis in strict JSON format with these keys:
            {
              "strengths": ["strength1", "strength2", "strength3"],
              "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
              "marketAnalysis": "Detailed market analysis paragraph"
            }` 
        },
        { 
          role: "user", 
          content: `Detailed startup analysis for:
            - Name: ${startup.name}
            - Industry: ${startup.industry}
            - Sector: ${startup.sector}
            - Stage: ${startup.stage}
            - Initial Capital: $${startup.capital}
            - Investor Matches: ${startup.matches.length}

            Provide:
            1. 3-4 key strengths highlighting unique competitive advantages
            2. 3-4 strategic recommendations for growth
            3. Comprehensive market analysis assessing potential and challenges`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    // Robust parsing with fallback
    const rawContent = completion.choices[0].message.content
    let analysisContent;

    try {
      analysisContent = JSON.parse(rawContent || '{}')
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError)
      analysisContent = {}
    }

    const analysis = {
      strengths: analysisContent.strengths?.length > 0 
        ? analysisContent.strengths 
        : [
            "Innovative approach to market challenges",
            "Strong initial capital base",
            "Promising investor interest"
          ],
      recommendations: analysisContent.recommendations?.length > 0
        ? analysisContent.recommendations
        : [
            "Focus on targeted market segmentation",
            "Develop robust go-to-market strategy", 
            "Enhance product-market fit"
          ],
      marketAnalysis: analysisContent.marketAnalysis || 
        `The startup demonstrates significant potential in a competitive landscape, 
        with unique value propositions that distinguish it from existing solutions.`
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Analysis generation error:", error)
    return NextResponse.json(null, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
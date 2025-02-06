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
      include: { matches: true, user: true }
    })

    if (!startup) {
      return NextResponse.json([], { status: 404 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: "Generate comprehensive startup performance metrics in JSON format" 
        },
        { 
          role: "user", 
          content: `Please analyze startup and provide metrics in JSON format: 
            Name: ${startup.name}
            Industry: ${startup.industry}
            Sector: ${startup.sector}
            Stage: ${startup.stage}
            Capital: $${startup.capital}
            Investor Matches: ${startup.matches.length}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const analysisContent = JSON.parse(completion.choices[0].message.content || '{}')

    const analysisData = [
      { 
        category: "Funding", 
        value: Math.round((analysisContent.startup.capital || 250000) / 5000) || "N/A", 
        previousValue: 50, 
        change: 30 
      },
      { 
        category: "Growth", 
        value: analysisContent.startup.performance_metrics?.traction?.value || 45, 
        previousValue: 40, 
        change: 12.5 
      },
      { 
        category: "Market Fit", 
        value: ['Prototype', 'Minimum Viable Product', 'Market Ready'].indexOf(analysisContent.startup.stage) * 25 + 50, 
        previousValue: 75, 
        change: 6.67 
      },
      { 
        category: "Team", 
        value: analysisContent.startup.performance_metrics?.traction?.value || 70, 
        previousValue: 65, 
        change: 7.69 
      },
      { 
        category: "Innovation", 
        value: Math.round(Math.random() * 50) + 50, 
        previousValue: 60, 
        change: -8.33 
      }
    ]

    return NextResponse.json(analysisData)
  } catch (error) {
    console.error("Analysis generation error:", error)
    return NextResponse.json([], { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
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
      where: { id: startupId }
    })

    if (!startup) {
      return NextResponse.json([], { status: 404 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { 
          role: "system", 
          content: "Generate monthly challenges for a startup in JSON FORMAT" 
        },
        { 
          role: "user", 
          content: `Generate monthly challenges:
            Startup: ${startup.name}
            Industry: ${startup.industry}
            Sector: ${startup.sector}
            Stage: ${startup.stage}

            Provide 6 unique, progressively complex monthly challenges`
        }
      ],
      temperature: 0.6,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const challengesContent = JSON.parse(completion.choices[0].message.content || '{}')

    const challengeMonths = ['January', 'February', 'March', 'April', 'May', 'June']
    const challenges = challengeMonths.map((month) => ({
      month,
      challenge: challengesContent[month] || `Develop strategic milestone for ${month}`,
      completed: false
    }))

    return NextResponse.json(challenges)
  } catch (error) {
    console.error("Challenges generation error:", error)
    return NextResponse.json([], { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startupName, industry, description, capital } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing compelling investor outreach emails. Create a professional, concise email that highlights the startup's value proposition and investment opportunity."
        },
        {
          role: "user",
          content: `Write an email to potential investors for a startup with the following details:
            - Name: ${startupName}
            - Industry: ${industry}
            - Description: ${description}
            - Capital Seeking: $${capital.toLocaleString()}`
        }
      ]
    });

    return NextResponse.json({ 
      content: completion.choices[0].message.content 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate email content" },
      { status: 500 }
    );
  }
}
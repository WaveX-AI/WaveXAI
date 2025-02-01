import { NextResponse } from "next/server"

export async function GET() {
  // This is where you would typically fetch data from a database or external API
  const analysisData = [
    { category: "Funding", value: 65, previousValue: 50, change: 30 },
    { category: "Growth", value: 45, previousValue: 40, change: 12.5 },
    { category: "Market Fit", value: 80, previousValue: 75, change: 6.67 },
    { category: "Team", value: 70, previousValue: 65, change: 7.69 },
    { category: "Innovation", value: 55, previousValue: 60, change: -8.33 },
  ]

  return NextResponse.json(analysisData)
}


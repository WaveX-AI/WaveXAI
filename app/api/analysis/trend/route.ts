import { NextResponse } from "next/server"

export async function GET() {
  // This is where you would typically fetch data from a database or external API
  const trendData = [
    { month: "Jan", funding: 50, growth: 30, marketFit: 65 },
    { month: "Feb", funding: 55, growth: 32, marketFit: 68 },
    { month: "Mar", funding: 60, growth: 35, marketFit: 70 },
    { month: "Apr", funding: 58, growth: 38, marketFit: 73 },
    { month: "May", funding: 62, growth: 40, marketFit: 75 },
    { month: "Jun", funding: 65, growth: 45, marketFit: 80 },
  ]

  return NextResponse.json(trendData)
}


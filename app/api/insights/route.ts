import { NextResponse } from "next/server"

export async function GET() {
  // This is where you would typically fetch data from a database or external API
  const insights = [
    {
      id: "1",
      title: "AI Investment Surge",
      description: "AI and machine learning startups are seeing a 30% increase in investment compared to last quarter.",
      category: "market",
      impact: "positive",
      relevanceScore: 85,
      trendDirection: "up",
    },
    {
      id: "2",
      title: "New Clean Energy Grants",
      description:
        "Government announces $500M in new grants available for clean energy startups, applications opening next month.",
      category: "funding",
      impact: "positive",
      relevanceScore: 70,
      trendDirection: "up",
    },
    {
      id: "3",
      title: "Tech Talent Shortage",
      description:
        "Growing shortage of experienced developers in blockchain and AI fields, potentially slowing growth for some startups.",
      category: "growth",
      impact: "negative",
      relevanceScore: 60,
      trendDirection: "down",
    },
    {
      id: "4",
      title: "Regulatory Changes",
      description:
        "Upcoming changes in data privacy regulations may impact SaaS startups. Compliance deadline in 6 months.",
      category: "risk",
      impact: "neutral",
      relevanceScore: 75,
      trendDirection: "stable",
    },
    {
      id: "5",
      title: "Remote Work Trend",
      description: "Continued preference for remote work is driving demand for collaboration and productivity tools.",
      category: "market",
      impact: "positive",
      relevanceScore: 80,
      trendDirection: "up",
    },
  ]

  return NextResponse.json(insights)
}


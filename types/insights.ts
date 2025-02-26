// types.ts

export interface Insight {
    id: string;
    title: string;
    description: string;
    category: string[];
    impact: "positive" | "negative" | "neutral";
    relevanceScore: number;
    trendDirection: "up" | "down" | "stable";
  }
  
  export const mockInsights: Insight[] = [
    {
      id: "1",
      title: "AI Market Growth Acceleration",
      description: "Significant increase in AI adoption across startups, indicating a potential market expansion opportunity.",
      category: ["Market", "Growth"],
      impact: "positive",
      relevanceScore: 95,
      trendDirection: "up"
    },
    {
      id: "2",
      title: "Venture Capital Funding Slowdown",
      description: "Recent decrease in early-stage funding rounds may impact startup fundraising strategies.",
      category: ["Funding", "Risk"],
      impact: "negative",
      relevanceScore: 88,
      trendDirection: "down"
    },
    {
      id: "3",
      title: "Remote Work Technology Demand",
      description: "Steady demand for remote collaboration tools presents ongoing market opportunities.",
      category: ["Market"],
      impact: "neutral",
      relevanceScore: 75,
      trendDirection: "stable"
    },
    {
      id: "4",
      title: "Regulatory Changes in Fintech",
      description: "New financial regulations may require adjustments to business models in the fintech sector.",
      category: ["Risk"],
      impact: "negative",
      relevanceScore: 92,
      trendDirection: "down"
    },
    {
      id: "5",
      title: "Sustainable Tech Investment Surge",
      description: "Growing investor interest in sustainable technology solutions creates new funding opportunities.",
      category: ["Funding", "Growth"],
      impact: "positive",
      relevanceScore: 85,
      trendDirection: "up"
    }
  ];
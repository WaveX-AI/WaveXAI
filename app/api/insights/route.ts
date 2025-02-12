import { NextResponse } from "next/server";
import OpenAI from "openai";

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string[];
  impact: "positive" | "negative" | "neutral";
  relevanceScore: number;
  trendDirection: "up" | "down" | "stable";
}

interface OpenAIArticle {
  articles: {
    title: string;
    description: string;
    category: string[];
  }[];
}

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 5 unique startup news articles. Return in this exact JSON format:
          {
            "articles": [
              {
                "title": "Clear impactful title",
                "description": "Detailed description with facts and figures",
                "category": ["Primary Category", "Secondary Category"]
              }
            ]
          }
          Categories must be exactly: "Market", "Funding", "Growth", or "Risk".
          Each article must have 2 categories.
          Include specific numbers and percentages in descriptions.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const insightsContent = completion.choices[0].message.content;
    const parsedInsights = JSON.parse(insightsContent || '{}') as OpenAIArticle;

    const insights: Insight[] = parsedInsights.articles.map((article, index) => ({
      id: `generated-${index}`,
      title: article.title,
      description: article.description,
      category: normalizeCategories(article.category),
      impact: determineImpact(article),
      relevanceScore: calculateRelevanceScore(article),
      trendDirection: determineTrendDirection(article)
    }));

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' }, 
      { status: 500 }
    );
  }
}

function normalizeCategories(categories: string[]): string[] {
  const validCategories = ['Market', 'Funding', 'Growth', 'Risk'];
  
  const normalized = categories
    .map(cat => {
      const normalized = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      return validCategories.includes(normalized) ? normalized : 'Market';
    })
    .slice(0, 2);
  
  // Ensure we always have 2 categories
  if (normalized.length === 1) {
    normalized.push(validCategories.find(cat => cat !== normalized[0]) || 'Market');
  }
  
  return normalized;
}

function determineImpact(article: { title: string; description: string }): "positive" | "negative" | "neutral" {
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  const positiveIndicators = ['growth', 'increase', 'success', 'boost', 'surge', 'improvement', 'profit'];
  const negativeIndicators = ['decline', 'decrease', 'risk', 'challenge', 'threat', 'loss', 'crisis'];
  
  const positiveScore = positiveIndicators.filter(word => text.includes(word)).length;
  const negativeScore = negativeIndicators.filter(word => text.includes(word)).length;
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

function calculateRelevanceScore(article: { title: string; description: string }): number {
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  // Factors that increase relevance
  const factors = [
    { pattern: /\d+%/, weight: 10 },  // Percentage figures
    { pattern: /\$\d+/, weight: 8 },  // Dollar amounts
    { pattern: /million|billion/, weight: 6 }, // Large numbers
    { pattern: /market|industry/, weight: 5 }, // Market terms
    { pattern: /startup|tech|innovation/, weight: 4 }, // Tech terms
    { pattern: /growth|decline/, weight: 3 }, // Trend terms
  ];
  
  let score = 50; // Base score
  
  factors.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) {
      score += weight;
    }
  });
  
  // Normalize score between 0 and 100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function determineTrendDirection(article: { title: string; description: string }): "up" | "down" | "stable" {
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  const upTrends = ['increase', 'growth', 'rise', 'surge', 'boost', 'improvement'];
  const downTrends = ['decrease', 'decline', 'fall', 'drop', 'reduce', 'loss'];
  
  const upScore = upTrends.filter(word => text.includes(word)).length;
  const downScore = downTrends.filter(word => text.includes(word)).length;
  
  if (upScore > downScore) return 'up';
  if (downScore > upScore) return 'down';
  return 'stable';
}
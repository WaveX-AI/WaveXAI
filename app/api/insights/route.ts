import { NextResponse } from "next/server"
import { OpenAI } from 'openai';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string[];
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
          content: "Generate 5 unique startup news articles across Market, Funding, Growth, and Risk categories. Ensure each article has a primary and secondary category. Provide detailed insights with clear categorization. in JSON FORMAT"
        },
        {
          role: "user", 
          content: "Create comprehensive startup ecosystem articles. Focus on precise categorization: Primary category should be the most relevant, secondary categories provide context. Include industry-specific details. IN json format"
        }
      ],
      response_format: { type: "json_object" }
    });

    const insightsContent = completion.choices[0].message.content;
    const parsedInsights = JSON.parse(insightsContent || '{}');

    const insights = parsedInsights.articles.map((article: Article, index: number) => ({
      id: `generated-${index}`,
      title: article.title,
      description: article.description || '',
      category: normalizeCategories(article.category),
      impact: getImpactFromArticle(article),
      relevanceScore: calculateRelevanceScore(article),
      trendDirection: getTrendDirection(article)
    }));

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json([], { status: 500 });
  }
}

function normalizeCategories(categories: string[]): string[] {
  const validCategories = ['market', 'funding', 'growth', 'risk', 'startup'];
  
  // Ensure categories are lowercase and valid
  return (categories || ['startup'])
    .map(cat => cat.toLowerCase())
    .filter(cat => validCategories.includes(cat))
    .length > 0 
    ? (categories || ['startup']).map(cat => cat.toLowerCase())
    : ['startup'];
}

function calculateRelevanceScore(article: Article): number {
  const categories = normalizeCategories(article.category);
  const primaryCategory = categories[0];
  
  // Detailed scoring weights
  const categoryScores: { [key: string]: { baseScore: number; scoreMultipliers: { titleLength: number; descriptionLength: number; keywordBoost: number; }; keywords: string[]; } } = {
    'market': {
      baseScore: 25,
      scoreMultipliers: {
        titleLength: 0.2,
        descriptionLength: 0.3,
        keywordBoost: 10
      },
      keywords: ['trend', 'market', 'analysis', 'innovation']
    },
    'funding': {
      baseScore: 30,
      scoreMultipliers: {
        titleLength: 0.25,
        descriptionLength: 0.35,
        keywordBoost: 15
      },
      keywords: ['investment', 'funding', 'round', 'capital']
    },
    'growth': {
      baseScore: 20,
      scoreMultipliers: {
        titleLength: 0.15,
        descriptionLength: 0.25,
        keywordBoost: 8
      },
      keywords: ['expansion', 'scaling', 'growth', 'strategy']
    },
    'risk': {
      baseScore: 15,
      scoreMultipliers: {
        titleLength: 0.1,
        descriptionLength: 0.2,
        keywordBoost: 5
      },
      keywords: ['challenge', 'risk', 'threat', 'mitigation']
    },
    'startup': {
      baseScore: 10,
      scoreMultipliers: {
        titleLength: 0.05,
        descriptionLength: 0.1,
        keywordBoost: 3
      },
      keywords: ['startup', 'new', 'emerging']
    }
  };

  const categoryConfig = categoryScores[primaryCategory] || categoryScores['startup'];
  
  let score = categoryConfig.baseScore;

  // Length-based scoring
  const title = article.title || '';
  const description = article.description || '';
  
  score += title.length * categoryConfig.scoreMultipliers.titleLength;
  score += description.length * categoryConfig.scoreMultipliers.descriptionLength;

  // Keyword boost
  const lowercaseTitle = title.toLowerCase();
  categoryConfig.keywords.forEach(keyword => {
    if (lowercaseTitle.includes(keyword)) {
      score += categoryConfig.scoreMultipliers.keywordBoost;
    }
  });

  // Secondary category consideration
  if (categories.length > 1) {
    const secondaryCategory = categories[1];
    const secondaryCategoryBoost = (categoryScores[secondaryCategory as keyof typeof categoryScores]?.baseScore) || 0;
    score += secondaryCategoryBoost * 0.5;
  }

  // Trend impact
  const trendDirection = getTrendDirection(article);
  score += trendDirection === 'up' ? 5 : trendDirection === 'down' ? -3 : 0;

  // Ensure score is between 0 and 100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function getImpactFromArticle(article: Article): string {
  const title = (article.title || '').toLowerCase();
  const positiveKeywords = ['growth', 'investment', 'funding', 'success'];
  const negativeKeywords = ['challenge', 'decline', 'struggle', 'risk'];

  if (positiveKeywords.some(keyword => title.includes(keyword))) return 'positive';
  if (negativeKeywords.some(keyword => title.includes(keyword))) return 'negative';
  return 'neutral';
}

function getTrendDirection(article: Article): string {
  const title = (article.title || '').toLowerCase();
  if (title.includes('grow') || title.includes('invest')) return 'up';
  if (title.includes('decline') || title.includes('risk')) return 'down';
  return 'stable';
}
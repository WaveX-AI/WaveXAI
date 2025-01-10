import OpenAI from 'openai';
import { ValidationArea } from './questions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStartupAnalysis(
  startup: { name: string; industry: string; sector: string; stage: string; description: string },
  answers: Record<string, number>,
  areaScores: Record<ValidationArea, number>,
  similarStartups: { name: string; description: string }[]
) {
  const startupInfo = `
    Startup Information:
    Name: ${startup.name}
    Industry: ${startup.industry}
    Sector: ${startup.sector}
    Stage: ${startup.stage}
    Description: ${startup.description}
    
    Assessment Scores:
    ${Object.entries(areaScores)
      .map(([area, score]) => `${area}: ${score}/100`)
      .join('\n')}
    
    Similar Startups in the Industry:
    ${similarStartups.map(s => `${s.name} - ${s.description}`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are an expert startup analyst providing detailed, actionable feedback in a structured JSON format."
      },
      {
        role: "user",
        content: `Analyze this startup and provide detailed feedback in the specified JSON format:
        
        ${startupInfo}
        
        Return the analysis in this exact structure:
        {
          "analysis": "Detailed analysis of the startup's current position",
          "strengths": ["Key strength 1", "Key strength 2", ...],
          "challenges": ["Potential challenge 1", "Potential challenge 2", ...],
          "recommendations": {
            "marketStrategy": ["Strategy 1", "Strategy 2", ...],
            "productDevelopment": ["Development tip 1", "Development tip 2", ...],
            "nextSteps": ["Step 1", "Step 2", ...]
          },
          "similarStartupsAnalysis": {
            "relevantSimilarities": ["Similarity 1", "Similarity 2", ...],
            "keyLearningPoints": ["Learning point 1", "Learning point 2", ...],
            "strategicInsights": ["Insight 1", "Insight 2", ...]
          }
        }`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  const analysisResult = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    analysisNotes: analysisResult.analysis,
    keyStrengths: analysisResult.strengths,
    potentialChallenges: analysisResult.challenges,
    recommendations: {
      marketStrategy: analysisResult.recommendations.marketStrategy,
      productDevelopment: analysisResult.recommendations.productDevelopment,
      nextSteps: analysisResult.recommendations.nextSteps
    },
    similarStartups: analysisResult.similarStartupsAnalysis
  };
}
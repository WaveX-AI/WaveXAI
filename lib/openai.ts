// /* eslint-disable @typescript-eslint/no-explicit-any */
// import OpenAI from 'openai';
// import { ValidationArea } from './questions';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function generateStartupAnalysis(
//   startup: any,
//   answers: Record<string, number>,
//   areaScores: Record<ValidationArea, number>,
//   similarStartups: any[]
// ) {
//   const prompt = `
//     Analyze this startup and provide detailed feedback:
    
//     Startup Information:
//     Name: ${startup.name}
//     Industry: ${startup.industry}
//     Sector: ${startup.sector}
//     Stage: ${startup.stage}
//     Description: ${startup.description}
    
//     Assessment Scores:
//     ${Object.entries(areaScores)
//       .map(([area, score]) => `${area}: ${score}/100`)
//       .join('\n')}
    
//     Similar Startups in the Industry:
//     ${similarStartups.map(s => `${s.name} - ${s.description}`).join('\n')}
    
//     Please provide:
//     1. Detailed analysis of the startup's current position
//     2. Key strengths identified from the assessment
//     3. Potential challenges and risks
//     4. Specific recommendations for:
//        - Market strategy
//        - Product development
//        - Next steps
//     5. Analysis of similar startups:
//        - Relevant similarities
//        - Key learning points
//        - Strategic insights
    
//     Format the response as a structured JSON object.
//   `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4-turbo-preview",
//     messages: [
//       {
//         role: "system",
//         content: "You are an expert startup analyst providing detailed, actionable feedback."
//       },
//       {
//         role: "user",
//         content: prompt
//       }
//     ],
//     temperature: 0.7,
//     max_tokens: 2000
//   });

//   // Parse and structure the response
//   const analysisResult = JSON.parse(response.choices[0].message.content || '{}');
  
//   return {
//     analysisNotes: analysisResult.analysis,
//     keyStrengths: analysisResult.strengths,
//     potentialChallenges: analysisResult.challenges,
//     recommendations: {
//       marketStrategy: analysisResult.recommendations.marketStrategy,
//       productDevelopment: analysisResult.recommendations.productDevelopment,
//       nextSteps: analysisResult.recommendations.nextSteps
//     },
//     similarStartups: analysisResult.similarStartupsAnalysis
//   };
// }
import { StartupFormValues } from "@/types";

export const createInvestorMatchPrompt = (startupData: StartupFormValues) => `
Analyze this startup and provide matching investors:

STARTUP DETAILS
Company: ${startupData.startupName}
Industry: ${startupData.industry}
Sector: ${startupData.sector}
Stage: ${startupData.stage}
Capital Needed: ${startupData.capitalRequired}
Description: ${startupData.description}

Required: Generate a detailed list of at least 10 real, active investors that would be interested in this startup.

Focus on:
1. Industry/sector match
2. Stage appropriateness
3. Investment size alignment
4. Strategic value potential
5. Geographic reach (if relevant)

Return the data in this exact JSON structure:
{
  "analysis": {
    "analysisNotes": "Brief analysis of the investment potential",
    "keyStrengths": ["Key strength 1", "Key strength 2"],
    "potentialChallenges": ["Challenge 1", "Challenge 2"]
  },
  "investors": [
    {
      "name": "VC Firm Name",
      "contactInfo": {
        "email": "contact@vcfirm.com",
        "location": "City, Country"
      },
      "investmentCriteria": {
        "minInvestment": 100000,
        "sectors": ["Sector 1", "Sector 2"]
      },
      "website": "https://vcfirm.com",
      "fitScore": 85,
      "matchReason": "Why this investor is a good match",
      "notablePortfolio": "Notable Company A, Notable Company B"
    }
  ],
  "recommendations": {
    "pitchImprovements": ["Improvement 1", "Improvement 2"],
    "nextSteps": ["Step 1", "Step 2"]
  }
}

Important: Ensure each investor entry includes ALL fields specified in the JSON structure above.
`;
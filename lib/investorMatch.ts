import { StartupFormValues } from "@/types";

export const createInvestorMatchPrompt = (startupData: StartupFormValues) => `
You are an expert AI investment analyst with comprehensive knowledge of the global venture capital and investment landscape. Your task is to analyze the following startup information and identify the most suitable potential investors/VCs based on their investment criteria, sector focus, and typical investment sizes.

Startup Information to Analyze:
- Company Name: ${startupData.startupName}
- Industry: ${startupData.industry}
- Sector: ${startupData.sector}
- Stage: ${startupData.stage}
- Capital Seeking: $${startupData.capitalRequired.toLocaleString()}
- Description: ${startupData.description}

Task Instructions:
1. Carefully analyze the startup's profile, considering:
   - Industry fit and sector specialization
   - Investment stage alignment
   - Capital requirements matching typical investment ranges
   - Potential strategic value add from the investor
   - Geographic considerations if mentioned
   - Current market trends in the sector
   

2. Generate a list of Atleast 25 most relevant potential investors/VCs that:
   - Have a proven track record in the specified industry/sector
   - Typically invest in the mentioned stage
   - Have investment tickets sizes that match the capital requirements
   - Could provide strategic value beyond just capital


3. For each recommended investor, provide:
   - Detailed contact information
   - Investment criteria get more relevant Investors!
   - Notable portfolio companies (if relevant)
   - Why they would be a good fit for this startup

Go through the below given list of websites to for finding relevant Investors that match the startup Data Submitted.
  a. https://confluence.vc/all-investors/
  b. https://docs.google.com/spreadsheets/d/1UA8qsnRXtysw-zxZ8Dg1ogkTqljIWQjZ1mrUlosBBuo/edit?usp=sharing
  c. https://airtable.com/appYlRDIZLwvRPsRh/shrkohpeE2AO2ldeq/tbl5Q8N7NuW22z5Bt
  d. https://www.gritt.io/search-for-investors/
  e. https://impactassets.org/ia50/?filters=
  f. https://dealroom.net/blog/top-venture-capital-firms

Required Output Format:
Return the data in the following JSON structure:

{
  "analysis": {
    "analysisNotes": string, // Brief analysis of why these investors were selected
    "keyStrengths": string[], // List of startup's key attractive points for investors
    "potentialChallenges": string[] // Areas that might need addressing
  },
  "investors": [
    {
      "name": string, // Full name of the VC firm/investor
      "contactInfo": {
        "email": string,
        "phone": string,
        "location": string,
        "linkedIn": string
      },
      "investmentCriteria": {
        "minInvestment": number, // in USD
        "maxInvestment": number, // in USD
        "preferredStages": string[],
        "sectors": string[]
      },
      "website": string,
      "matchReason": string, // Why this investor is a good fit
      "notablePortfolio": string[], // 2-3 relevant portfolio companies
      "fitScore": number // 0-100 indicating match quality
    }
  ],
  "recommendations": {
    "pitchImprovements": string[], // Suggestions to improve investor pitch
    "nextSteps": string[] // Recommended actions for approaching these investors
  }
}

Important Guidelines:
- Ensure all suggested investors are real and actively investing
- Prioritize investors with recent investments in similar companies
- Include a mix of well-known and boutique firms that match the criteria
- Verify that investment sizes align with the startup's capital needs
- Consider the startup's stage and provide stage-appropriate investors
- Focus on investors who have demonstrated success in the specific sector
- Include relevant contact information that would be publicly available
- Ensure the matchReason is specific and tailored to each investor
- Provide actionable and specific next steps in the recommendations

Example Validation Checks:
1. If the startup is seeking $500K, don't suggest investors who only do $5M+ deals
2. If it's a seed-stage startup, don't suggest late-stage/growth investors
3. If it's a specialized industry, prioritize sector-specific investors
4. Consider geographical focus if mentioned in the startup description

Please provide comprehensive and accurate information. If there are any potential red flags or areas of concern in the startup's profile that might affect investor interest, include these in the potentialChallenges section.

Maintain professionalism and accuracy in all responses. The goal is to provide actionable intelligence that helps the startup connect with the most relevant potential investors.`
export type User = {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    startups: Startup[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type Startup = {
    name: string; // Add this
    email: string; // Add this
    id: string;
   
    industry: string;
    sector: string;
    stage: string;
    description: string;
    capital: number;
    userId: string;
    user: User;
    matches: Match[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type Match = {
    id: string;
    vcName: string;
    contactInfo: string;
    minimumInvestment: number;
    sectors: string;
    website: string;
    startupId: string;
    startup: Startup;
    fitScore: number;
    matchReason: string;
    notablePortfolio: string;
    createdAt: Date;
  };

  
  // Form validation types
  export type StartupFormValues = {
    startupName: string;
    industry: string;
    sector: string;
    stage: string;
    description: string;
    capitalRequired: string;
  }
  
  // Enums for form select options
  export enum StartupStage {
    IDEATION = "ideation",
    MVP = "mvp",
    PRE_SEED = "pre-seed",
    SEED = "seed",
    SERIES_A = "series-a",
    SERIES_B = "series-b",
    SERIES_C = "series-c"
  }
  
  export enum Industry {
    TECHNOLOGY = "technology",
    HEALTHCARE = "healthcare",
    FINANCE = "finance",
    RETAIL = "retail",
    EDUCATION = "education",
    MANUFACTURING = "manufacturing",
    ENERGY = "energy",
    AGRITECH ="agritech"
  }
  
  export enum Sector {
    SAAS = "saas",
    AI_ML = "AI-ML",
    ECOMMERCE = "ecommerce",
    BIOTECH = "biotech",
    FINTECH = "fintech",
    CLEANTECH = "cleantech",
    DEEPTECH = "deeptech",
  }

  export type AnalysisResponse = {
    message: string;
    startup: {
      id: string;
      name: string;
      industry: string;
      sector: string;
      stage: string;
      description: string;
      capital: number;
      user: {
        id: string;
        name: string;
        email: string;
      };
      matches: {
        id: string;
        vcName: string;
        contactInfo: string;
        minimumInvestment: number;
        sectors: string;
        website: string;
      }[];
    };
    analysis: {
      analysisNotes: string;
      keyStrengths: string[];
      potentialChallenges: string[];
      investors: {
        name: string;
        contactInfo: {
          email: string;
          phone: string;
          location: string;
          linkedIn: string;
        };
        website: string;
        investmentCriteria: {
          minInvestment: number;
          maxInvestment: number;
          preferredStages: string[];
          sectors: string[];
        };
        fitScore: number;
        matchReason: string;
        notablePortfolio: string;
      }[];
      recommendations: {
        pitchImprovements: string[];
        nextSteps: string[];
      };
    };
  };


  //emails connection:
  export type InvestorEmail = {
    id: string;
    matchId: string;
    email: string;
    status: 'pending' | 'valid' | 'invalid';
    createdAt: Date;
  };
  
  export type EmailCampaign = {
    id: string;
    startupId: string;
    subject: string;
    content: string;
    senderEmail: string;
    status: 'draft' | 'sent';
    sentAt?: Date;
    createdAt: Date;
  };

  export interface EmailSubmissionResponse {
    success?: boolean;
    error?: string;
  }
  
  export interface StatusMessage {
    type: 'success' | 'error' | '';
    message: string;
  }
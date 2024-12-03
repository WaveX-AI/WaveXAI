// types/dashboard.ts

export type ValidationArea = 'IDEA' | 'PRODUCT' | 'MARKET' | 'BUSINESS_MODEL' | 'TEAM' | 'FUNDING';

export interface Startup {
  id: string;
  name: string;
  industry: string;
  sector: string;
  stage: string;
  description: string;
  capital: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ValidationScores = Record<ValidationArea, number>;

export interface StartupValidation {
  id: string;
  userId: string;
  startupId: string;
  answers: Record<string, number>;
  scores: ValidationScores;
  analysisNotes?: string;
  keyStrengths?: string[];
  potentialChallenges?: string[];
  recommendations?: {
    marketStrategy: string[];
    productDevelopment: string[];
    nextSteps: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export type ValidationTrend = {
  date: string;
} & ValidationScores;
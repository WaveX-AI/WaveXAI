// lib/constants/questions.ts

export type Question = {
    id: string;
    area: ValidationArea;
    text: string;
    options: {
      value: number;
      text: string;
    }[];
  };
  
  export enum ValidationArea {
    IDEA = "idea",
    ENTREPRENEUR = "entrepreneur",
    MARKET = "market",
    RESOURCES = "resources",
    FINANCES = "finances",
    RISKS = "risks"
  }
  
  export const validationQuestions: Question[] = [
    // Area 1: The Idea
    {
      id: "idea-1",
      area: ValidationArea.IDEA,
      text: "How innovative is your startup idea?",
      options: [
        { value: 5, text: "Completely new concept never seen before" },
        { value: 4, text: "Significant improvement over existing solutions" },
        { value: 3, text: "Moderate innovation with some unique features" },
        { value: 2, text: "Minor improvements to existing solutions" },
        { value: 1, text: "Similar to existing solutions" }
      ]
    },
    {
      id: "idea-2",
      area: ValidationArea.IDEA,
      text: "How unique is your solution compared to existing alternatives?",
      options: [
        { value: 5, text: "No direct competitors exist" },
        { value: 4, text: "Few indirect competitors" },
        { value: 3, text: "Some similar solutions exist" },
        { value: 2, text: "Many similar solutions" },
        { value: 1, text: "Highly saturated market" }
      ]
    },
    // Add remaining 28 questions following the same pattern for each area
  ];
  
  export const getQuestionsForArea = (area: ValidationArea) => {
    return validationQuestions.filter(q => q.area === area);
  };
  
  export const calculateAreaScore = (answers: Record<string, number>, area: ValidationArea) => {
    const areaQuestions = getQuestionsForArea(area);
    const areaAnswers = areaQuestions.map(q => answers[q.id] || 0);
    const totalScore = areaAnswers.reduce((acc, curr) => acc + curr, 0);
    return (totalScore / (areaQuestions.length * 5)) * 100; // Convert to percentage
  };
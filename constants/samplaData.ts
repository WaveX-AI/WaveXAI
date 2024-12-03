import { AnalysisResponse } from "@/types";
import type { Startup, StartupValidation } from '@/types/dashboard';

export const sampleAnalysisData: AnalysisResponse = {
    message: 'OpenAI analysis complete',
    startup: {
      id: 'cm374w0o0002e13724aygj8ap',
      name: 'WaveX',
      industry: 'Technology',
      sector: 'SaaS',
      stage: 'MVP',
      description: 'WaveX is building a SaaS platform for optimizing software development practices.',
      capital: 500000,
      user: {
        id: 'cm374w0o0002e13724aygj8ap',
        name: 'Example Startup',
        email: 'user@example.com'
      },
      matches: [
        {
          id: 'cm374wlbu002m1372j569ploy',
          vcName: 'SeedPlus',
          contactInfo: '{"email":"info@seedplus.com","phone":"+65 1234 5678","location":"Singapore","linkedIn":"https://www.linkedin.com/company/seedplus/"}',
          minimumInvestment: 50000,
          sectors: 'Technology, SaaS',
          website: 'https://www.seedplus.com'
        },
        {
          id: 'cm374wlbx002o1372la0v48vt',
          vcName: 'Point Nine Capital',
          contactInfo: '{"email":"hello@pointninecap.com","phone":"+49 30 549080950","location":"Berlin, Germany","linkedIn":"https://www.linkedin.com/company/point-nine-capital/"}',
          minimumInvestment: 100000,
          sectors: 'SaaS, Online Marketplaces',
          website: 'https://www.pointninecap.com'
        },
        {
          id: 'cm374wlby002q13725dlbe51i',
          vcName: 'Y Combinator',
          contactInfo: '{"email":"contact@ycombinator.com","phone":"N/A","location":"Mountain View, California, USA","linkedIn":"https://www.linkedin.com/school/ycombinator/"}',
          minimumInvestment: 125000,
          sectors: 'Technology, SaaS, Healthcare',
          website: 'https://www.ycombinator.com'
        }
      ]
    },
    analysis: {
    analysisNotes: `Given WaveX's current stage (MVP) and capital seeking amount ($250,000), the focus was on identifying early-stage investors, angel investors, and micro VCs who specialize in technology and SaaS sectors. Investors were selected based on their history of investing in similar stages and sectors, as well as their potential to offer strategic value beyond capital, such as mentorship, industry connections, and market expansion strategies.`,
      keyStrengths: [
        'Innovative SaaS solution for a growing market',
        'Strong technical foundation and MVP stage',
        'High scalability potential of the product'
      ],
      potentialChallenges: [
        'Competitive market with established players',
        'Need for a clear go-to-market strategy',
        'Proving product-market fit with early customers'
      ],
      investors: [
        {
          name: 'SeedPlus',
          contactInfo: {
            email: 'info@seedplus.com',
            phone: '+65 1234 5678',
            location: 'Singapore',
            linkedIn: 'https://www.linkedin.com/company/seedplus/'
          },
          website: 'https://www.seedplus.com',
          investmentCriteria: {
            minInvestment: 50000,
            maxInvestment: 500000,
            preferredStages: ['Seed', 'Series A'],
            sectors: ['Technology', 'SaaS']
          },
          fitScore: 95,
          matchReason: 'Specializes in early-stage investments in technology and SaaS sectors with a strong network in Asia.',
          notablePortfolio: 'Startup A, Startup B, Startup C'
        },
        {
          name: 'Point Nine Capital',
          contactInfo: {
            email: 'hello@pointninecap.com',
            phone: '+49 30 549080950',
            location: 'Berlin, Germany',
            linkedIn: 'https://www.linkedin.com/company/point-nine-capital/'
          },
          website: 'https://www.pointninecap.com',
          investmentCriteria: {
            minInvestment: 100000,
            maxInvestment: 1000000,
            preferredStages: ['Seed', 'Series A'],
            sectors: ['SaaS', 'Online Marketplaces']
          },
          fitScore: 92,
          matchReason: 'Renowned for backing SaaS startups at the seed stage with a global outlook and strong European network.',
          notablePortfolio: 'Startup D, Startup E, Startup F'
        },
        {
          name: 'Y Combinator',
          contactInfo: {
            email: 'contact@ycombinator.com',
            phone: 'N/A',
            location: 'Mountain View, California, USA',
            linkedIn: 'https://www.linkedin.com/school/ycombinator/'
          },
          website: 'https://www.ycombinator.com',
          investmentCriteria: {
            minInvestment: 125000,
            maxInvestment: 500000,
            preferredStages: ['Seed', 'Series A'],
            sectors: ['Technology', 'SaaS', 'Healthcare']
          },
          fitScore: 90,
          matchReason: 'Prestigious accelerator with a strong track record in scaling SaaS startups, offering significant mentorship and network benefits.',
          notablePortfolio: 'Startup G, Startup H, Startup I'
        }
      ],
      recommendations: {
        pitchImprovements: [
          'Emphasize the unique value proposition and differentiation from competitors.',
          'Highlight the technical expertise of the team and development milestones achieved with the MVP.',
          'Include initial customer feedback and potential market size to demonstrate growth potential.'
        ],
        nextSteps: [
          'Refine the pitch deck based on the improvements suggested.',
          'Reach out to the investors with a personalized email, attaching the pitch deck and a concise executive summary.',
          'Prepare for potential meetings by developing clear answers to common investor questions, particularly around market differentiation and growth strategy.'
        ]
      }
    }
  };

  export const sampleStartups: Startup[] = [
    {
      id: 'cm37722om0002na3yaae07glb',
      name: 'WaveX',
      industry: 'technology',
      sector: 'saas',
      stage: 'mvp',
      description: 'We are a startup bridging the gap between VC and Startups to eliminate the gap of visibility and help startups ad businesses reach out to the right investors.',
      capital: 2500000,
      userId: 'cm37722my0000na3yn79to2yv',
      createdAt: '2024-11-07T10:57:54.453Z',
      updatedAt: '2024-11-07T10:57:54.453Z',
    },
    {
      id: '2',
      name: 'GreenMile',
      industry: 'CleanTech',
      sector: 'Transportation',
      stage: 'Seed',
      description: 'Electric vehicle charging infrastructure network',
      capital: 750000,
      userId: 'user1',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'CryptoSafe',
      industry: 'FinTech',
      sector: 'Blockchain',
      stage: 'Pre-seed',
      description: 'Secure cryptocurrency custody solution',
      capital: 300000,
      userId: 'user1',
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'HealthMate',
      industry: 'HealthTech',
      sector: 'Digital Health',
      stage: 'Series B',
      description: 'Remote patient monitoring platform',
      capital: 5000000,
      userId: 'user1',
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
    }
  ];
  
  export const sampleValidations: StartupValidation[] = [
    {
      id: 'v1',
      userId: 'user1',
      startupId: '1',
      answers: {
        'q1': 4,
        'q2': 5,
        'q3': 3
      },
      scores: {
        IDEA: 92,
        PRODUCT: 88,
        MARKET: 95,
        BUSINESS_MODEL: 85,
        TEAM: 90,
        FUNDING: 82
      },
      analysisNotes: 'Strong market positioning with innovative AI technology',
      keyStrengths: [
        'Cutting-edge AI technology',
        'Experienced technical team',
        'Strong market demand',
        'Clear monetization strategy'
      ],
      potentialChallenges: [
        'Scaling infrastructure',
        'Enterprise sales cycle length',
        'Competition from established players'
      ],
      recommendations: {
        marketStrategy: [
          'Focus on mid-market enterprises initially',
          'Develop channel partnerships',
          'Create customer success stories'
        ],
        productDevelopment: [
          'Prioritize API integrations',
          'Enhance security features',
          'Improve user onboarding'
        ],
        nextSteps: [
          'Hire enterprise sales team',
          'Secure SOC 2 certification',
          'Prepare for Series B funding'
        ]
      },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'v2',
      userId: 'user1',
      startupId: '2',
      answers: {
        'q1': 5,
        'q2': 4,
        'q3': 4
      },
      scores: {
        IDEA: 95,
        PRODUCT: 82,
        MARKET: 88,
        BUSINESS_MODEL: 78,
        TEAM: 85,
        FUNDING: 75
      },
      analysisNotes: 'Innovative solution for growing EV market',
      keyStrengths: [
        'First-mover advantage',
        'Strategic locations',
        'Government incentives'
      ],
      potentialChallenges: [
        'High capital requirements',
        'Regulatory compliance',
        'Grid infrastructure limitations'
      ],
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 'v3',
      userId: 'user1',
      startupId: '1',
      answers: {
        'q1': 5,
        'q2': 5,
        'q3': 4
      },
      scores: {
        IDEA: 92,
        PRODUCT: 90,
        MARKET: 95,
        BUSINESS_MODEL: 88,
        TEAM: 92,
        FUNDING: 85
      },
      analysisNotes: 'Significant improvement in product development and team expansion',
      keyStrengths: [
        'Enhanced product features',
        'Growing customer base',
        'Strong team additions'
      ],
      potentialChallenges: [
        'Scaling customer support',
        'Technical debt management',
        'International expansion challenges'
      ],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    {
      id: 'v4',
      userId: 'user1',
      startupId: '3',
      answers: {
        'q1': 4,
        'q2': 3,
        'q3': 4
      },
      scores: {
        IDEA: 85,
        PRODUCT: 78,
        MARKET: 82,
        BUSINESS_MODEL: 75,
        TEAM: 80,
        FUNDING: 70
      },
      createdAt: '2024-03-20T00:00:00Z',
      updatedAt: '2024-03-20T00:00:00Z'
    },
    {
      id: 'v5',
      userId: 'user1',
      startupId: '4',
      answers: {
        'q1': 5,
        'q2': 5,
        'q3': 5
      },
      scores: {
        IDEA: 95,
        PRODUCT: 92,
        MARKET: 96,
        BUSINESS_MODEL: 90,
        TEAM: 94,
        FUNDING: 88
      },
      analysisNotes: 'Exceptional growth and market penetration',
      keyStrengths: [
        'Strong market position',
        'Regulatory compliance',
        'Scalable technology'
      ],
      potentialChallenges: [
        'International expansion',
        'Healthcare partnerships',
        'Data privacy regulations'
      ],
      createdAt: '2024-03-25T00:00:00Z',
      updatedAt: '2024-03-25T00:00:00Z'
    }
  ];
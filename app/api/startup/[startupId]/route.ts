import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnalysisResponse } from '@/types';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { startupId: string } }
) {
  console.log('Fetching startup with ID:', params.startupId);

  try {
    const { startupId } = params;

    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        matches: true,
      },
    });

    console.log('Fetched startup data:', JSON.stringify(startup, null, 2));

    if (!startup) {
      console.log('Startup not found');
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    const analysisResponse: AnalysisResponse = {
      startup: {
        id: startup.id,
        name: startup.name,
        description: startup.description || '',
        industry: startup.industry || '',
        sector: startup.sector || '',
        stage: startup.stage || '',
        capital: startup.capital || 0,
        user: {
          id: startup.user.id,
          name: startup.user.name || 'Anonymous User',
          email: startup.user.email || ''
        },
        matches: startup.matches.map(match => ({
          id: match.id,
          vcName: match.vcName,
          contactInfo: match.contactInfo,
          minimumInvestment: match.minimumInvestment,
          sectors: match.sectors,
          website: match.website
        }))
      },
      analysis: {
        analysisNotes: "Analysis of startup investment potential",
        keyStrengths: [],
        potentialChallenges: [],
        investors: startup.matches.map((match) => {
          let contactInfo;
          try {
            contactInfo = JSON.parse(match.contactInfo);
          } catch (error) {
            console.error('Error parsing contactInfo:', error);
            contactInfo = {};
          }
          return {
            name: match.vcName,
            fitScore: match.fitScore || 0,
            website: match.website || '',
            contactInfo: {
              email: contactInfo.email || '',
              phone: contactInfo.phone || '',
              location: contactInfo.location || '',
              linkedIn: contactInfo.linkedIn || ''
            },
            investmentCriteria: {
              minInvestment: match.minimumInvestment || 0,
              maxInvestment: 0,
              preferredStages: [],
              sectors: match.sectors ? match.sectors.split(', ') : []
            },
            matchReason: match.matchReason || '',
            notablePortfolio: match.notablePortfolio || ''
          };
        }),
        recommendations: {
          pitchImprovements: [],
          nextSteps: []
        }
      }
    };

    // Return the response directly without attempting to validate it
    return NextResponse.json(analysisResponse);

  } catch (error) {
    console.error('Error fetching startup data:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching startup data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnalysisResponse } from '@/types';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { startupId: string } }
) {
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
      },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    const matches = await prisma.match.findMany({
      where: { startupId },
    });

    const analysisResponse: AnalysisResponse = {
      startup: {
        id: startup.id,
        name: startup.name,
        description: startup.description,
        industry: startup.industry,
        sector: startup.sector,
        stage: startup.stage,
        capital: startup.capital,
        user: {
          id: startup.user.id,
          // Handle potential null value for name
          name: startup.user.name || 'Anonymous User',
          email: startup.user.email
        },
        matches: matches.map(match => ({
          id: match.id,
          vcName: match.vcName,
          contactInfo: match.contactInfo,
          minimumInvestment: match.minimumInvestment,
          sectors: match.sectors,
          website: match.website
        }))
      },
      analysis: {
        // Add the missing analysisNotes field
        analysisNotes: "Analysis of startup investment potential",
        keyStrengths: [],
        potentialChallenges: [],
        investors: matches.map((match) => ({
          name: match.vcName,
          fitScore: match.fitScore,
          website: match.website,
          contactInfo: {
            email: JSON.parse(match.contactInfo).email || "",
            phone: JSON.parse(match.contactInfo).phone || "",
            location: JSON.parse(match.contactInfo).location || "",
            linkedIn: JSON.parse(match.contactInfo).linkedIn || ""
          },
          investmentCriteria: {
            minInvestment: match.minimumInvestment,
            maxInvestment: 0,
            preferredStages: [],
            sectors: match.sectors.split(', ')
          },
          matchReason: match.matchReason,
          notablePortfolio: match.notablePortfolio
        })),
        // Add the missing recommendations field
        recommendations: {
          pitchImprovements: [],
          nextSteps: []
        }
      }
    };

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
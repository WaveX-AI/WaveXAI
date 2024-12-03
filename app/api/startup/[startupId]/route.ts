// app/api/startup/[startupId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnalysisResponse } from '@/types';

const prisma = new PrismaClient();

// Add proper typing for the request params
export async function GET(
  request: NextRequest,
  { params }: { params: { startupId: string } }
) {
  try {
    
    // const  startupId  = (await params).startupId;

    const  { startupId } = await params;

    // Debugging logs to ensure the parameter is received
    console.log("Received startupId:", startupId);

    if (!startupId) {
      return NextResponse.json(
        { error: 'startupId is required' },
        { status: 400 }
      );
    }


    const matches = await prisma.match.findMany({
      where: { startupId },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            industry: true,
            sector: true,
            stage: true,
            description: true,
            capital: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    console.log(`Found ${matches.length} matches for startupId: ${startupId}`);

    // If no matches found, return 404
    if (matches.length === 0) {
      return NextResponse.json(
        { error: 'No matches found' },
        { status: 404 }
      );
    }

    const analysisResponse: AnalysisResponse = {
      message: 'Startup data fetched successfully',
      startup: {
        id: matches[0]?.startup.id,
        name: matches[0]?.startup.name,
        industry: matches[0]?.startup.industry,
        sector: matches[0]?.startup.sector,
        stage: matches[0]?.startup.stage,
        description: matches[0]?.startup.description,
        capital: matches[0]?.startup.capital,
        user: {
          id: matches[0]?.startup.user.id,
          name: matches[0]?.startup.user.name || 'Unknown User',
          email: matches[0]?.startup.user.email,
        },
        matches: matches.map((match) => ({
          id: match.id,
          vcName: match.vcName,
          contactInfo: match.contactInfo,
          minimumInvestment: match.minimumInvestment,
          sectors: match.sectors,
          website: match.website,
          fitScore: match.fitScore,
          matchReason: match.matchReason,
          notablePortfolio: match.notablePortfolio,
        })),
      },
      analysis: {
        investors: matches.map((match) => ({
          name: match.vcName,
          contactInfo: JSON.parse(match.contactInfo),
          website: match.website,
          investmentCriteria: {
            minInvestment: match.minimumInvestment,
            maxInvestment: 0,
            preferredStages: [],
            sectors: match.sectors.split(', '),
          },
          fitScore: match.fitScore,
          matchReason: match.matchReason,
          notablePortfolio: match.notablePortfolio,
        })),
        analysisNotes: '',
        keyStrengths: [],
        potentialChallenges: [],
        recommendations: {
          pitchImprovements: [],
          nextSteps: []
        }
      },
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
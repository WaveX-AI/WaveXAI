/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Logger, RateLimiter } from "@/lib/utils";

const prisma = new PrismaClient();
const logger = new Logger("CampaignVerification");

const RATE_LIMIT_CONFIG = {
  windowMs: 5 * 60 * 1000,
  max: 3
};

interface VerificationResult {
  isValid: boolean;
  campaign?: any;
  error?: string;
}

export async function verifyEmailOwnership(token: string, campaignId: string): Promise<VerificationResult> {
  try {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { 
        id: campaignId,
        verificationToken: token 
      },
      include: {
        startup: {
          include: {
            matches: {
              include: {
                investorEmails: {
                  where: { status: 'valid' }
                }
              }
            }
          }
        }
      }
    });

    if (!campaign) {
      return {
        isValid: false,
        error: "Invalid verification token or campaign not found"
      };
    }

    if (campaign.status === 'sent') {
      return {
        isValid: false,
        error: "Campaign has already been sent"
      };
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (campaign.createdAt < thirtyMinutesAgo) {
      return {
        isValid: false,
        error: "Verification link has expired"
      };
    }

    return {
      isValid: true,
      campaign
    };
  } catch (error) {
    logger.error("Verification error:", error);
    return {
      isValid: false,
      error: "Verification failed"
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const campaignId = searchParams.get('campaignId');

    if (!token || !campaignId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const rateLimitResult = await RateLimiter.checkRateLimit(
      `verify_campaign_${token}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimitResult.isAllowed) {
      return NextResponse.json(
        { error: "Too many verification attempts" },
        { status: 429 }
      );
    }

    const verificationResult = await verifyEmailOwnership(token, campaignId);

    if (!verificationResult.isValid) {
      return NextResponse.json(
        { error: verificationResult.error },
        { status: 400 }
      );
    }

    // Format investor data
    const investors = verificationResult.campaign.startup.matches.flatMap((match: { investorEmails: any[]; vcName: any; }) => 
      match.investorEmails.map((ie: { email: any; }) => ({
        email: ie.email,
        vcName: match.vcName
      }))
    );

    // Update campaign status
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'verified',
        verifiedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      recipientCount: investors.length,
      investors,
      campaign: {
        subject: verificationResult.campaign.subject,
        content: verificationResult.campaign.content,
        senderEmail: verificationResult.campaign.senderEmail
      }
    });

  } catch (error) {
    logger.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
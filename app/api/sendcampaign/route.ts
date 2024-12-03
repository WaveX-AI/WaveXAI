import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatTimeWindow, Logger, RateLimiter } from "@/lib/utils";
import crypto from 'crypto';

const prisma = new PrismaClient();
const logger = new Logger("CampaignCreation");

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  max: 5
};

const createVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export async function POST(request: Request) {
  try {
    const { startupId, senderEmail, subject, content } = await request.json();
    
    logger.info("Campaign creation initiated", {
      startupId,
      senderEmail
    });

    const rateLimitResult = await RateLimiter.checkRateLimit(
      `campaign_creation_${senderEmail}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimitResult.isAllowed) {
      logger.warn("Rate limit exceeded", { senderEmail });
      return NextResponse.json({
        error: `Rate limit exceeded. Please try again in ${formatTimeWindow(RATE_LIMIT_CONFIG.windowMs)}`,
        remainingAttempts: rateLimitResult.remainingAttempts
      }, { status: 429 });
    }

    const verificationToken = createVerificationToken();

    // Create a draft campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        startupId,
        subject,
        content,
        senderEmail,
        status: 'draft',
        verificationToken
      }
    });

    // Generate verification URL
    const verificationUrl = new URL("/campaign/verify-success", process.env.NEXT_PUBLIC_APP_URL);
    verificationUrl.searchParams.set("id", campaign.id);
    verificationUrl.searchParams.set("token", verificationToken);

    logger.info("Campaign created successfully", { 
      campaignId: campaign.id,
      verificationUrl: verificationUrl.toString()
    });

    return NextResponse.json({
      success: true,
      redirectUrl: verificationUrl.toString(),
      campaignId: campaign.id
    });

  } catch (error) {
    logger.error("Campaign creation failed", { error });
    return NextResponse.json(
      { error: "Failed to initiate email campaign" },
      { status: 500 }
    );
  }
}
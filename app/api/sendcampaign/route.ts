import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';
import crypto from 'crypto';
import { Logger } from "@/lib/utils";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const logger = new Logger("CampaignCreation");

const createVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export async function POST(request: Request) {
  try {
    const { startupId, senderEmail, subject, content } = await request.json();
    
    logger.info("Campaign creation initiated", { startupId, senderEmail });

    // Validate startup and get matches
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        matches: {
          include: {
            investorEmails: {
              where: { status: 'valid' }
            }
          }
        }
      }
    });

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Create verification token and campaign
    const verificationToken = createVerificationToken();
    const campaign = await prisma.emailCampaign.create({
      data: {
        startupId,
        subject,
        content,
        senderEmail,
        status: 'pending',
        verificationToken
      }
    });

    // Send verification email to the sender
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}campaign/verify-success?id=${campaign.id}&token=${verificationToken}`;
    
    try {
      await resend.emails.send({
        from: `Startup Connect <${process.env.RESEND_FROM_EMAIL}>`,
        to: senderEmail,
        subject: "Verify your email campaign",
        html: `
          <h2>Verify Your Email Campaign</h2>
          <p>Click the link below to verify and send your campaign:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 30 minutes.</p>
        `
      });

      return NextResponse.json({ 
        success: true,
        redirectUrl: verificationUrl
      });
    } catch (error) {
      logger.error("Verification email sending failed", { error });
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error("Campaign creation failed", { error });
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
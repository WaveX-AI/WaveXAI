// app/api/sendcampaign/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';
import { Logger } from "@/lib/utils";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const logger = new Logger("CampaignCreation");

export async function POST(request: Request) {
  try {
    // Log the RESEND_API_KEY presence (not the actual key)
    logger.info("Checking Resend configuration", {
      hasApiKey: !!process.env.RESEND_API_KEY,
      hasFromEmail: !!process.env.RESEND_FROM_EMAIL
    });

    const { startupId, senderEmail, content } = await request.json();
    
    if (!startupId || !senderEmail || !content) {
      logger.error("Missing required fields", { startupId, senderEmail, hasContent: !!content });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
      logger.error("Startup not found", { startupId });
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    logger.info("Found startup data", { 
      startupId, 
      matchCount: startup.matches.length 
    });

    // Extract investor details with safe parsing
    const investorDetails = startup.matches.map(match => {
      let parsedContactInfo = {};
      try {
        parsedContactInfo = JSON.parse(match.contactInfo || '{}');
      } catch (e) {
        logger.error("Contact info parsing error", { 
          vcName: match.vcName, 
          error: e 
        });
        parsedContactInfo = { note: "Unable to parse contact information" };
      }

      return {
        vcName: match.vcName || 'Unknown VC',
        emails: match.investorEmails?.map(ie => ie.email) || [],
        contactInfo: parsedContactInfo
      };
    });

    logger.info("Processed investor details", { 
      investorCount: investorDetails.length 
    });

    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your Generated Email Script</h2>
        <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          ${content}
        </div>
        
        <h2 style="color: #333; margin-top: 30px;">Matched Investor Details</h2>
        ${investorDetails.map(investor => `
          <div style="margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #444;">${investor.vcName}</h3>
            <p style="margin: 5px 0;"><strong>Emails:</strong> ${investor.emails.join(', ') || 'No email available'}</p>
            <div style="margin-top: 10px;">
              <strong>Additional Contact Information:</strong>
              <ul style="margin: 5px 0;">
                ${Object.entries(investor.contactInfo)
                  .map(([key, value]) => `<li>${key}: ${value}</li>`)
                  .join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    try {
      // Log email attempt
      logger.info("Attempting to send email", {
        to: senderEmail,
        from: process.env.RESEND_FROM_EMAIL,
        hasContent: !!emailContent
      });

      const emailResponse = await resend.emails.send({
        from: `Startup Connect <${process.env.RESEND_FROM_EMAIL}>`,
        to: senderEmail,
        subject: "Your Investor Contact Details and Email Script",
        html: emailContent,
      });

      logger.info("Email sent successfully", { emailResponse });

      return NextResponse.json({ 
        success: true,
        message: "Email sent successfully"
      });

    } catch (error: unknown) {
      logger.error("Resend API error", { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace available',
        email: senderEmail 
      });

      return NextResponse.json(
        { 
          error: "Failed to send email",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Unexpected error", { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    });

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message
      },
      { status: 500 }
    );
  }
}
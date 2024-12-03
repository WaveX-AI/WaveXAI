/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/sendemails.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { campaignId, senderEmail } = await request.json();

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
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

    if (!campaign || campaign.status !== 'verified') {
      return NextResponse.json({ error: "Invalid campaign" }, { status: 400 });
    }

    // Get all investors
    const investors = campaign.startup.matches.flatMap(match => 
      match.investorEmails.map(ie => ({
        email: ie.email,
        vcName: match.vcName
      }))
    );

    // Prepare email messages
    const messages = investors.map(investor => {
      const personalizedContent = campaign.content.replace(
        '{investor_name}',
        investor.vcName
      );

      return {
        to: investor.email,
        from: senderEmail, // This email must be verified in SendGrid
        subject: campaign.subject,
        text: personalizedContent,
        html: personalizedContent.replace(/\n/g, '<br>')
      };
    });

    // Send emails in batches of 100 (SendGrid recommendation)
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      try {
        const result = await sgMail.send(batch);
        results.push(...result);
      } catch (error: any) {
        console.error('Error sending batch:', error.response?.body);
      }
    }

    // Update campaign status
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      summary: {
        total: investors.length,
        sent: results.length,
        failed: investors.length - results.length
      }
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
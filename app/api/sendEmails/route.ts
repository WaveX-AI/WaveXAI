// app/api/sendEmails/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { campaignId, senderEmail } = await request.json();

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        startup: {
          include: {
            matches: true
          }
        }
      }
    });

    if (!campaign || campaign.status !== 'verified') {
      return NextResponse.json({ error: "Invalid campaign" }, { status: 400 });
    }

    // Extract and parse investor emails from matches
    const investors = campaign.startup.matches.map(match => {
      try {
        const contactInfo = JSON.parse(match.contactInfo);
        return {
          email: contactInfo.email,
          vcName: match.vcName
        };
      } catch (error) {
        console.error('Error parsing contact info:', error);
        return null;
      }
    }).filter(investor => investor !== null);

    // Prepare and send emails
    const results = [];
    for (const investor of investors) {
      if (!investor) continue;

      const personalizedContent = campaign.content.replace(
        '{investor_name}',
        investor.vcName
      );

      try {
        const result = await resend.emails.send({
          from: `Startup Connect <${process.env.RESEND_FROM_EMAIL}>`,
          to: investor.email,
          replyTo: senderEmail,
          subject: campaign.subject,
          html: personalizedContent.replace(/\n/g, '<br>'),
          text: personalizedContent,
        });
        results.push({ success: true, result });
        console.log(`Email sent successfully to ${investor.email}`, result);
      } catch (error) {
        console.error(`Failed to send email to ${investor.email}:`, error);
        results.push({ success: false, error });
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

    const successfulSends = results.filter(r => r.success).length;

    return NextResponse.json({ 
      success: true,
      summary: {
        total: investors.length,
        sent: successfulSends,
        failed: investors.length - successfulSends
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
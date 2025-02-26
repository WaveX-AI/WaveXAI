// app/api/saveemail/route.ts
import { NextResponse } from 'next/server';

// Using the Mailchimp Marketing API
import mailchimp from "@mailchimp/mailchimp_marketing";

export async function POST(request: Request) {
  try {
    // Check for required environment variables
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., "us10"
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID; // Audience ID

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      console.error('Missing Mailchimp environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // console.log('Attempting to save email:', email);

    // Configure Mailchimp client
    mailchimp.setConfig({
      apiKey: MAILCHIMP_API_KEY,
      server: MAILCHIMP_SERVER_PREFIX, // e.g., us10
    });

    try {
      // Add member to audience list
      await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
        email_address: email,
        status: "subscribed", // Use "pending" if you want double opt-in
        merge_fields: {
          FNAME: email.split('@')[0], // Use part before @ as name, similar to your Airtable approach
        },
      });
      
    //   console.log('Successfully subscribed to Mailchimp:', response);
      
      return NextResponse.json({ 
        success: true,
        message: 'Thank you for subscribing!' 
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error subscribing to Mailchimp:', error);
      
      // Handle duplicate subscribers gracefully
      if (error.status === 400 && error.response?.text?.includes('Member Exists')) {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed. Thank you for your continued support!'
        });
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save email', 
          details: error.response?.text || error.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
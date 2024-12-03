// // app/api/save-email/route.ts
// import { NextResponse } from 'next/server';
// import Airtable from 'airtable';

// // Check for required environment variables
// const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
// const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// // Validate environment variables
// if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
//   throw new Error('Required environment variables are not set: AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be defined');
// }

// // Initialize Airtable with validated credentials
// const base = new Airtable({
//   apiKey: AIRTABLE_API_KEY
// }).base(AIRTABLE_BASE_ID);

// export async function POST(request: Request) {
//   try {
//     if (!base) {
//       throw new Error('Airtable base is not properly initialized');
//     }

//     const { email } = await request.json();

//     if (!email) {
//       return NextResponse.json(
//         { error: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     // Save to Airtable
//     await base('Emails').create([
//       {
//         fields: {
//           Email: email,
//           'Date Added': new Date().toISOString(),
//         },
//       },
//     ]);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error saving email:', error);
//     return NextResponse.json(
//       { error: 'Failed to save email' },
//       { status: 500 }
//     );
//   }
// }
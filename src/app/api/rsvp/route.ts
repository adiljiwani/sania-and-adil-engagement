import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_ID = process.env.GOOGLE_SHEET_TAB_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

interface FamilyMemberRSVP {
  name: string;
  email: string;
  dietaryRestrictions?: string;
}

export async function POST(request: Request) {
  try {
    const { familyMembers } = await request.json() as { familyMembers: FamilyMemberRSVP[] };

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the current date and time
    const now = new Date();
    const timestamp = now.toISOString();

    // Prepare the data to be written
    const values = familyMembers.map(member => [
      timestamp,
      member.name,
      member.email,
      member.dietaryRestrictions || '',
    ]);

    // Write the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVP Responses!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 
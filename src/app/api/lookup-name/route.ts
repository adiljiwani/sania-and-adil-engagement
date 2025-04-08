import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Check for required environment variables
const requiredEnvVars = [
  'GOOGLE_SHEET_ID',
  'GOOGLE_SHEET_TAB_ID',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_ID = process.env.GOOGLE_SHEET_TAB_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

interface SheetRow {
  side: string;
  name: string;
  likely: string;
  family: string;
}

export async function POST(request: Request) {
  try {
    // Check for missing environment variables
    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Server configuration error. Please contact the administrator.',
          details: `Missing environment variables: ${missingEnvVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    const { name } = await request.json() as { name: string };
    console.log('Looking up name:', name);

    const sheets = google.sheets({ version: 'v4', auth });

    // Read the guest list
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Guest List!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in the guest list');
      return NextResponse.json(
        { status: 'error', message: 'No data found in the guest list' },
        { status: 404 }
      );
    }

    // Find the matching name and get the family number
    const matchingRow = rows.find((row: string[]) => 
      row[1]?.toLowerCase() === name.toLowerCase()
    );

    if (!matchingRow) {
      console.log('Name not found:', name);
      return NextResponse.json(
        { status: 'error', message: 'Name not found in the guest list' },
        { status: 404 }
      );
    }

    const familyNumber = matchingRow[3];
    console.log('Found family number:', familyNumber);
    
    // Get all family members with the same family number
    const familyMembers = rows
      .filter((row: string[]) => row[3] === familyNumber)
      .map((row: string[]) => ({
        name: row[1],
        side: row[0],
        likely: row[2],
      }));

    console.log('Found family members:', familyMembers);

    return NextResponse.json({
      status: 'success',
      familyMembers,
    });
  } catch (error) {
    console.error('Error looking up name:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to look up name',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
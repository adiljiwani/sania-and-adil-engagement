import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { emailService } from '@/lib/email/service';
import { createHostNotificationEmail, createGuestConfirmationEmail } from '@/lib/email/templates';
import { RSVPDetails } from '@/lib/email/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function POST(request: Request) {
  try {
    const { familyMembers } = await request.json() as { familyMembers: RSVPDetails['familyMembers'] };

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

    // Prepare RSVP details for emails
    const rsvpDetails: RSVPDetails = {
      name: familyMembers[0].name,
      email: familyMembers[0].email,
      dietaryRestrictions: familyMembers[0].dietaryRestrictions,
      familyMembers,
    };

    // Send host notification email
    await emailService.sendEmail({
      to: { email: process.env.EMAIL_USER!, name: 'Host' },
      ...createHostNotificationEmail(rsvpDetails)
    });

    // Send guest confirmation email
    await emailService.sendEmail({
      to: { email: rsvpDetails.email, name: rsvpDetails.name },
      ...createGuestConfirmationEmail(rsvpDetails, {
        title: process.env.EVENT_TITLE!,
        date: process.env.EVENT_DATE!,
        time: process.env.EVENT_TIME!,
        location: process.env.EVENT_LOCATION!,
      })
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
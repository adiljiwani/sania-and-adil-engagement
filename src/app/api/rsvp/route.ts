import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { emailService } from '@/lib/email/service';
import { createGuestConfirmationEmail } from '@/lib/email/templates';
import { RSVPDetails } from '@/lib/email/types';
import { createCalendarInvite } from '@/utils/calendar';
import { getEventDetails } from '@/utils/event';

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
    const { familyMembers } = await request.json() as { 
      familyMembers: RSVPDetails['familyMembers'];
    };

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the current date and time
    const now = new Date();
    const timestamp = now.toISOString();

    // Prepare the data to be written
    const values = familyMembers.map(member => [
      timestamp,
      member.name,
      member.email || '',
      member.dietaryRestrictions || '',
      member.attending ? 'Yes' : 'No',
    ]);

    // Write the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVP Responses!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    // Only send emails and create calendar invite if attending
    for (const member of familyMembers) {
      if (member.attending) {
        // Prepare RSVP details for emails
        const rsvpDetails: RSVPDetails = {
          name: member.name,
          email: member.email,
          dietaryRestrictions: member.dietaryRestrictions,
          familyMembers,
        };

        // Get event details and create calendar invite
        const eventDetails = getEventDetails();
        const calendarInvite = createCalendarInvite(eventDetails);

        // Send guest confirmation email with calendar invite
        await emailService.sendEmail({
          to: { email: rsvpDetails.email, name: rsvpDetails.name },
          ...createGuestConfirmationEmail(rsvpDetails, calendarInvite),
          attachments: [{
            filename: 'event.ics',
            content: Buffer.from(calendarInvite.icsFile),
            contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
          }],
        });
      }
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 
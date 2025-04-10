import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { emailService } from '@/lib/email/service';
import { createHostNotificationEmail, createGuestConfirmationEmail } from '@/lib/email/templates';
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
    const { familyMembers, isAttending } = await request.json() as { 
      familyMembers: RSVPDetails['familyMembers'];
      isAttending: boolean;
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
      isAttending ? 'Yes' : 'No', // Add attending status
    ]);

    // Write the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVP Responses!A:E', // Updated range to include attending column
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    // Only send emails and create calendar invite if attending
    if (isAttending) {
      // Prepare RSVP details for emails
      const rsvpDetails: RSVPDetails = {
        name: familyMembers[0].name,
        email: familyMembers[0].email,
        dietaryRestrictions: familyMembers[0].dietaryRestrictions,
        familyMembers,
      };

      // Get event details and create calendar invite
      const eventDetails = getEventDetails();
      const calendarInvite = createCalendarInvite(eventDetails);

      // Send host notification email
      await emailService.sendEmail({
        to: { email: process.env.EMAIL_USER!, name: 'Host' },
        ...createHostNotificationEmail(rsvpDetails)
      });

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

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
} 
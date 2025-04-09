import { RSVPDetails } from './types';
import { getEventDetails } from '@/utils/event';

export const createHostNotificationEmail = (rsvpDetails: RSVPDetails) => ({
  subject: `New RSVP from ${rsvpDetails.name}'s Family`,
  text: `
    New RSVP Details:
    
    ${rsvpDetails.familyMembers.map(member => `
      Name: ${member.name}
      Email: ${member.email}
      Dietary Restrictions: ${member.dietaryRestrictions || "None"}
    `).join('\n')}
    
    View all responses in your Google Sheet.
  `
});

export const createGuestConfirmationEmail = (rsvpDetails: RSVPDetails, calendarInvite: { icsFile: string; googleCalendarLink: string }) => ({
  subject: `RSVP Confirmation - ${getEventDetails().title}`,
  text: `
    Thank you for your RSVP!
    
    Event Details:
    ${getEventDetails().title}
    Date: ${getEventDetails().date}
    Time: ${getEventDetails().time}
    Location: ${getEventDetails().location}
    
    Your RSVP Details:
    ${rsvpDetails.familyMembers.map(member => `
      Name: ${member.name}
      Dietary Restrictions: ${member.dietaryRestrictions || "None"}
    `).join('\n')}
    
    Adding to Your Calendar:
    
    1. Click here to add to Google Calendar (recommended):
    ${calendarInvite.googleCalendarLink}
    
    2. Or use the attached .ics file:
    - On iPhone: Use the Mail app to open the attachment
    - On Android: Open the .ics file with your calendar app
    - On Desktop: Double-click the .ics file to open in your default calendar
    
    If you have any issues adding the event to your calendar, please let us know!
  `
}); 
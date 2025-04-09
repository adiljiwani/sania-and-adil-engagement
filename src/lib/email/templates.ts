import { RSVPDetails, EventDetails } from './types';

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

export const createGuestConfirmationEmail = (
  rsvpDetails: RSVPDetails,
  eventDetails: EventDetails
) => ({
  subject: `RSVP Confirmation - ${eventDetails.title}`,
  text: `
    Thank you for your RSVP!
    
    Event Details:
    ${eventDetails.title}
    Date: ${eventDetails.date}
    Time: ${eventDetails.time}
    Location: ${eventDetails.location}
    
    Your RSVP Details:
    ${rsvpDetails.familyMembers.map(member => `
      Name: ${member.name}
      Dietary Restrictions: ${member.dietaryRestrictions || "None"}
    `).join('\n')}
    
    A calendar invite has been attached to this email.
  `
}); 
import ical from 'ical-generator';
import { EventDetails } from './types';

export function createCalendarInvite(eventDetails: EventDetails) {
  // Parse the date and time from environment variables
  const [month, day, year] = eventDetails.date.split('/').map(Number);
  const [hours, minutes] = eventDetails.time.split(':').map(Number);
  const isPM = eventDetails.time.toLowerCase().includes('pm');
  
  // Create the event date
  const eventDate = new Date(year, month - 1, day, hours + (isPM ? 12 : 0), minutes);

  // Create the calendar
  const calendar = ical({
    name: eventDetails.title,
    timezone: 'America/Toronto',
  });

  // Add the event
  calendar.createEvent({
    start: eventDate,
    end: new Date(eventDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours duration
    summary: eventDetails.title,
    description: eventDetails.description || 'Join us for our engagement celebration!',
    location: eventDetails.location,
    url: 'https://sania-and-adil-engagement.vercel.app',
    organizer: {
      name: 'Sania & Adil',
      email: process.env.EMAIL_USER!,
    },
  });

  // Return the calendar as a string
  return calendar.toString();
} 
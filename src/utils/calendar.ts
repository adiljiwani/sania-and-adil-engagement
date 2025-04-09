import ical from 'ical-generator';

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
}

interface CalendarInvite {
  icsFile: string;
  googleCalendarLink: string;
}

export function createCalendarInvite(eventDetails: EventDetails): CalendarInvite {
  // Parse the date and time from environment variables
  const [month, day, year] = eventDetails.date.split('/').map(Number);
  
  // Parse time in 24-hour format (HH:mm)
  const [hours, minutes] = eventDetails.time.split(':').map(Number);
  
  // Validate time components
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time: ${eventDetails.time}. Expected format: "HH:mm" (24-hour)`);
  }
  
  // Create the event date
  const eventDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration

  // Create the calendar
  const calendar = ical({
    name: eventDetails.title,
    timezone: 'America/Toronto',
  });

  // Add the event
  calendar.createEvent({
    start: eventDate,
    end: endDate,
    summary: eventDetails.title,
    description: 'Join us for our engagement celebration!',
    location: eventDetails.location,
    url: 'https://sania-and-adil-engagement.vercel.app',
    organizer: {
      name: 'Sania & Adil',
      email: process.env.EMAIL_USER!,
    },
  });

  // Create Google Calendar link
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventDetails.title,
    details: 'Join us for our engagement celebration!',
    location: eventDetails.location,
    dates: `${formatDateForGoogleCalendar(eventDate)}/${formatDateForGoogleCalendar(endDate)}`,
  });

  return {
    icsFile: calendar.toString(),
    googleCalendarLink: `${baseUrl}?${params.toString()}`,
  };
}

function formatDateForGoogleCalendar(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
} 
import { EventDetails } from './calendar';

export function getEventDetails(): EventDetails {
  return {
    title: process.env.NEXT_PUBLIC_EVENT_TITLE!,
    date: process.env.NEXT_PUBLIC_EVENT_DATE!,
    time: process.env.NEXT_PUBLIC_EVENT_TIME!,
    location: process.env.NEXT_PUBLIC_EVENT_LOCATION!,
  };
} 
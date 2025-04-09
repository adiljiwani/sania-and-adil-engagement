import { EventDetails } from './calendar';

export function getEventDetails(): EventDetails {
  return {
    title: process.env.EVENT_TITLE!,
    date: process.env.EVENT_DATE!,
    time: process.env.EVENT_TIME!,
    location: process.env.EVENT_LOCATION!,
  };
} 
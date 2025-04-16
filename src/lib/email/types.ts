export interface EmailRecipient {
  email: string;
  name: string;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

export interface RSVPDetails {
  name: string;
  email: string;
  dietaryRestrictions?: string;
  familyMembers: {
    name: string;
    email: string;
    dietaryRestrictions?: string;
    attending: boolean;
  }[];
}

export interface EmailOptions {
  to: EmailRecipient;
  subject: string;
  text: string;
  html?: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
} 
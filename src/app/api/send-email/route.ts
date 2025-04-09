import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface FamilyMember {
  name: string;
  email: string;
  dietaryRestrictions?: string;
}

interface RequestData {
  name: string;
  email: string;
  dietaryRestrictions?: string;
  familyMembers: FamilyMember[];
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json() as RequestData;
    
    const emailSubject = `New RSVP from ${data.name}'s Family`;
    const emailText = `
      New RSVP Details:
      
      ${data.familyMembers.map((member: FamilyMember) => `
        Name: ${member.name}
        Email: ${member.email}
        Dietary Restrictions: ${member.dietaryRestrictions || "None"}
      `).join('\n')}
      
      View all responses in your Google Sheet.
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: emailSubject,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 
'use client';

import { useEffect } from 'react';

interface NotAttendingPageProps {
  familyMembers: Array<{ name: string }>;
}

export default function NotAttendingPage({ familyMembers }: NotAttendingPageProps) {
  useEffect(() => {
    const recordNotAttending = async () => {
      try {
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            familyMembers,
            isAttending: false 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to record response');
        }
      } catch (error) {
        console.error('Error recording not attending response:', error);
      }
    };

    recordNotAttending();
  }, [familyMembers]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">We&apos;re sorry you couldn&apos;t make it</h2>
      <p className="text-gray-600 mb-4">
        Thank you for letting us know. We&apos;ll miss you at our celebration!
      </p>
      <p className="text-gray-600">
        If you change your mind, you can always come back and update your RSVP.
      </p>
    </div>
  );
} 
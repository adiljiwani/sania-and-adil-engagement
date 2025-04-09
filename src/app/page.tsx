'use client';

import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import NameLookupForm from '@/components/NameLookupForm';
import AttendanceQuestion from '@/components/AttendanceQuestion';
import NotAttendingPage from '@/components/NotAttendingPage';
import RSVPForm from '@/components/RSVPForm';

interface FamilyMember {
  name: string;
  side: string;
  likely: string;
}

export default function Home() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[] | null>(null);
  const [willAttend, setWillAttend] = useState<boolean | null>(null);

  const handleNameFound = (members: FamilyMember[]) => {
    setFamilyMembers(members);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-600">
          Welcome to Our Engagement Party
        </h1>
        
        <div className="mb-12">
          <ImageCarousel />
        </div>

        <div className="max-w-2xl mx-auto">
          {!familyMembers ? (
            <NameLookupForm onNameFound={handleNameFound} />
          ) : willAttend === false ? (
            <NotAttendingPage familyMembers={familyMembers} />
          ) : willAttend === true ? (
            <RSVPForm familyMembers={familyMembers} />
          ) : (
            <AttendanceQuestion onAnswer={setWillAttend} />
          )}
        </div>
      </div>
    </main>
  );
}

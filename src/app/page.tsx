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
    <main className="min-h-screen bg-gradient-to-b from-[#FFFFEC] to-[#FFFFFF]">
      <div className="w-full">
        <ImageCarousel />
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-6xl font-bold text-center mb-8 text-black-600 font-['Filena']">
          Adil & Sania's Engagement Party
        </h1> */}
        
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

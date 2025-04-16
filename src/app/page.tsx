'use client';

import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import NameLookupForm from '@/components/NameLookupForm';
import RSVPForm from '@/components/RSVPForm';
import AlreadyRSVPd from '@/components/AlreadyRSVPd';
import EventDetailsCard from '@/components/EventDetailsCard';

interface FamilyMember {
  name: string;
  side: string;
  likely: string;
}

export default function Home() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[] | null>(null);
  const [showAlreadyRSVPd, setShowAlreadyRSVPd] = useState(false);

  const handleNameFound = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    setShowAlreadyRSVPd(false);
  };

  const handleAlreadyRSVPd = (members: FamilyMember[]) => {
    setFamilyMembers(members);
    setShowAlreadyRSVPd(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFFEC] to-[#FFFFFF]">
      <div className="w-full">
        <ImageCarousel />
      </div>
      <div className="container mx-auto px-4 py-8">
        <EventDetailsCard />
        
        <div className="max-w-2xl mx-auto">
          {!familyMembers ? (
            <NameLookupForm 
              onNameFound={handleNameFound} 
              onAlreadyRSVPd={handleAlreadyRSVPd} 
            />
          ) : showAlreadyRSVPd ? (
            <AlreadyRSVPd familyMembers={familyMembers} />
          ) : (
            <RSVPForm familyMembers={familyMembers} />
          )}
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import NameLookupForm from '@/components/NameLookupForm';
import RSVPForm from '@/components/RSVPForm';
import AlreadyRSVPd from '@/components/AlreadyRSVPd';

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
        {/* <h1 className="text-6xl font-bold text-center mb-8 text-black-600 font-['Filena']">
          Adil & Sania's Engagement Party
        </h1> */}
        
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

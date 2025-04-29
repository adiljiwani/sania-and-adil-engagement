'use client';

import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import NameLookupForm from '@/components/NameLookupForm';
import RSVPForm from '@/components/RSVPForm';
import AlreadyRSVPd from '@/components/AlreadyRSVPd';
import InviteScreen from '@/components/InviteScreen';

interface FamilyMember {
  name: string;
  side: string;
  likely: string;
}

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);
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

  if (!showMainContent) {
    return <InviteScreen onRSVPClick={() => setShowMainContent(true)} />;
  }

  return (
    <main className="min-h-screen">
      <div className="w-full">
        <ImageCarousel />
      </div>
      <div className="h-12" />
      <div className="container mx-auto px-4 py-20 relative">
        {/* Background layer */}
        <div
          className="absolute inset-0 flex justify-center items-end z-0"
        >
          <div className="w-full max-w-2xl h-full bg-secondary rounded-2xl" />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex justify-center items-end z-0"
        >
          <div className="w-full max-w-2xl flex items-end">
            <img
              src="/images/background-art.png"
              alt="Decorative background art"
              className="w-full object-contain select-none"
              style={{ filter: 'blur(0.5px)' }}
              draggable="false"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

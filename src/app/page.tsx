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
    <main className="min-h-screen">
      <div className="w-full">
        <ImageCarousel />
      </div>
      <div className="container mx-auto px-4 py-8 relative">
        <div className="relative z-20">
          <EventDetailsCard />
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
          className="pointer-events-none absolute inset-0 flex justify-center items-start z-0"
          style={{ minHeight: '600px' }}
        >
          <img
            src="/images/background-art.png"
            alt="Decorative background art"
            className="w-full max-w-2xl object-contain select-none"
            style={{ filter: 'blur(0.5px)' }}
            draggable="false"
          />
        </div>
      </div>
    </main>
  );
}

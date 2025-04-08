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
  const [hasRSVPd, setHasRSVPd] = useState(false);

  const handleNameFound = (members: FamilyMember[], alreadyRSVPd: boolean) => {
    setFamilyMembers(members);
    setHasRSVPd(alreadyRSVPd);
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
          ) : hasRSVPd ? (
            <AlreadyRSVPd familyMembers={familyMembers} />
          ) : (
            <RSVPForm familyMembers={familyMembers} />
          )}
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function BackgroundImage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 -z-10">
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`} />
      <Image
        src="/images/background-landscape.jpeg"
        alt="Background"
        fill
        priority
        quality={100}
        className="object-cover"
        sizes="100vw"
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
} 
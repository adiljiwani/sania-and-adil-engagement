'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Image as ImageType } from '@/utils/getImages';
import { getImages } from '@/utils/getImages';

import 'swiper/css';

export default function ImageCarousel() {
  const [mounted, setMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const originalImages = getImages();
  // Create a larger array of images to ensure smooth continuous scrolling
  const images = [...originalImages, ...originalImages, ...originalImages, ...originalImages, ...originalImages];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set([...prev, src]));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-screen -mx-4">
      <Swiper
        spaceBetween={0}
        slidesPerView="auto"
        centeredSlides={false}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }}
        speed={2000}
        loop={true}
        loopAdditionalSlides={50}
        allowTouchMove={false}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {images.map((image: ImageType, index: number) => (
          <SwiperSlide key={`${image.src}-${index}`} className="!w-auto">
            <div className="relative h-[500px] w-[500px]">
              <div className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${loadedImages.has(image.src) ? 'opacity-0' : 'opacity-100'}`} />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index < 3}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading={index < 3 ? 'eager' : 'lazy'}
                onLoadingComplete={() => handleImageLoad(image.src)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 
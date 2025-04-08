'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Image as ImageType } from '@/utils/getImages';
import { getImages } from '@/utils/getImages';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ImageCarousel() {
  const [mounted, setMounted] = useState(false);
  const images = getImages();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {images.map((image: ImageType, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[500px]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 
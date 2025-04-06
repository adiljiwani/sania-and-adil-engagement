import Image from "next/image";
import ImageCarousel from '@/components/ImageCarousel';
import RSVPForm from '@/components/RSVPForm';

// Replace these with your actual images
const images = [
  {
    src: '/images/engagement1.jpg',
    alt: 'Engagement photo 1',
  },
  {
    src: '/images/engagement2.jpg',
    alt: 'Engagement photo 2',
  },
  // Add more images as needed
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <ImageCarousel images={images} />
      
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Sania & Adil</h1>
          <p className="text-xl text-center mb-12">
            We're getting engaged! Join us in celebrating this special moment.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Event Details</h2>
              <p className="text-lg">
                <strong>Date:</strong> [Your Date]<br />
                <strong>Time:</strong> [Your Time]<br />
                <strong>Location:</strong> [Your Location]
              </p>
            </div>
            
            <div>
              <RSVPForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

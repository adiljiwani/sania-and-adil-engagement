import Image from 'next/image';

interface InviteScreenProps {
  onRSVPClick: () => void;
}

export default function InviteScreen({ onRSVPClick }: InviteScreenProps) {
  return (
    <div className="relative h-screen w-screen flex flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
        <div className="relative h-full">
          <Image
            src="/images/invite.jpg"
            alt="Engagement Invitation"
            width={1000}
            height={1200}
            className="w-full h-full object-cover"
            priority
          />
          <button
            onClick={onRSVPClick}
            className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-3/4 text-white font-bold py-3 px-16 rounded-lg text-xl transition-colors duration-200 border-2 border-white hover:bg-[#311911] min-w-[200px]"
          >
            RSVP
          </button>
        </div>
      </div>
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
        <Image
          src="/images/event-details.jpg"
          alt="Event Details"
          width={1000}
          height={1200}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
} 
interface AlreadyRSVPdProps {
  familyMembers: {
    name: string;
  }[];
}

export default function AlreadyRSVPd({ familyMembers }: AlreadyRSVPdProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Thank You for Your RSVP!
      </h2>
      
      <div className="mb-6">
        <p className="text-center mb-4">
          We&apos;ve received RSVPs for the following family members:
        </p>
        <ul className="space-y-2">
          {familyMembers.map((member, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">{member.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-gray-600">
        <p>If you need to make any changes to your RSVP, please contact us directly.</p>
      </div>
    </div>
  );
} 
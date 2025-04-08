interface AlreadyRSVPdProps {
  familyMembers: {
    name: string;
    side: string;
    likely: string;
  }[];
}

export default function AlreadyRSVPd({ familyMembers }: AlreadyRSVPdProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
        Thank You for Your RSVP!
      </h2>
      
      <div className="mb-6">
        <p className="text-center mb-4">
          We've already received RSVPs for the following family members:
        </p>
        <ul className="space-y-2">
          {familyMembers.map((member, index) => (
            <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-gray-500">{member.side}</span>
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
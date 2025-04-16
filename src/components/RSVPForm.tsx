'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AlreadyRSVPd from './AlreadyRSVPd';

interface FamilyMember {
  name: string;
  side: string;
  likely: string;
}

interface FormData {
  familyMembers: {
    name: string;
    email: string;
    dietaryRestrictions?: string;
  }[];
}

const schema = yup.object({
  familyMembers: yup.array().of(
    yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      dietaryRestrictions: yup.string().optional(),
    })
  ).required(),
}).required();

export default function RSVPForm({ familyMembers }: { familyMembers: FamilyMember[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAlreadyRSVPd, setShowAlreadyRSVPd] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      familyMembers: familyMembers.map(member => ({
        name: member.name,
        email: '',
        dietaryRestrictions: '',
      })),
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSubmitStatus({ type: 'success', message: 'RSVP submitted successfully!' });
        setShowAlreadyRSVPd(true);
        reset();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit RSVP. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAlreadyRSVPd) {
    return <AlreadyRSVPd familyMembers={familyMembers} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">RSVP for Your Family</h2>
      
      {submitStatus && (
        <div className={`p-4 mb-4 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}

      {familyMembers.map((member, index) => (
        <div key={index} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">{member.name}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`email-${index}`}>
              Email *
            </label>
            <input
              {...register(`familyMembers.${index}.email`)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="your@email.com"
            />
            {errors.familyMembers?.[index]?.email && (
              <p className="text-red-500 text-xs italic">{errors.familyMembers[index]?.email?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`dietary-${index}`}>
              Dietary Restrictions
            </label>
            <input
              {...register(`familyMembers.${index}.dietaryRestrictions`)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Any dietary restrictions?"
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  );
} 
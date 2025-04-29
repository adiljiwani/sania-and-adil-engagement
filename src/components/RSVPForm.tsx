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
    email?: string;
    dietaryRestrictions?: string;
    attending: boolean;
  }[];
  useSingleEmail: boolean;
}

const schema = yup.object({
  familyMembers: yup.array().of(
    yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email('Invalid email').when(['attending', 'useSingleEmail'], {
        is: (attending: boolean, useSingleEmail: boolean) => attending && !useSingleEmail,
        then: (schema) => schema.required('Email is required when attending'),
        otherwise: (schema) => schema.optional(),
      }),
      dietaryRestrictions: yup.string().optional(),
      attending: yup.boolean().required('Please select attendance status'),
    })
  ).required(),
  useSingleEmail: yup.boolean().required(),
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
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      familyMembers: familyMembers.map(member => ({
        name: member.name,
        email: '',
        dietaryRestrictions: '',
        attending: true,
      })),
      useSingleEmail: false,
    },
  });

  const useSingleEmail = watch('useSingleEmail');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submission started");
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log("data pre if", data);

      if (data.useSingleEmail && data.familyMembers[0].email) {
        data.familyMembers = data.familyMembers.map(member => ({
          ...member,
          email: member.attending ? data.familyMembers[0].email : undefined,
        }));
      }

      console.log("data post if", data);

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log("API response received:", response);

      const result = await response.json();
      console.log("API result:", result);

      if (result.status === 'success') {
        setSubmitStatus({ type: 'success', message: 'RSVP submitted successfully!' });
        setShowAlreadyRSVPd(true);
        reset();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Error during form submission:", err);
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
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit((data) => {
          onSubmit(data);
        })(e);
      }} 
      className="max-w-md mx-auto p-6 bg-white/80 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl mb-6 text-center font-['Playfair_Display'] text-[#4F677D]">RSVP for Your Family</h2>
      
      {submitStatus && (
        <div className={`p-4 mb-4 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitStatus.message}
        </div>
      )}

      {familyMembers.map((member, index) => (
        <div key={index} className="mb-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-4">{member.name}</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Will you be attending? *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setValue(`familyMembers.${index}.attending`, true)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  watch(`familyMembers.${index}.attending`) === true
                    ? 'bg-[#311911] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setValue(`familyMembers.${index}.attending`, false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  watch(`familyMembers.${index}.attending`) === false
                    ? 'bg-[#311911] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
            {errors.familyMembers?.[index]?.attending && (
              <p className="text-red-500 text-xs italic">{errors.familyMembers[index]?.attending?.message}</p>
            )}
          </div>

          {index === 0 ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`email-${index}`}>
                  Email *
                </label>
                <input
                  {...register(`familyMembers.${index}.email`)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.familyMembers?.[index]?.email ? 'border-red-500' : ''
                  }`}
                  type="email"
                  placeholder="your@email.com"
                />
                {errors.familyMembers?.[index]?.email && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.familyMembers[index]?.email?.message}</p>
                )}
              </div>

              <div className="mb-4">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    const newValue = !useSingleEmail;
                    setValue('useSingleEmail', newValue);
                    if (newValue) {
                      // Get the first email value
                      const firstEmail = watch(`familyMembers.0.email`);
                      // Copy it to all other members
                      familyMembers.forEach((_, index) => {
                        if (index > 0) {
                          setValue(`familyMembers.${index}.email`, firstEmail);
                        }
                      });
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    {...register('useSingleEmail')}
                    className="mr-2"
                  />
                  <label className="text-gray-700 text-sm font-bold">
                    Use this email for all members
                  </label>
                </div>
              </div>
            </>
          ) : !useSingleEmail && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`email-${index}`}>
                Email *
              </label>
              <input
                {...register(`familyMembers.${index}.email`)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.familyMembers?.[index]?.email ? 'border-red-500' : ''
                }`}
                type="email"
                placeholder="your@email.com"
              />
              {errors.familyMembers?.[index]?.email && (
                <p className="text-red-500 text-xs italic mt-1">{errors.familyMembers[index]?.email?.message}</p>
              )}
            </div>
          )}

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
          onClick={() => console.log("Submit button clicked")}
          className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  );
} 
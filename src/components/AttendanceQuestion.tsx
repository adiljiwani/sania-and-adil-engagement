'use client';

import { useState } from 'react';

interface AttendanceQuestionProps {
  onAnswer: (willAttend: boolean) => void;
}

export default function AttendanceQuestion({ onAnswer }: AttendanceQuestionProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Will you be attending?</h2>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => {
            setSelected(true);
            onAnswer(true);
          }}
          className={`px-6 py-3 rounded-lg font-medium ${
            selected === true
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => {
            setSelected(false);
            onAnswer(false);
          }}
          className={`px-6 py-3 rounded-lg font-medium ${
            selected === false
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
} 
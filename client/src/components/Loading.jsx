import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] h-screen">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-orange-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-5 text-3xl text-center text-gray-600">Loading ...</p>
      </div>
    </div>
  );
}
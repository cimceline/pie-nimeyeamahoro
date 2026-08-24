import React from 'react';

export default function LoadingSpinner({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 border-2 border-slate-200 rounded-full" />
        <div className="absolute inset-0 border-2 border-copper-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

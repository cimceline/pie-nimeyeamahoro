import React from 'react';

export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 ${className}`}>
      {children}
    </span>
  );
}

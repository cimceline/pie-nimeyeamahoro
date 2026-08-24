import React from 'react';

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse bg-slate-200 rounded h-4" style={{ width: i === lines - 1 ? '70%' : '100%' }} />
      ))}
    </div>
  );
}

export function SkeletonHeading({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded h-8 w-2/3 ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 p-6 space-y-4 ${className}`}>
      <SkeletonText lines={1} className="w-1/3" />
      <SkeletonHeading />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonList({ count = 3, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6, cols = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'list', count = 3, className = '' }) {
  if (type === 'card') return <SkeletonGrid count={count} className={className} />;
  if (type === 'heading') return <SkeletonHeading className={className} />;
  return <SkeletonList count={count} className={className} />;
}

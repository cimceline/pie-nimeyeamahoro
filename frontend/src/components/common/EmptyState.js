import React from 'react';

export function EmptyState({ title = 'No content yet', description = 'This section will be populated once content is available.', action, className = '' }) {
  return (
    <div className={`text-center py-20 ${className}`}>
      <div className="w-16 h-px bg-copper-500 mx-auto mb-8" />
      <h3 className="font-display text-2xl font-semibold text-navy-950 mb-3">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Unable to load content', description = 'Something went wrong. Please try again.', onRetry, className = '' }) {
  return (
    <div className={`text-center py-20 ${className}`}>
      <div className="w-16 h-px bg-red-400 mx-auto mb-8" />
      <h3 className="font-display text-2xl font-semibold text-navy-950 mb-3">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent text-navy-950 font-semibold text-sm tracking-wide rounded-none border border-navy-950 hover:bg-navy-950 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}

export default EmptyState;

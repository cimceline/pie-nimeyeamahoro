import React from 'react';

/**
 * Trust signals displayed near CTAs to reinforce credibility.
 */
export default function TrustSignals({ profile = {}, compact = false, className = '' }) {
  const signals = [];

  if (profile.highestDegree || profile.education?.length > 0) {
    signals.push({ label: 'PhD / Advanced Degree' });
  }
  if (profile.publicationsCount > 0 || profile.publications?.length > 0) {
    signals.push({ label: `${profile.publicationsCount || profile.publications?.length || 0}+ Publications` });
  }
  if (profile.yearsExperience > 0) {
    signals.push({ label: `${profile.yearsExperience}+ Years Experience` });
  }
  if (profile.projectsCount > 0) {
    signals.push({ label: `${profile.projectsCount}+ Projects Completed` });
  }
  if (profile.languages?.length > 0) {
    signals.push({ label: `${profile.languages.length} Languages` });
  }
  if (profile.countriesWorked?.length > 0 || profile.internationalExperience) {
    signals.push({ label: 'International Experience' });
  }

  if (signals.length === 0) return null;

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 ${className}`}>
        {signals.slice(0, 3).map(({ label }, i) => (
          <span key={i} className="flex items-center gap-1">
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {signals.map(({ label }, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  );
}

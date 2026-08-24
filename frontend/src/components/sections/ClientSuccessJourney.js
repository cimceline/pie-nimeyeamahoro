import React from 'react';

const JOURNEY = [
  { step: 'Your Challenge', desc: 'You have a specific problem or goal that needs expert support.', color: 'bg-red-50 text-red-600' },
  { step: 'Expert Analysis', desc: 'We analyze your context, needs, and desired outcomes.', color: 'bg-orange-50 text-orange-600' },
  { step: 'Strategic Approach', desc: 'We design a tailored methodology and project plan.', color: 'bg-blue-50 text-blue-600' },
  { step: 'Implementation', desc: 'We execute the project with milestones and regular updates.', color: 'bg-purple-50 text-purple-600' },
  { step: 'Measurement', desc: 'We evaluate outcomes against defined indicators.', color: 'bg-green-50 text-green-600' },
  { step: 'Deliverables', desc: 'You receive comprehensive results and actionable recommendations.', color: 'bg-teal-50 text-teal-600' },
];

export default function ClientSuccessJourney({ className = '' }) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Client Success Journey</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">From Challenge to Results</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our structured process transforms your challenges into measurable outcomes through expert-guided stages.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-0.5 bg-gray-200" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {JOURNEY.map((j, i) => {
              return (
                <div key={i} className="text-center relative">
                  <div className={`w-14 h-14 rounded-2xl ${j.color} flex items-center justify-center mx-auto mb-3 relative z-10`}>
                    <span className="text-lg font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{j.step}</h3>
                  <p className="text-xs text-gray-500">{j.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

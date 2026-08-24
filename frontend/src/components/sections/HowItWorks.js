import React from 'react';

const STEPS = [
  { title: 'Tell Us About Your Project', desc: 'Describe your challenge, goals, and context through our simple form.' },
  { title: 'We Review Your Needs', desc: 'We analyze your requirements and identify the best approach.' },
  { title: 'Initial Consultation', desc: 'We discuss your project in detail and answer your questions.' },
  { title: 'Project Approach', desc: 'We develop a tailored methodology and project plan.' },
  { title: 'Proposal & Agreement', desc: 'You receive a clear scope, timeline, and transparent pricing.' },
  { title: 'Project Delivery', desc: 'We execute the project with regular updates and milestones.' },
  { title: 'Evaluation & Feedback', desc: 'We measure outcomes and gather your feedback for continuous improvement.' },
  { title: 'Results & Deliverables', desc: 'You receive comprehensive deliverables and actionable recommendations.' },
];

export default function HowItWorks({ className = '' }) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Simple Process</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From your first inquiry to project delivery, our structured process ensures clarity, transparency, and measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            return (
              <div key={i} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-5 left-[calc(100%+0.5rem)] w-[calc(100%-2rem)] h-0.5 bg-primary-100" style={{ left: `${(i % 4) * 25 + 12}%`, width: '13%' }} />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

const REASONS = [
  { title: 'Academic Expertise', desc: 'Research-grounded methodology combining rigorous academic standards with practical consulting.' },
  { title: 'Theory of Change', desc: 'Specialized expertise in developing and applying Theory of Change frameworks for complex initiatives.' },
  { title: 'Evidence-Based Evaluation', desc: 'Impact evaluation using validated indicators, mixed methods, and outcome measurement systems.' },
  { title: 'Strategic Project Design', desc: 'End-to-end project design from concept to proposal, aligned with funding requirements.' },
  { title: 'International Funding Knowledge', desc: 'Deep understanding of EU, UN, World Bank, and major international funding mechanisms.' },
  { title: 'Socio-Educational Expertise', desc: 'Specialized knowledge in education, social policy, and community development interventions.' },
  { title: 'Public-Policy Understanding', desc: 'Experience with policy analysis, welfare evaluation, and public-sector decision support.' },
  { title: 'Tailored Consulting', desc: 'Every engagement is customized to the organization\'s context, goals, and capacity.' },
];

export default function ValueProposition({ className = '' }) {
  return (
    <section className={`py-16 lg:py-24 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Why Work With Us</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Built on Research. Driven by Impact.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our approach combines academic rigor with practical consulting to deliver measurable results for every client.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((r, i) => {
            return (
              <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all group">
                <h3 className="font-semibold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

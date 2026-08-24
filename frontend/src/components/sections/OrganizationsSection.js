import React from 'react';
import { Link } from 'react-router-dom';

const ORGANIZATIONS = [
  { icon: '🎓', name: 'Universities', value: 'Research design, program evaluation, and curriculum development for academic institutions seeking measurable impact.' },
  { icon: '🔬', name: 'Research Centers', value: 'Methodological support, grant design, and impact assessment for research-driven organizations.' },
  { icon: '🤲', name: 'NGOs', value: 'Theory of Change development, impact evaluation, and project design for organizations maximizing social outcomes.' },
  { icon: '🏗️', name: 'Foundations', value: 'Strategic program design, evaluation frameworks, and outcome measurement for philanthropic initiatives.' },
  { icon: '🌐', name: 'International Organizations', value: 'Cross-country evaluations, policy analysis, and multi-stakeholder project coordination.' },
  { icon: '🏛️', name: 'Public Administrations', value: 'Policy evaluation, welfare assessment, and evidence-based decision support for government bodies.' },
  { icon: '🏘️', name: 'Municipalities', value: 'Local program evaluation, community impact assessment, and municipal project design.' },
  { icon: '📖', name: 'Educational Institutions', value: 'Educational service design, learning outcome evaluation, and institutional development.' },
  { icon: '🌱', name: 'Social Enterprises', value: 'Impact measurement, social value assessment, and sustainability-driven project design.' },
  { icon: '🏢', name: 'Corporate / CSR', value: 'CSR impact evaluation, social value reporting, and stakeholder engagement strategies.' },
];

export default function OrganizationsSection({ className = '' }) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Who We Work With</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Diverse Organizations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We partner with institutions across sectors to design, evaluate, and improve initiatives that create meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ORGANIZATIONS.map((org) => (
            <div key={org.name} className="group p-5 bg-white rounded-xl border hover:border-primary-200 hover:shadow-md transition-all">
              <span className="text-3xl mb-3 block">{org.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{org.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{org.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-semibold transition-colors">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import WhatsAppButton from '../common/WhatsAppButton';

const SERVICE_DELIVERABLES = {
  'Social Impact Evaluation': ['Evaluation framework', 'Theory of Change', 'Indicators & baseline', 'Monitoring system', 'Outcome measurement', 'Evaluation report', 'Recommendations'],
  'Theory of Change': ['Problem analysis', 'Stakeholder mapping', 'Logic model', 'Cause-effect pathways', 'Assumptions mapping', 'Indicator framework', 'Visual ToC diagram'],
  'Grant & Project Design': ['Concept note', 'Project proposal', 'Logical framework', 'Budget development', 'Work plan', 'Risk assessment', 'Donor alignment'],
  'Educational Services Consulting': ['Needs assessment', 'Curriculum design', 'Learning outcomes framework', 'Assessment tools', 'Implementation plan', 'Quality guidelines'],
  'Policy & Welfare Evaluation': ['Policy analysis', 'Stakeholder consultation', 'Impact assessment', 'Comparative analysis', 'Evidence synthesis', 'Policy brief', 'Recommendations'],
  'CSR & Social Value Consulting': ['Social value assessment', 'Impact indicators', 'Stakeholder mapping', 'Reporting framework', 'ROI analysis', 'Sustainability plan'],
  'Monitoring & Evaluation': ['M&E framework', 'Indicator matrix', 'Data collection tools', 'Reporting templates', 'Dashboard design', 'Training materials'],
  'Training': ['Training needs analysis', 'Curriculum design', 'Materials development', 'Delivery sessions', 'Assessment tools', 'Follow-up plan'],
};

const DEFAULT_DELIVERABLES = ['Needs assessment', 'Tailored methodology', 'Expert consultation', 'Comprehensive report', 'Actionable recommendations'];

const SERVICES_DATA = [
  { slug: 'social-impact-evaluation', name: 'Social Impact Evaluation', tagline: 'Understand whether your program is achieving meaningful outcomes.', icon: '📊' },
  { slug: 'theory-of-change', name: 'Theory of Change', tagline: 'Build a clear logical pathway from activities to impact.', icon: '🎯' },
  { slug: 'grant-project-design', name: 'Grant & Project Design', tagline: 'Design competitive projects aligned with international funding.', icon: '💰' },
  { slug: 'educational-services', name: 'Educational Services', tagline: 'Design and evaluate educational programs that deliver results.', icon: '📚' },
  { slug: 'policy-welfare-evaluation', name: 'Policy & Welfare Evaluation', tagline: 'Evidence-based evaluation of public policies and welfare interventions.', icon: '🏛️' },
  { slug: 'csr-social-value', name: 'CSR & Social Value', tagline: 'Measure and communicate the social value of your corporate initiatives.', icon: '🏢' },
];

export default function ServicesWithOutcomes({ className = '' }) {
  const { data: servicesData } = useApi('/services?sort=-order&isActive=true');
  const services = servicesData?.services || servicesData?.data || [];

  const displayServices = services.length > 0 ? services : SERVICES_DATA;

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Our Services</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Expert Solutions for Complex Challenges</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each service is designed to deliver specific, measurable outcomes for your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.slice(0, 6).map((svc) => {
            const deliverables = SERVICE_DELIVERABLES[svc.title || svc.name] || DEFAULT_DELIVERABLES;
            const svcName = svc.title || svc.name || 'Consulting Service';
            const svcSlug = svc.slug || '';
            const svcDesc = svc.shortDescription || svc.description || svc.tagline || '';

            return (
              <div key={svc._id || svc.slug} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all flex flex-col">
                <span className="text-3xl mb-3">{svc.icon || '💼'}</span>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{svcName}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{svcDesc}</p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Deliverables</p>
                  <div className="space-y-1">
                    {deliverables.slice(0, 4).map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-green-500">✓</span> {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link to={`/contact?type=project&service=${encodeURIComponent(svcName)}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-medium rounded-lg transition-colors">
                    Discuss Your Project
                  </Link>
                  <WhatsAppButton message={`Hello, I would like to discuss a ${svcName} project.`} source={`services_${svcSlug}`} size="sm" />
                </div>
              </div>
            );
          })}
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

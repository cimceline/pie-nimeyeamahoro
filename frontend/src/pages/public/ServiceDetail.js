import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { ServiceCTAGroup } from '../../components/common/CTAButtons';
import TrustSignals from '../../components/common/TrustSignals';
import DynamicFAQ from '../../components/sections/DynamicFAQ';

const DEFAULT_PROCESS = [
  'Initial consultation to understand your needs',
  'Context analysis and stakeholder mapping',
  'Methodology design and project planning',
  'Data collection and analysis',
  'Deliverable development',
  'Presentation and final review',
];

const DEFAULT_DELIVERABLES = [
  'Comprehensive needs assessment',
  'Tailored methodology',
  'Expert consultation sessions',
  'Data analysis and findings',
  'Professional report with recommendations',
  'Follow-up support',
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data, loading, error, execute } = useApi(`/services/${slug}`);
  const { data: profileData } = useApi('/profile/public');
  const { data: servicesData } = useApi('/services?limit=4&isActive=true');
  const { data: pubsData } = useApi('/publications?limit=3&sort=-publicationDate');
  const { data: projectsData } = useApi('/projects?limit=3&sort=-createdAt');

  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;

  const svc = data?.service || data || {};
  const p = profileData?.profile || profileData || {};
  const allServices = (servicesData?.services || servicesData?.data || []).filter(s => s.slug !== slug);
  const pubs = pubsData?.publications || pubsData?.data || [];
  const projects = projectsData?.projects || projectsData?.data || [];
  const svcName = svc.title || svc.name || 'Service';

  const deliverables = svc.deliverables?.length > 0 ? svc.deliverables : DEFAULT_DELIVERABLES;
  const processSteps = svc.process?.length > 0 ? svc.process : DEFAULT_PROCESS;
  const whoNeeds = svc.whoNeeds || [
    'Organizations seeking evidence-based insights',
    'Institutions designing new programs or initiatives',
    'Teams preparing for international funding applications',
    'Public bodies evaluating policy or welfare interventions',
  ];

  return (
    <>
      <SEO title={svcName} description={svc.shortDescription || svc.description} />

      {/* Hero */}
      <section className="bg-navy-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.04]" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="200" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="250" cy="250" r="80" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
          <Breadcrumbs items={[{ label: 'Services', path: '/services' }, { label: svcName }]} />

          <div className="mt-8">
            {svc.category && (
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">{svc.category}</p>
            )}
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-[1.1] mb-6">{svcName}</h1>
            {svc.shortDescription && (
              <p className="text-white/50 text-lg leading-relaxed max-w-3xl mb-8">{svc.shortDescription}</p>
            )}
            <ServiceCTAGroup serviceName={svcName} source="service_detail" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-5xl">
          {/* What is this service */}
          {svc.description && (
            <div className="mb-16">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">What is {svcName}?</h2>
              <div className="text-slate-600 leading-relaxed text-lg">
                {svc.content ? (
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: svc.content }} />
                ) : (
                  <p>{svc.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Problems it solves */}
          {svc.problems?.length > 0 && (
            <div className="mb-16 bg-navy-950 p-8 lg:p-12">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-6">Problems It Solves</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {svc.problems.map((prob, i) => (
                  <div key={i} className="flex items-start gap-3 text-white/70">
                    <span className="text-white/30 mt-1">—</span>
                    <span className="text-sm leading-relaxed">{prob}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who needs it */}
          <div className="mb-16">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">Who Needs This Service?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whoNeeds.map((who, i) => (
                <div key={i} className="flex items-start gap-3 py-4 border-b border-slate-100">
                  <span className="text-navy-950/30 mt-1">—</span>
                  <span className="text-slate-600 text-sm leading-relaxed">{who}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">How It Works</h2>
            <div className="space-y-0 divide-y divide-slate-100">
              {processSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-6 py-6">
                  <span className="font-display text-3xl font-light text-navy-950/20 leading-none shrink-0 w-12 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-600 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="mb-16 bg-slate-50 p-8 lg:p-12">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">What You Will Receive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-navy-950/30 mt-1">—</span>
                  <span className="text-slate-600 text-sm leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost transparency */}
          <div className="mb-16 text-center py-12 border-y border-slate-100">
            <p className="text-slate-500 mb-6">Each project is unique. Pricing is based on scope, complexity, and timeline.</p>
            <ServiceCTAGroup serviceName={svcName} source="service_detail_pricing" />
          </div>

          {/* Trust signals */}
          <div className="mb-16">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">Why Trust This Professional?</h2>
            <TrustSignals profile={p} />
          </div>

          {/* Related Research */}
          {pubs.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">Explore Related Research</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pubs.map(pub => (
                  <Link key={pub._id} to={`/publications/${pub.slug}`} className="group block py-4 border-b border-slate-100 hover:border-navy-950 transition-colors">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">{pub.publicationType || 'Publication'}</p>
                    <h3 className="font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors line-clamp-2">{pub.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {projects.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">View Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map(proj => (
                  <Link key={proj._id} to={`/projects/${proj.slug}`} className="group block py-4 border-b border-slate-100 hover:border-navy-950 transition-colors">
                    <h3 className="font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors">{proj.title}</h3>
                    {proj.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{proj.description}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Services */}
          {allServices.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-6">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allServices.slice(0, 3).map(s => (
                  <Link key={s._id} to={`/services/${s.slug}`} className="group block py-4 border-b border-slate-100 hover:border-navy-950 transition-colors">
                    <h3 className="font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors">{s.title || s.name}</h3>
                    {s.shortDescription && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{s.shortDescription}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <DynamicFAQ title={`Frequently Asked Questions About ${svcName}`} />

          {/* Comments */}
          {svc._id && <CommentSection entityType="service" entityId={svc._id} />}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-950 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
            Ready to Discuss Your {svcName}?
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Tell us about your project and we will help you determine the best approach.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ServiceCTAGroup serviceName={svcName} source="service_detail_final" />
          </div>
        </div>
      </section>
    </>
  );
}

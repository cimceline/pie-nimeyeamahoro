import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

export default function Services() {
  const { data: services, loading, error, execute } = useApi('/services?sort=-order');
  const items = services?.services || services?.data || [];

  return (
    <>
      <SEO
        title="Services"
        description="Expert solutions for complex challenges in research, evaluation and social impact."
      />

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
          <FadeUp>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">What I Offer</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-4xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
              Research,<br />
              strategy &<br />
              <span className="italic text-white/70">social impact.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
              Expert solutions crafted for your most complex challenges. I help organizations transform evidence into strategic decisions and measurable outcomes.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Services List */}
      <section className="bg-navy-950 text-white pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && (
            <div className="py-12">
              <SkeletonList count={4} />
            </div>
          )}

          {error && (
            <div className="py-12">
              <ErrorState onRetry={execute} />
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="py-12">
              <EmptyState
                title="No services listed"
                description="Services will appear here once they are published."
              />
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="divide-y divide-white/10">
              {items.map((item, index) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/services/${item.slug || item._id}`}
                    className="group flex items-start gap-6 lg:gap-12 py-8 lg:py-10 hover:bg-white/[0.03] transition-colors duration-300 -mx-4 px-4"
                  >
                    <span className="font-display text-4xl lg:text-5xl font-light text-white/20 group-hover:text-white/50 transition-colors leading-none shrink-0 w-16 text-right">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-2xl lg:text-3xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
                        {item.title || item.name}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 mb-0 group-hover:mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {item.category && (
                          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-white/20 group-hover:text-white/60 transition-all duration-300 shrink-0 self-center group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <FadeUp>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">Ready to Work Together?</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-navy-950 mb-6">
              Let's discuss how research,<br />
              evaluation and strategic design<br />
              can support your next initiative.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/contact?type=project"
                className="inline-flex items-center px-8 py-4 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors"
              >
                Start a Conversation
              </Link>
              <Link
                to="/appointments"
                className="inline-flex items-center px-8 py-4 border border-navy-950 text-navy-950 font-semibold text-sm tracking-wide hover:bg-navy-950 hover:text-white transition-colors"
              >
                Book an Appointment
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

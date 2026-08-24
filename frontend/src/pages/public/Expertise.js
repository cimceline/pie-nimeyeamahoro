import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonGrid } from '../../components/common/SkeletonLoader';

export default function Expertise() {
  const { data: expertise, loading, error, execute } = useApi('/expertise?sort=-order');
  const items = expertise?.expertise || expertise?.data || [];

  return (
    <>
      <SEO title="Expertise" description="Areas of expertise and professional specialization." />

      <section className="py-16 lg:py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">Specialization</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-ivory-50 max-w-3xl">
              Areas of Expertise
            </h1>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && (
            <SkeletonGrid count={6} cols={2} className="max-w-5xl mx-auto" />
          )}

          {error && (
            <ErrorState
              onRetry={execute}
              description="Unable to load expertise information. Please try again."
            />
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title="No expertise listed"
              description="Professional specializations will appear here once published."
            />
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-950/10">
              {items.map((item, index) => (
                <StaggerItem key={item._id}>
                  <div className="bg-ivory-50 p-8 lg:p-10 group hover:bg-navy-950 transition-colors duration-500 cursor-default h-full">
                    <span className="font-display text-copper-500 text-sm tracking-wider group-hover:text-copper-500/70 transition-colors duration-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-xl lg:text-2xl font-semibold text-navy-950 group-hover:text-ivory-50 mt-4 mb-4 transition-colors duration-500">
                      {item.name || item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-500 font-body text-sm leading-relaxed group-hover:text-ivory-50/70 transition-colors duration-500">
                        {item.description}
                      </p>
                    )}
                    <div className="w-8 h-px bg-copper-500 mt-6 group-hover:w-12 transition-all duration-500" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}

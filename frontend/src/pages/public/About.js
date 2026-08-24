import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import profileImage from '../../upload/image.jpeg';

export default function About() {
  const { data: profile, loading, error, execute } = useApi('/profile/public');
  const p = profile?.profile || profile || {};

  return (
    <>
      <SEO title="About" description={`About ${p.name || 'the researcher'} - Background, education, and expertise.`} />

      <section className="py-16 lg:py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">About</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-ivory-50 max-w-3xl">
              Bridging research, education and transformative practice.
            </h1>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
              <div className="lg:col-span-2">
                <SkeletonList count={2} />
              </div>
              <div className="lg:col-span-3">
                <SkeletonList count={3} />
              </div>
            </div>
          )}

          {error && (
            <ErrorState
              onRetry={execute}
              description="Unable to load profile information. Please try again."
            />
          )}

          {!loading && !error && !p.name && (
            <EmptyState
              title="Profile not available"
              description="Professional profile information will appear here once published."
            />
          )}

          {!loading && !error && p.name && (
            <StaggerChildren className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
              <StaggerItem className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="w-full aspect-square rounded-full overflow-hidden border border-slate-200 mb-8">
                    <img
                      src={profileImage}
                      alt={p.name || 'Pie NEMEYAMAHORO'}
                      className="w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Biography</p>
                  <h2 className="font-display text-3xl lg:text-4xl font-semibold text-navy-950 leading-tight mt-4 mb-6">
                    {p.name}
                  </h2>
                  {p.title && (
                    <p className="text-slate-500 font-body text-sm tracking-wide uppercase mb-6">
                      {p.title}
                    </p>
                  )}
                  <div className="w-12 h-px bg-copper-500 mb-8" />

                  {p.credentials && p.credentials.length > 0 && (
                    <div className="space-y-3 mt-8">
                      {p.credentials.map((cred, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-copper-500 font-display text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                          <p className="text-navy-950 font-body text-sm leading-relaxed">{cred}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>

              <StaggerItem className="lg:col-span-3">
                <div className="prose-editorial">
                  <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mb-8">Professional Background</p>

                  {p.biography && (
                    <div className="text-slate-500 font-body leading-relaxed space-y-6 text-base mb-12">
                      {p.biography.split('\n').filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}

                  {!p.biography && p.summary && (
                    <div className="text-slate-500 font-body leading-relaxed space-y-6 text-base mb-12">
                      <p>{p.summary}</p>
                    </div>
                  )}

                  {p.highlights && p.highlights.length > 0 && (
                    <div className="mt-12 mb-12">
                      <h3 className="font-display text-xl font-semibold text-navy-950 mb-6">Key Highlights</h3>
                      <div className="space-y-4">
                        {p.highlights.map((item, i) => (
                          <div key={i} className="border-l-2 border-copper-500 pl-6 py-2">
                            <p className="text-navy-950 font-body leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.profileLink && (
                    <a
                      href={p.profileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-copper-500 font-body text-sm font-medium tracking-wide uppercase mt-8 hover:text-navy-950 transition-colors duration-300 group"
                    >
                      Read Full Profile
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </a>
                  )}
                </div>
              </StaggerItem>
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}

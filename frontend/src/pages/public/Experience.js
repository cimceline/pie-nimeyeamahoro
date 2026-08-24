import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

function getYearRange(start, end) {
  if (!start) return '';
  const s = new Date(start).getFullYear();
  const e = end ? new Date(end).getFullYear() : 'Present';
  return `${s} – ${e}`;
}

export default function Experience() {
  const { t } = useLanguage();
  const { data: experience, loading, error } = useApi('/experience?sort=-startDate');
  const items = experience?.experience || experience?.data || [];

  return (
    <>
      <SEO title={t('experience.title', 'Experience')} description={t('experience.subtitle', 'Professional experience and career history.')} />
      <section className="py-16 lg:py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-400">{t('experience.label', 'Professional Background')}</span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight">{t('experience.title', 'Experience')}</h1>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && <SkeletonList count={4} />}
          {error && <ErrorState onRetry={() => window.location.reload()} />}
          {!loading && !error && items.length === 0 && (
            <EmptyState title={t('experience.empty', 'No experience records found.')} />
          )}
          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />
              {items.map((item) => (
                <StaggerItem key={item._id} className="relative pl-14 pb-12 last:pb-0">
                  <div className="absolute left-0 top-1 w-[40px] h-[40px] rounded-full bg-ivory-50 border-2 border-copper-500 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-copper-500" />
                  </div>
                  <div className="bg-ivory-50 border border-slate-200 p-6 lg:p-8 hover:border-copper-300 transition-colors duration-300">
                    {item.startDate && (
                      <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">{getYearRange(item.startDate, item.endDate)}</span>
                    )}
                    <h3 className="font-display text-xl lg:text-2xl font-bold text-navy-950 mb-1">{item.title}</h3>
                    <p className="text-copper-500 font-medium mb-2">{item.organization}</p>
                    {(item.location || item.employmentType) && (
                      <p className="text-sm text-slate-500 mb-4">
                        {item.location}{item.location && item.employmentType ? ' · ' : ''}{item.employmentType}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-slate-600 leading-relaxed font-body">{item.description}</p>
                    )}
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

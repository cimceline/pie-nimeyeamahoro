import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../utils/formatters';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

export default function Education() {
  const { t } = useLanguage();
  const { data: education, loading, error, execute } = useApi('/education?sort=-startDate');
  const items = education?.education || education?.data || [];

  return (
    <>
      <SEO title={t('education.title', 'Education')} description={t('education.subtitle', 'Academic background and qualifications.')} />

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">{t('education.sectionLabel', 'Academic Background')}</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-navy-950 max-w-3xl">
              {t('education.heading', 'Education')}
            </h1>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-5xl">
          {loading && <SkeletonList count={4} />}

          {error && (
            <ErrorState onRetry={execute} />
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title={t('education.emptyTitle', 'No education records found')}
              description={t('education.emptyDescription', 'Academic background will appear here once available.')}
            />
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-0">
                {items.map((item, index) => (
                  <StaggerItem key={item._id}>
                    <div className="relative pl-12 pb-12 last:pb-0">
                      <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-copper-500 border-4 border-ivory-50 -translate-x-[5.5px]" />
                      {index < items.length - 1 && (
                        <div className="absolute left-0 top-4 bottom-0 w-px bg-slate-200 -translate-x-px" />
                      )}
                      <div className="bg-white border border-slate-200 p-8 hover:border-copper-300 transition-all duration-300">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-display text-xl font-semibold text-navy-950 leading-snug">
                              {item.degree || item.title}
                            </h3>
                            {item.institution && (
                              <p className="text-copper-500 font-medium mt-1">{item.institution}</p>
                            )}
                          </div>
                          {item.startDate && (
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {formatDate(item.startDate, 'yyyy')} – {item.endDate ? formatDate(item.endDate, 'yyyy') : t('common.present', 'Present')}
                            </span>
                          )}
                        </div>
                        {item.field && (
                          <p className="text-sm text-slate-500 mb-3">{item.field}</p>
                        )}
                        {item.description && (
                          <p className="text-slate-500 text-sm leading-relaxed mt-4">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}

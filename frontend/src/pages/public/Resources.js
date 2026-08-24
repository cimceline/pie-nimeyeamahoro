import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../utils/formatters';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

export default function Resources() {
  const { t } = useLanguage();
  const { data: resources, loading, error } = useApi('/resources?sort=-createdAt');
  const items = resources?.resources || resources?.data || [];

  return (
    <>
      <SEO title={t('resources.title', 'Resources')} description={t('resources.subtitle', 'Useful resources and downloadable materials.')} />
      <section className="py-16 lg:py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-400">{t('resources.label', 'Resources')}</span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight">{t('resources.title', 'Resources & Downloads')}</h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-slate-400 mt-6">{t('resources.subtitle', 'Useful resources and downloadable materials.')}</p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && <SkeletonList count={4} />}
          {error && <ErrorState onRetry={() => window.location.reload()} />}
          {!loading && !error && items.length === 0 && (
            <EmptyState title={t('resources.empty', 'No resources found.')} />
          )}
          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <StaggerItem key={item._id}>
                  <a
                    href={`/resources/${item.slug || item._id}`}
                    className="block bg-ivory-50 border border-slate-200 p-6 lg:p-8 hover:border-copper-300 transition-all duration-300 group h-full"
                  >
                    {item.type && (
                      <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">{item.type}</span>
                    )}
                    <h3 className="font-display text-xl font-bold text-navy-950 mb-3 group-hover:text-copper-500 transition-colors duration-300">{item.title}</h3>
                    {item.description && (
                      <p className="text-slate-500 leading-relaxed font-body mb-4 line-clamp-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      {item.createdAt && (
                        <span className="text-sm text-slate-400">{formatDate(item.createdAt)}</span>
                      )}
                      <span className="text-sm font-semibold text-copper-500 group-hover:translate-x-1 transition-transform duration-300">
                        {t('common.download', 'Download')} →
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}

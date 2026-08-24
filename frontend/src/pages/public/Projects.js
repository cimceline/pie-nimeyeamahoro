import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionLabel from '../../components/common/SectionLabel';
import StatusBadge from '../../components/common/StatusBadge';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

export default function Projects() {
  const { t } = useLanguage();
  const { data: projects, loading, error, execute } = useApi('/projects?sort=-startDate');
  const items = projects?.projects || projects?.data || [];

  return (
    <>
      <SEO
        title={t('projects.title', 'Projects')}
        description={t('projects.subtitle', 'A collection of projects and creative works.')}
      />

      <section className="bg-navy-950 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl mx-auto px-6">
          <FadeUp>
            <SectionLabel light>{t('projects.label', 'Impact Work')}</SectionLabel>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-navy-950">
              {t('projects.title', 'Projects')}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-navy-300">
              {t('projects.subtitle', 'A curated collection of work that speaks for itself.')}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-ivory-50 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl mx-auto px-6">
          {loading && <SkeletonList count={3} />}

          {error && <ErrorState onRetry={execute} />}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title={t('projects.empty', 'No projects yet')}
              description={t('projects.emptyDesc', 'Projects will appear here once they are published.')}
            />
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/projects/${item.slug || item._id}`}
                    className="group block bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-navy-950/5 hover:border-navy-950/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {item.status && <StatusBadge status={item.status} />}
                      {item.category && (
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-navy-950/40">{item.category}</span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-navy-950 mb-3 group-hover:translate-x-1 transition-transform">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center text-sm font-medium text-navy-950/60 group-hover:text-navy-950 group-hover:gap-2 transition-all">
                        {t('common.viewDetails', 'View Details')}
                        <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                      </span>
                      {item.startDate && (
                        <span className="text-xs text-slate-400">{formatDate(item.startDate)}</span>
                      )}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonGrid } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

export default function Articles() {
  const { t } = useLanguage();
  const { data: articles, loading, error, execute } = useApi('/articles?sort=-createdAt&status=published');
  const items = articles?.articles || articles?.data || [];

  return (
    <>
      <SEO title={t('articles.title', 'Articles & Insights')} description={t('articles.subtitle', 'Thoughts, insights, and articles on various topics.')} />

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">{t('articles.sectionLabel', 'Insights')}</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-navy-950 max-w-3xl">
              {t('articles.heading', 'Articles & Insights')}
            </h1>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl">
          {loading && <SkeletonGrid count={6} cols={2} />}

          {error && (
            <ErrorState onRetry={execute} />
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title={t('articles.emptyTitle', 'No articles published yet')}
              description={t('articles.emptyDescription', 'Articles and insights will appear here once published.')}
            />
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/articles/${item.slug || item._id}`}
                    className="block bg-white border border-slate-200 p-8 hover:border-copper-300 transition-all duration-300 group h-full"
                  >
                    {item.category && (
                      <span className="inline-block text-xs font-medium tracking-widest uppercase text-copper-500 mb-4">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-navy-950 mb-3 group-hover:text-copper-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      {item.createdAt && (
                        <span className="text-xs text-slate-400">
                          {formatDate(item.createdAt)}
                        </span>
                      )}
                      <span className="text-xs font-medium text-copper-500 group-hover:text-copper-600 transition-colors">
                        {t('common.readMore', 'Read More')} →
                      </span>
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

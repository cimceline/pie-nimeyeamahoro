import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonGrid } from '../../components/common/SkeletonLoader';

export default function Books() {
  const { t } = useLanguage();
  const { data: books, loading, error, execute } = useApi('/books/published');
  const items = books?.books || books?.data || [];

  return (
    <>
      <SEO title={t('books.title', 'Books')} description={t('books.subtitle', 'Browse published books and academic publications.')} />

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">{t('books.sectionLabel', 'Publications')}</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-navy-950 max-w-3xl">
              {t('books.heading', 'Books')}
            </h1>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl">
          {loading && <SkeletonGrid count={6} cols={2} />}

          {error && (
            <ErrorState onRetry={execute} />
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              title={t('books.emptyTitle', 'No books published yet')}
              description={t('books.emptyDescription', 'Published books will appear here once available.')}
            />
          )}

          {!loading && !error && items.length > 0 && (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/books/${item.slug || item._id}`}
                    className="block bg-ivory-50 border border-slate-200 overflow-hidden hover:border-copper-300 transition-all duration-300 group h-full"
                  >
                    {item.coverImage && (
                      <div className="h-56 bg-slate-100 overflow-hidden">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="font-display text-xl font-semibold text-navy-950 mb-2 group-hover:text-copper-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.author && (
                        <p className="text-sm text-copper-500 font-medium mb-1">{item.author}</p>
                      )}
                      {(item.publisher || item.year) && (
                        <p className="text-xs text-slate-400 mb-4">
                          {[item.publisher, item.year].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                        {item.viewCount > 0 && <span>{item.viewCount} {t('books.views', 'views')}</span>}
                        {item.downloadCount > 0 && <span>{item.downloadCount} {t('books.downloads', 'downloads')}</span>}
                        {item.pageCount > 0 && <span>{item.pageCount} {t('books.pages', 'pages')}</span>}
                      </div>
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

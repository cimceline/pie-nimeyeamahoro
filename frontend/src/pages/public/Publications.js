import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

export default function Publications() {
  const { data: publications, loading, error, refetch } = useApi('/publications?sort=-publicationDate');
  const items = publications?.publications || publications?.data || [];

  return (
    <>
      <SEO
        title="Publications"
        description="Peer-reviewed articles, books, and research papers."
      />
      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Publications</span>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight mt-4">Publications</h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mt-6">
              Peer-reviewed articles, books, and research papers contributing to the field.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          {loading ? (
            <SkeletonList count={4} />
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : items.length === 0 ? (
            <EmptyState
              title="No Publications"
              description="Publications will appear here once available."
            />
          ) : (
            <StaggerChildren>
              {items.map((item, index) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/publications/${item.slug || item._id}`}
                    className="block group"
                  >
                    <div className={`flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8 ${
                      index < items.length - 1 ? 'border-b border-slate-200' : ''
                    }`}>
                      <div className="sm:w-20 flex-shrink-0">
                        {item.publicationDate && (
                          <span className="text-sm font-medium text-slate-400">
                            {new Date(item.publicationDate).getFullYear()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {item.type && (
                            <span className="text-xs font-medium tracking-widest uppercase text-copper-500">
                              {item.type}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-navy-950 mb-2 group-hover:text-copper-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.journal && (
                          <p className="text-sm text-slate-500 mb-1">
                            {item.journal}{item.publisher ? `, ${item.publisher}` : ''}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-2">
                            {item.description}
                          </p>
                        )}
                        {item.doi && (
                          <span className="inline-block mt-3 text-xs font-medium text-copper-500 group-hover:text-copper-600 transition-colors">
                            DOI →
                          </span>
                        )}
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

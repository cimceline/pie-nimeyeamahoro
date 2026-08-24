import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

export default function Research() {
  const { data: research, loading, error, refetch } = useApi('/research-projects?sort=-startDate');
  const items = research?.researchProjects || research?.data || [];

  return (
    <>
      <SEO
        title="Research"
        description="Ongoing and completed research projects."
      />
      <section className="py-16 lg:py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">Research</span>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-white mt-4">Selected Research</h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-slate-400 mt-6">
              Ongoing and completed research projects driving innovation and discovery.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-5xl">
          {loading ? (
            <SkeletonList count={3} />
          ) : error ? (
            <ErrorState onRetry={refetch} className="bg-white/5 rounded-2xl" />
          ) : items.length === 0 ? (
            <EmptyState
              title="No Research Projects"
              description="Research projects will appear here once available."
              className="bg-white/5 rounded-2xl"
            />
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <StaggerItem key={item._id}>
                  <Link
                    to={`/research/${item.slug || item._id}`}
                    className="block bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 group h-full"
                  >
                    {item.category && (
                      <span className="inline-block text-xs font-medium tracking-widest uppercase text-copper-500 mb-4">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-copper-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      {item.startDate && (
                        <span className="text-xs text-slate-500">
                          {new Date(item.startDate).getFullYear()}
                        </span>
                      )}
                      <span className="text-xs font-medium text-copper-500 group-hover:text-copper-400 transition-colors">
                        View Details →
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

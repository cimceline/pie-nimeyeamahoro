import React from 'react';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { EmptyState, ErrorState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/SkeletonLoader';

const PROFICIENCY_LABEL = {
  expert: { en: 'Expert', fr: 'Expert', la: 'Peritus' },
  advanced: { en: 'Advanced', fr: 'Avancé', la: 'Promotus' },
  intermediate: { en: 'Intermediate', fr: 'Intermédiaire', la: 'Mediocris' },
  beginner: { en: 'Foundations', fr: 'Débutant', la: 'Fundamentum' },
};

export default function Skills() {
  const { t, currentLanguage } = useLanguage();
  const { data: skills, loading, error } = useApi('/skills?sort=-order');
  const items = skills?.skills || skills?.data || [];

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <>
      <SEO title={t('skills.title', 'Skills')} description={t('skills.subtitle', 'Professional skills and competencies.')} />
      <section className="py-16 lg:py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-400">{t('skills.label', 'Capabilities')}</span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight">{t('skills.title', 'Skills & Expertise')}</h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-slate-400 mt-6">{t('skills.subtitle', 'Professional skills and competencies.')}</p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          {loading && <SkeletonList count={4} />}
          {error && <ErrorState onRetry={() => window.location.reload()} />}
          {!loading && !error && items.length === 0 && (
            <EmptyState title={t('skills.empty', 'No skills listed.')} />
          )}
          {!loading && !error && categories.length > 0 && (
            <div className="space-y-16">
              {categories.map(([category, categorySkills], idx) => (
                <FadeUp key={category} delay={idx * 0.1}>
                  <div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950 mb-2">{category}</h2>
                    <div className="w-12 h-px bg-copper-500 mb-8" />
                    <StaggerChildren className="space-y-5">
                      {categorySkills.map((item) => (
                        <StaggerItem key={item._id}>
                          <div className="bg-white border border-slate-200 p-5 lg:p-6 hover:border-copper-300 transition-colors duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="font-display text-lg font-bold text-navy-950">{item.name}</h3>
                                  {item.isFeatured && (
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-copper-500 border border-copper-300 px-2 py-0.5">
                                      {t('common.featured', 'Featured')}
                                    </span>
                                  )}
                                </div>
                                {item.yearsOfExperience > 0 && (
                                  <p className="text-sm text-slate-500 mt-1">
                                    {item.yearsOfExperience} {t('skills.yearsExperience', 'years experience')}
                                  </p>
                                )}
                              </div>
                              {item.proficiency && (
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-copper-500">
                                    {PROFICIENCY_LABEL[item.proficiency]?.[currentLanguage] || PROFICIENCY_LABEL[item.proficiency]?.en || item.proficiency}
                                  </span>
                                  <div className="hidden sm:flex items-center gap-1">
                                    {[...Array(4)].map((_, i) => {
                                      const level = item.proficiency === 'expert' ? 4 : item.proficiency === 'advanced' ? 3 : item.proficiency === 'intermediate' ? 2 : 1;
                                      return (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < level ? 'bg-copper-500' : 'bg-slate-200'}`} />
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerChildren>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { FadeUp, StaggerChildren, StaggerItem } from '../../components/common/AnimatedSection';
import { formatDate } from '../../utils/formatters';

const STATUS_STYLES = {
  completed: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200',
  ongoing: 'bg-blue-500/10 text-blue-700 border border-blue-200',
  active: 'bg-blue-500/10 text-blue-700 border border-blue-200',
  planned: 'bg-amber-500/10 text-amber-700 border border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border border-slate-200',
  published: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200',
};

function getStatusStyle(status) {
  if (!status) return '';
  const normalized = status.toLowerCase();
  return STATUS_STYLES[normalized] || 'bg-slate-100 text-slate-600 border border-slate-200';
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { data, loading, error, execute } = useApi(`/projects/${slug}`);
  const { data: allProjects } = useApi('/projects?limit=4&sort=-createdAt');

  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;

  const item = data?.project || data || {};
  const allItems = allProjects?.projects || allProjects?.data || [];
  const relatedProjects = allItems
    .filter(p => (p.slug || p._id) !== (item.slug || item._id))
    .slice(0, 3);

  const startDate = item.startDate || item.timeline?.start;
  const endDate = item.endDate || item.timeline?.end;

  return (
    <>
      <SEO title={item.title} description={item.description || item.title} />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl">
          <FadeUp>
            <Breadcrumbs items={[{ label: 'Projects', path: '/projects' }, { label: item.title }]} light />
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {item.category && (
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/50 bg-white/10 px-3 py-1.5">{item.category}</span>
              )}
              {item.status && (
                <span className={`text-xs font-semibold px-3 py-1.5 ${getStatusStyle(item.status)}`}>{item.status}</span>
              )}
              {item.featured && (
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-amber-400 bg-amber-400/10 px-3 py-1.5">Featured</span>
              )}
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{item.title}</h1>
          </FadeUp>
          {item.description && (
            <FadeUp delay={0.3}>
              <p className="text-lg text-navy-300 max-w-3xl leading-relaxed">{item.description}</p>
            </FadeUp>
          )}
          {(startDate || endDate) && (
            <FadeUp delay={0.4}>
              <div className="flex items-center gap-2 mt-8 text-sm text-white/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{startDate && formatDate(startDate)}{startDate && endDate && ' \u2014 '}{endDate && formatDate(endDate)}</span>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-navy-950/60 hover:text-navy-950 transition-colors mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('common.backToProjects', 'Back to Projects')}
              </Link>

              {item.objectives && item.objectives.length > 0 && (
                <FadeUp>
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-bold text-navy-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-navy-950" />
                      {t('project.objectives', 'Objectives')}
                    </h2>
                    <ol className="space-y-4">
                      {item.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold text-navy-950 bg-navy-950/5 border border-navy-950/10">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-slate-600 leading-relaxed pt-0.5">{obj}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </FadeUp>
              )}

              {item.methodology && (
                <FadeUp>
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-bold text-navy-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-navy-950" />
                      {t('project.methodology', 'Methodology')}
                    </h2>
                    <div className="text-slate-600 leading-relaxed prose prose-lg max-w-none">{item.methodology}</div>
                  </div>
                </FadeUp>
              )}

              {item.responsibilities && item.responsibilities.length > 0 && (
                <FadeUp>
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-bold text-navy-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-navy-950" />
                      {t('project.responsibilities', 'Responsibilities')}
                    </h2>
                    <ul className="space-y-3">
                      {item.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy-950/30 mt-2 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              )}

              {item.outcomes && item.outcomes.length > 0 && (
                <FadeUp>
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-bold text-navy-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-navy-950" />
                      {t('project.outcomes', 'Outcomes')}
                    </h2>
                    <ul className="space-y-3">
                      {item.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy-950/30 mt-2 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              )}

              {item.impact && (
                <FadeUp>
                  <div className="mb-12 bg-navy-950 text-white p-8 lg:p-10">
                    <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                      <span className="w-8 h-px bg-white/30" />
                      {t('project.impact', 'Impact')}
                    </h2>
                    <div className="text-white/80 leading-relaxed">{item.impact}</div>
                  </div>
                </FadeUp>
              )}

              {item.content && (
                <FadeUp>
                  <div className="mb-12">
                    <h2 className="font-display text-xl font-bold text-navy-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-navy-950" />
                      {t('project.details', 'Details')}
                    </h2>
                    <div className="prose prose-lg prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </FadeUp>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-8 space-y-8">
                {item.technologies && item.technologies.length > 0 && (
                  <FadeUp>
                    <div className="bg-white border border-slate-200 p-6">
                      <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-navy-950 mb-4">{t('project.technologies', 'Technologies')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, i) => (
                          <span key={i} className="text-xs font-medium text-navy-950 bg-navy-950/5 border border-navy-950/10 px-3 py-1.5">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </FadeUp>
                )}

                {item.partners && item.partners.length > 0 && (
                  <FadeUp>
                    <div className="bg-white border border-slate-200 p-6">
                      <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-navy-950 mb-4">{t('project.partners', 'Partners')}</h3>
                      <ul className="space-y-2">
                        {item.partners.map((partner, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-navy-950/20" />
                            {typeof partner === 'string' ? partner : partner.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                )}

                <FadeUp>
                  <div className="bg-white border border-slate-200 p-6">
                    <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-navy-950 mb-4">{t('project.links', 'Links')}</h3>
                    <div className="space-y-3">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-slate-600 hover:text-navy-950 transition-colors group">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {t('project.website', 'Project Website')}
                          </span>
                          <span className="text-navy-950/40 group-hover:text-navy-950 transition-colors">&rarr;</span>
                        </a>
                      )}
                      {item.github && (
                        <a href={item.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-slate-600 hover:text-navy-950 transition-colors group">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                          </span>
                          <span className="text-navy-950/40 group-hover:text-navy-950 transition-colors">&rarr;</span>
                        </a>
                      )}
                      {item.externalLinks && item.externalLinks.map((link, i) => (
                        <a key={i} href={link.url || link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-slate-600 hover:text-navy-950 transition-colors group">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {link.label || `Link ${i + 1}`}
                          </span>
                          <span className="text-navy-950/40 group-hover:text-navy-950 transition-colors">&rarr;</span>
                        </a>
                      ))}
                      {!item.url && !item.github && (!item.externalLinks || item.externalLinks.length === 0) && (
                        <p className="text-sm text-slate-400">No links available</p>
                      )}
                    </div>
                  </div>
                </FadeUp>

                <FadeUp>
                  <Link to="/contact?type=project" className="block text-center px-6 py-4 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-900 transition-colors">
                    {t('project.startConversation', 'Start a Conversation')}
                  </Link>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-6xl">
            <FadeUp>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-950/40 mb-3">{t('project.relatedProjects', 'Related Projects')}</p>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-navy-950">{t('project.moreWork', 'More Work')}</h2>
                </div>
                <Link to="/projects" className="text-sm font-medium text-navy-950/60 hover:text-navy-950 transition-colors hidden md:inline-flex items-center gap-1">
                  {t('common.viewAll', 'View All')} &rarr;
                </Link>
              </div>
            </FadeUp>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((proj) => (
                <StaggerItem key={proj._id}>
                  <Link to={`/projects/${proj.slug || proj._id}`} className="group block bg-ivory-50 border border-slate-200 p-6 hover:border-navy-950/20 transition-all duration-300">
                    {proj.category && <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-navy-950/40 mb-2">{proj.category}</p>}
                    <h3 className="font-display text-lg font-semibold text-navy-950 mb-2 group-hover:translate-x-1 transition-transform">{proj.title}</h3>
                    {proj.description && <p className="text-sm text-slate-500 line-clamp-2 mb-4">{proj.description}</p>}
                    {proj.status && <span className="text-xs font-medium text-navy-950/60 bg-navy-950/5 px-2 py-1">{proj.status}</span>}
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {item._id && (
        <section className="py-16 lg:py-24 bg-ivory-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
            <CommentSection entityType="project" entityId={item._id} />
          </div>
        </section>
      )}
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';
import { formatDate, truncate } from '../../utils/formatters';
import { FadeUp, StaggerChildren, StaggerItem, CountUp } from '../../components/common/AnimatedSection';
import profileImage from '../../upload/image.jpeg';

const METHODOLOGY_STEPS = [
  { num: '01', title: 'Research', desc: 'Deep analysis of context, evidence, and stakeholders.' },
  { num: '02', title: 'Theory of Change', desc: 'Logical framework connecting activities to outcomes.' },
  { num: '03', title: 'Strategic Design', desc: 'Methodology and roadmap tailored to your needs.' },
  { num: '04', title: 'Implementation', desc: 'Working alongside your team to execute.' },
  { num: '05', title: 'Evaluation', desc: 'Measuring impact with rigorous frameworks.' },
  { num: '06', title: 'Learning & Scale', desc: 'Insights that drive continuous improvement.' },
];

export default function Home() {
  const { data: profile } = useApi('/profile/public');
  const { data: publications } = useApi('/publications?limit=3&sort=-publicationDate');
  const { data: projects } = useApi('/projects?limit=3&sort=-createdAt');
  const { data: research } = useApi('/research-projects?limit=3&sort=-startDate');
  const { data: expertiseData } = useApi('/expertise?limit=6');
  const { data: servicesData } = useApi('/services?limit=6');
  const { data: stats } = useApi('/analytics/stats');

  const p = profile?.profile || profile || {};
  const pubs = publications?.publications || publications?.data || [];
  const projs = projects?.projects || projects?.data || [];
  const researchItems = research?.data || research?.researchProjects || [];
  const expertiseItems = expertiseData?.data || expertiseData?.expertise || [];
  const serviceItems = servicesData?.data || servicesData?.services || [];
  const s = stats?.data || stats || {};

  return (
    <>
      <SEO
        title={p.professionalName || 'Social Impact Research & Consulting'}
        description={`${p.professionalName || 'Pie NEMEYAMAHORO'} — Research consultant specializing in social impact evaluation, project design, and educational consulting for universities, NGOs, and public institutions.`}
      />

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-navy-950 text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-navy-700/30 blur-2xl" />
          <svg className="absolute top-20 right-20 w-64 h-64 opacity-[0.03]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <FadeUp>
                <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 mb-6">Research · Social Impact · Strategic Design</p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-4xl lg:text-6xl xl:text-7xl mb-6">
                  Designing evidence<br />
                  for meaningful<br />
                  <span className="font-display italic text-white/70">social change.</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="text-lg text-navy-300 leading-relaxed mb-10 max-w-xl">
                  {p.shortBio || 'Research, evaluation and strategic project design for organizations working to create measurable and sustainable social impact.'}
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact?type=project" className="inline-flex items-center px-8 py-4 bg-white text-navy-950 font-semibold text-sm tracking-wide hover:bg-ivory-100 transition-colors duration-300">
                    Start a Conversation
                  </Link>
                  <Link to="/research" className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/5 transition-colors duration-300">
                    Explore Research
                  </Link>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-5 hidden lg:flex justify-end">
              <FadeUp delay={0.4}>
                <div className="relative">
                  <div className="w-80 h-96 rounded-full overflow-hidden border border-white/10">
                    <img
                      src={profileImage}
                      alt="Pie NEMEYAMAHORO"
                      className="w-full h-full object-cover scale-100 hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  {/* Floating card */}
                  <div className="absolute -bottom-6 -left-8 bg-navy-800 border border-navy-700 p-5 shadow-2xl">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Social Impact</p>
                    <div className="space-y-1.5">
                      {['Research', 'Evaluation', 'Strategy', 'Policy', 'Learning'].map((item) => (
                        <p key={item} className="text-xs text-white/30">{item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATISTICS ═══════ */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: s.research || 12, suffix: '+', label: 'Research Projects' },
              { value: s.projects || 24, suffix: '', label: 'Strategic Projects' },
              { value: s.education || 15, suffix: '+', label: 'Organizations Supported' },
              { value: s.publications || 8, suffix: '', label: 'Publications' },
            ].map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="font-display text-4xl lg:text-5xl font-bold text-navy-950">
                    <CountUp target={stat.value} />{stat.suffix}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM / SOLUTION ═══════ */}
      <section className="py-20 lg:py-28 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <FadeUp>
              <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">How I Can Help</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-3xl lg:text-5xl mb-4">
                What challenge<br />are you facing?
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                Every organization has unique needs. Whether you are evaluating a program, designing a project, or seeking strategic guidance — I can help you find the right approach.
              </p>
            </FadeUp>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { q: 'Need to evaluate the impact of your program?', a: 'Social Impact Evaluation', link: '/services' },
              { q: 'Need to develop a Theory of Change?', a: 'Theory of Change Consulting', link: '/services' },
              { q: 'Need help preparing a European project?', a: 'Grant & Project Design', link: '/services' },
              { q: 'Need to design an educational service?', a: 'Educational Consulting', link: '/services' },
              { q: 'Need to evaluate a public-policy intervention?', a: 'Policy & Welfare Evaluation', link: '/services' },
              { q: 'Need to measure CSR social value?', a: 'CSR & Social Value Consulting', link: '/services' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <Link to={item.link} className="group block p-6 bg-white border border-slate-200 hover:border-navy-950/20 transition-all duration-300">
                  <p className="text-sm text-slate-500 mb-3">{item.q}</p>
                  <p className="font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors">{item.a}</p>
                  <div className="mt-4 w-0 group-hover:w-8 h-px bg-navy-950/20 transition-all duration-300" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════ SERVICES ═══════ */}
      {serviceItems.length > 0 && (
        <section className="py-20 lg:py-28 bg-navy-950 text-white relative overflow-hidden">
          {/* Subtle geometric decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04]" viewBox="0 0 600 600">
              <circle cx="300" cy="300" r="250" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="300" cy="300" r="180" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="300" cy="300" r="110" fill="none" stroke="white" strokeWidth="0.5" />
              <line x1="50" y1="300" x2="550" y2="300" stroke="white" strokeWidth="0.3" />
              <line x1="300" y1="50" x2="300" y2="550" stroke="white" strokeWidth="0.3" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.03]" viewBox="0 0 400 400">
              <rect x="50" y="50" width="300" height="300" fill="none" stroke="white" strokeWidth="0.5" />
              <rect x="100" y="100" width="200" height="200" fill="none" stroke="white" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="350" y2="350" stroke="white" strokeWidth="0.3" />
              <line x1="350" y1="50" x2="50" y2="350" stroke="white" strokeWidth="0.3" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left — Heading */}
              <div className="lg:col-span-5">
                <FadeUp>
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Services</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-6">
                    Research,<br />
                    strategy &<br />
                    <span className="italic text-white/70">social impact.</span>
                  </h2>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md">
                    I help organizations transform research and evidence into strategic decisions, measurable impact and sustainable change.
                  </p>
                </FadeUp>
                <FadeUp delay={0.3}>
                  <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-white hover:text-white/70 transition-colors">
                    All Services <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </FadeUp>
              </div>

              {/* Right — Service List */}
              <div className="lg:col-span-7">
                <StaggerChildren className="divide-y divide-white/10">
                  {serviceItems.slice(0, 6).map((service, i) => (
                    <StaggerItem key={service._id || i}>
                      <Link
                        to={`/services/${service.slug || service._id}`}
                        className="group flex items-start gap-6 lg:gap-8 py-6 lg:py-8 hover:bg-white/[0.03] transition-colors duration-300 -mx-4 px-4"
                      >
                        <span className="text-sm font-bold text-white/30 group-hover:text-white/70 transition-colors mt-1 shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl lg:text-2xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2">
                            {service.title}
                          </h3>
                          <p className="text-sm text-white/40 leading-relaxed">
                            {truncate(service.shortDescription || service.description, 140)}
                          </p>
                        </div>
                        <span className="text-white/30 group-hover:text-white/70 transition-all duration-300 mt-2 shrink-0 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ METHODOLOGY ═══════ */}
      <section className="py-20 lg:py-28 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <FadeUp>
              <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-white/50">The Process</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-3xl lg:text-5xl">
                From research<br />to measurable impact.
              </h2>
            </FadeUp>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-800">
            {METHODOLOGY_STEPS.map((step) => (
              <StaggerItem key={step.num}>
                <div className="bg-navy-950 p-8 lg:p-10 group hover:bg-navy-900 transition-colors duration-300">
                  <span className="text-sm font-bold text-white/50">{step.num}</span>
                  <h3 className="text-xl font-semibold text-white mt-3 mb-2">{step.title}</h3>
                  <p className="text-sm text-navy-300">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════ EXPERTISE ═══════ */}
      {expertiseItems.length > 0 && (
        <section className="py-20 lg:py-28 bg-ivory-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-3xl">
                <FadeUp>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Specialization</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-3xl lg:text-5xl">Areas of Expertise</h2>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <Link to="/expertise" className="inline-flex items-center gap-2 text-copper-500 font-semibold text-sm tracking-wide hover:text-copper-600 transition-colors duration-200 hidden md:inline-flex">
                  View All →
                </Link>
              </FadeUp>
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
              {expertiseItems.slice(0, 6).map((item, i) => (
                <StaggerItem key={item._id || i}>
                  <Link to="/expertise" className="group block bg-ivory-50 p-8 hover:bg-white transition-colors duration-300">
                    <span className="text-sm font-bold text-navy-950/40">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg font-semibold text-navy-950 mt-3 mb-2 group-hover:text-navy-950/70 transition-colors">{item.title}</h3>
                    {item.description && <p className="text-sm text-slate-500">{truncate(item.description, 100)}</p>}
                    <div className="mt-4 w-0 group-hover:w-8 h-px bg-navy-950/20 transition-all duration-300" />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ═══════ RESEARCH ═══════ */}
      {researchItems.length > 0 && (
        <section className="py-20 lg:py-28 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-3xl">
                <FadeUp>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-white/50">Latest Research</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-3xl lg:text-5xl">Selected Research</h2>
                  <p className="text-navy-300 mt-4 max-w-xl">Evidence, inquiry and applied knowledge for complex social challenges.</p>
                </FadeUp>
              </div>
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {researchItems.map((item, i) => (
                <StaggerItem key={item._id || i}>
                  <Link to={`/research/${item.slug || item._id}`} className="group block bg-navy-900 border border-navy-700 p-6 lg:p-8 hover:border-copper-500/30 transition-all duration-300">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/50 mb-3">{item.category || 'Research'}</p>
                    <h3 className="text-lg font-semibold text-white group-hover:text-white/70 transition-colors mb-3">{item.title}</h3>
                    {item.description && <p className="text-sm text-navy-300">{truncate(item.description, 120)}</p>}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-navy-400">{item.startDate && formatDate(item.startDate)}</span>
                      <span className="text-white/50 text-sm opacity-0 group-hover:opacity-100 transition-opacity">View Research →</span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ═══════ PUBLICATIONS ═══════ */}
      {pubs.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-3xl">
                <FadeUp>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Latest Research</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-3xl lg:text-5xl">Publications</h2>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <Link to="/publications" className="inline-flex items-center gap-2 text-copper-500 font-semibold text-sm tracking-wide hover:text-copper-600 transition-colors duration-200 hidden md:inline-flex">
                  All Publications →
                </Link>
              </FadeUp>
            </div>

            <StaggerChildren className="space-y-0">
              {pubs.map((pub) => (
                <StaggerItem key={pub._id}>
                  <Link to={`/publications/${pub.slug}`} className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 py-6 border-b border-slate-200 hover:border-navy-950/20 transition-colors">
                    <span className="text-sm font-bold text-navy-950/60 md:w-20 flex-shrink-0">{pub.publicationDate ? formatDate(pub.publicationDate) : '—'}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-1">{pub.publicationType || 'Publication'}</p>
                      <h3 className="text-lg font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors">{pub.title}</h3>
                      {pub.journal && <p className="text-sm text-slate-500 mt-1">{pub.journal}</p>}
                    </div>
                    <span className="text-navy-950/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0">View →</span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ═══════ PROJECTS ═══════ */}
      {projs.length > 0 && (
        <section className="py-20 lg:py-28 bg-ivory-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div className="max-w-3xl">
                <FadeUp>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Impact Work</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-3xl lg:text-5xl">Projects</h2>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <Link to="/projects" className="inline-flex items-center gap-2 text-copper-500 font-semibold text-sm tracking-wide hover:text-copper-600 transition-colors duration-200 hidden md:inline-flex">
                  All Projects →
                </Link>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projs.slice(0, 1).map((proj) => (
                <FadeUp key={proj._id}>
                  <Link to={`/projects/${proj.slug}`} className="group block bg-navy-950 p-8 lg:p-12 min-h-[320px] flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent" />
                    <div className="relative">
                      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/50 mb-3">Featured Project</p>
                      <h3 className="text-2xl lg:text-3xl font-semibold text-white group-hover:text-white/70 transition-colors mb-3">{proj.title}</h3>
                      {proj.description && <p className="text-sm text-navy-300 max-w-md">{truncate(proj.description, 160)}</p>}
                      <div className="mt-6 flex items-center gap-4">
                        {proj.status && <span className="text-xs font-medium text-white/50 bg-white/10 px-3 py-1">{proj.status}</span>}
                        <span className="text-white/50 text-sm">View Project →</span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
              {projs.slice(1, 3).map((proj) => (
                <FadeUp key={proj._id}>
                  <Link to={`/projects/${proj.slug}`} className="group block bg-white border border-slate-200 p-8 hover:border-navy-950/20 transition-all min-h-[200px] flex flex-col justify-end">
                    <h3 className="text-xl font-semibold text-navy-950 group-hover:text-navy-950/70 transition-colors mb-2">{proj.title}</h3>
                    {proj.description && <p className="text-sm text-slate-500">{truncate(proj.description, 120)}</p>}
                    <div className="mt-4 flex items-center gap-4">
                      {proj.status && <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1">{proj.status}</span>}
                      <span className="text-navy-950/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity">View Project →</span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CONTACT ═══════ */}
      <section className="py-20 lg:py-28 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeUp>
              <div>
                <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 mb-4">Get In Touch</p>
                <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-3xl lg:text-5xl mb-6">
                  Let's work<br />together.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-md">
                  Whether you have a project in mind, need evaluation support, or want to explore a collaboration — I'd love to hear from you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors">
                    Send a Message
                  </Link>
                  <Link to="/appointments" className="inline-flex items-center px-8 py-4 border border-slate-300 text-navy-950 font-semibold text-sm tracking-wide hover:border-navy-950/20 hover:text-navy-950/70 transition-colors">
                    Book a Call
                  </Link>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Pie NEMEYAMAHORO with collaborators"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-navy-950/20" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════ CREDENTIALS ═══════ */}
      <section className="py-20 lg:py-28 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeUp>
              <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-white/50">Why Work With Me</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-3xl lg:text-5xl mb-4">Built on Research, Driven by Impact</h2>
            </FadeUp>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-800 max-w-5xl mx-auto">
            {[
              { title: 'Academic Rigor', desc: 'Every recommendation is grounded in peer-reviewed research, validated methodologies, and evidence-based frameworks.' },
              { title: 'Practical Delivery', desc: 'Research that does not stay on the shelf. I work alongside your team to implement, measure, and report tangible outcomes.' },
              { title: 'Global Perspective', desc: 'Experience across 15+ countries, working with universities, NGOs, UN agencies, and public institutions worldwide.' },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="bg-navy-950 p-8 lg:p-10 text-center">
                  <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-navy-300">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 lg:py-28 bg-navy-950 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <FadeUp>
            <h2 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-white leading-[1.05] tracking-tight text-3xl lg:text-5xl mb-6">
              Let's turn evidence<br />into meaningful action.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Let's discuss how research, evaluation and strategic design can support your next initiative.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact?type=project" className="inline-flex items-center px-8 py-4 bg-white text-navy-950 font-semibold text-sm tracking-wide hover:bg-ivory-100 transition-colors">
                Start a Conversation
              </Link>
              <Link to="/appointments" className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition-colors">
                Book an Appointment
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

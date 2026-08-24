import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchModal from '../common/SearchModal';
import profileImage from '../../upload/image.jpeg';

function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-navy-950/10 group-hover:ring-navy-950/30 transition-all duration-300">
        <img src={profileImage} alt="Pie NEMEYAMAHORO" className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-[13px] font-bold tracking-[0.15em] text-navy-950 uppercase">Pie NEMEYAMAHORO</span>
        <span className="text-[9px] font-medium tracking-[0.2em] text-slate-400 mt-0.5 uppercase">Social Impact · Research · Consulting</span>
      </div>
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { currentLanguage, availableLanguages, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const currentLang = availableLanguages.find((l) => l.code === currentLanguage);

  const NAV_LINKS = [
    { to: '/about', label: 'About' },
    { to: '/expertise', label: 'Expertise' },
    { to: '/research', label: 'Research' },
    { to: '/projects', label: 'Projects' },
    { to: '/publications', label: 'Publications' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          <BrandLogo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-navy-950'
                      : scrolled ? 'text-slate-500 hover:text-navy-950' : 'text-slate-600 hover:text-navy-950'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-navy-950" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-lg ${
                scrolled ? 'text-slate-400 hover:text-navy-950 hover:bg-slate-100' : 'text-slate-500 hover:text-navy-950 hover:bg-black/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>

            <div className="relative hidden lg:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-lg ${
                  scrolled ? 'text-slate-400 hover:text-navy-950 hover:bg-slate-100' : 'text-slate-500 hover:text-navy-950 hover:bg-black/5'
                }`}
              >
                {currentLang?.code?.toUpperCase() || 'EN'}
                <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white border border-slate-200/80 shadow-xl py-1 z-50 rounded-lg overflow-hidden"
                  onMouseLeave={() => setLangOpen(false)}
                >
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? 'text-navy-950 font-medium bg-slate-50'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-navy-950'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block w-px h-5 bg-slate-200 mx-1" />

            <Link
              to="/admin/login"
              className={`hidden lg:inline-flex items-center px-3 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-lg ${
                scrolled ? 'text-slate-400 hover:text-navy-950 hover:bg-slate-100' : 'text-slate-500 hover:text-navy-950 hover:bg-black/5'
              }`}
            >
              Login
            </Link>

            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-navy-950 text-white text-[13px] font-semibold tracking-wide hover:bg-navy-800 transition-all duration-300 rounded-lg"
            >
              Let's Talk
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-navy-950 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
              <span className={`block w-5 h-px bg-navy-950 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
              <span className={`block w-5 h-px bg-navy-950 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobile}
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <Link to="/" onClick={closeMobile} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img src={profileImage} alt="Pie NEMEYAMAHORO" className="w-full h-full object-cover" />
                </div>
                <span className="text-[12px] font-bold tracking-[0.15em] text-navy-950 uppercase">Menu</span>
              </Link>
              <button
                onClick={closeMobile}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <div className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block py-3 text-lg font-medium transition-all duration-200 border-b border-slate-100 ${
                        isActive
                          ? 'text-navy-950 font-semibold'
                          : 'text-slate-500 hover:text-navy-950 hover:pl-2'
                      }`
                    }
                    style={{
                      transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms',
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? 'translateX(0)' : 'translateX(20px)',
                    }}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); closeMobile(); }}
                    className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors px-3 py-1.5 rounded ${
                      currentLanguage === lang.code
                        ? 'text-navy-950 bg-slate-100'
                        : 'text-slate-400 hover:text-navy-950 hover:bg-slate-50'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  to="/contact"
                  onClick={closeMobile}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-navy-950 text-white text-sm font-semibold tracking-wide hover:bg-navy-800 transition-colors rounded-lg"
                >
                  Let's Talk
                </Link>
                <Link
                  to="/admin/login"
                  onClick={closeMobile}
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-navy-950 text-sm font-semibold tracking-wide hover:bg-slate-50 transition-colors rounded-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 lg:h-20" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

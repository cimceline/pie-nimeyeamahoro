import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import useApi from '../../hooks/useApi';

const SECTIONS = [
  {
    category: 'Academic & Research',
    items: [
      { key: 'publications', label: 'Publications', path: '/admin/publications' },
      { key: 'research', label: 'Research Projects', path: '/admin/research-projects' },
      { key: 'projects', label: 'Projects', path: '/admin/projects' },
      { key: 'education', label: 'Education', path: '/admin/education' },
    ],
  },
  {
    category: 'Content & Writing',
    items: [
      { key: 'books', label: 'Books', path: '/admin/books' },
      { key: 'resources', label: 'Resources', path: '/admin/resources' },
    ],
  },
  {
    category: 'Professional',
    items: [
      { key: 'services', label: 'Services', path: '/admin/services' },
      { key: 'skills', label: 'Skills', path: '/admin/skills' },
      { key: 'experience', label: 'Experience', path: '/admin/experience' },
      { key: 'expertise', label: 'Expertise', path: '/admin/expertise' },
      { key: 'appointments', label: 'Appointments', path: '/admin/appointments' },
    ],
  },
];

const STATUS_COLORS = {
  high: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-gray-100 text-gray-500',
};

function getPopLevel(count) {
  if (count >= 10) return 'high';
  if (count >= 3) return 'medium';
  return 'low';
}

export default function Dashboard() {
  const { data: response, loading } = useApi('/analytics/stats');
  const s = response?.data || response || {};

  const totalContent = Object.values(s).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);

  return (
    <>
      <SEO title="Admin Dashboard" />

      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Platform content at a glance.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-gray-900">{loading ? '—' : totalContent}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Items</p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => {
          const sectionTotal = section.items.reduce((sum, item) => sum + (s[item.key] || 0), 0);
          return (
            <div key={section.category}>
              <div className="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{section.category}</h2>
                <span className="text-xs text-gray-400">{sectionTotal}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {section.items.map((item) => {
                  const count = s[item.key] || 0;
                  const level = getPopLevel(count);
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className="group block bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mt-2 tabular-nums">{count}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[level]}`}>
                          {level === 'high' ? 'Active' : level === 'medium' ? 'Growing' : 'New'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';

export default function ProfessionalAuthority({ className = '' }) {
  const { data: profileData } = useApi('/profile/public');
  const { data: pubsData } = useApi('/publications?limit=6&sort=-publicationDate');
  const { data: projectsData } = useApi('/projects?limit=6&sort=-createdAt');
  const { data: expertiseData } = useApi('/expertise?limit=8&sort=-order');

  const p = profileData?.profile || profileData || {};
  const pubs = pubsData?.publications || pubsData?.data || [];
  const projects = projectsData?.projects || projectsData?.data || [];
  const expertise = expertiseData?.expertise || expertiseData?.data || [];

  const stats = [
    { value: p.highestDegree || 'PhD', label: 'Highest Degree' },
    { value: `${pubs.length || 0}+`, label: 'Publications' },
    { value: `${projects.length || 0}+`, label: 'Projects' },
    { value: expertise.length || 0, label: 'Areas of Expertise' },
  ];

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Professional Authority</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Trust This Professional?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => {
            return (
              <div key={i} className="bg-white p-6 rounded-xl border text-center">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {expertise.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Areas of Specialization</h3>
            <div className="flex flex-wrap gap-2">
              {expertise.map((e) => (
                <span key={e._id} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                  {e.title || e.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {pubs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-gray-900">Selected Publications</h3>
              <Link to="/publications" className="text-primary-700 hover:text-primary-800 text-sm font-medium flex items-center gap-1">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pubs.slice(0, 3).map((pub) => (
                <Link key={pub._id} to={`/publications/${pub.slug}`} className="p-4 bg-white rounded-xl border hover:border-primary-200 hover:shadow-md transition-all group">
                  <p className="text-xs text-primary-600 font-medium mb-1">{pub.publicationType || pub.type || 'Publication'}</p>
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors text-sm mb-1 line-clamp-2">{pub.title}</h4>
                  {pub.journal && <p className="text-xs text-gray-400">{pub.journal}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-gray-900">Featured Projects</h3>
              <Link to="/projects" className="text-primary-700 hover:text-primary-800 text-sm font-medium flex items-center gap-1">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((proj) => (
                <Link key={proj._id} to={`/projects/${proj.slug}`} className="p-4 bg-white rounded-xl border hover:border-primary-200 hover:shadow-md transition-all group">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors text-sm mb-1">{proj.title}</h4>
                  {proj.description && <p className="text-xs text-gray-500 line-clamp-2">{proj.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

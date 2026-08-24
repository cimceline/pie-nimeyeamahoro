import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/profile', label: 'Profile' },
    ],
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/education', label: 'Education' },
      { path: '/admin/skills', label: 'Skills' },
      { path: '/admin/experience', label: 'Experience' },
      { path: '/admin/expertise', label: 'Expertise' },
      { path: '/admin/academic-titles', label: 'Academic Titles' },
    ],
  },
  {
    label: 'Publications & Research',
    items: [
      { path: '/admin/publications', label: 'Publications' },
      { path: '/admin/research-projects', label: 'Research' },
      { path: '/admin/projects', label: 'Projects' },
    ],
  },
  {
    label: 'Services',
    items: [
      { path: '/admin/services', label: 'Services' },
      { path: '/admin/service-requests', label: 'Service Requests' },
      { path: '/admin/appointments', label: 'Appointments' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { path: '/admin/books', label: 'Books' },
      { path: '/admin/comments', label: 'Comments' },
      { path: '/admin/newsletter', label: 'Newsletter' },
      { path: '/admin/contact', label: 'Contact' },
    ],
  },
  {
    label: 'Management',
    items: [
      { path: '/admin/resources', label: 'Resources' },
      { path: '/admin/media', label: 'Media' },
      { path: '/admin/users', label: 'Users', roles: ['admin'] },
      { path: '/admin/users-management', label: 'User Management', roles: ['admin'] },
      { path: '/admin/faqs', label: 'FAQs' },
      { path: '/admin/testimonials', label: 'Testimonials' },
      { path: '/admin/announcements', label: 'Announcements' },
    ],
  },
  {
    label: 'Workflow',
    items: [
      { path: '/admin/content-versions', label: 'Content Versions' },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/admin/translations', label: 'Translations' },
      { path: '/admin/settings', label: 'Settings', roles: ['admin'] },
      { path: '/admin/audit-logs', label: 'Audit Logs', roles: ['admin'] },
      { path: '/admin/system-health', label: 'System Health', roles: ['admin'] },
    ],
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleSection = (label) => {
    setCollapsedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || hasRole(item.roles)),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-gray-900 text-gray-300 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-5 border-b border-gray-800">
          <Link to="/admin/dashboard" className="text-sm font-bold text-white tracking-wide uppercase">
            Panel
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white text-lg leading-none">
            &times;
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100vh-3.5rem)] py-4 px-3">
          {filteredSections.map((section) => (
            <div key={section.label} className="mb-5">
              <button
                onClick={() => toggleSection(section.label)}
                className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]"
              >
                {section.label}
                <span className="text-[10px]">{collapsedSections[section.label] ? '+' : '−'}</span>
              </button>
              {!collapsedSections[section.label] && (
                <div className="mt-1 space-y-px">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 text-[13px] rounded transition-colors ${
                          isActive
                            ? 'bg-gray-800 text-white font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            &#9776;
          </button>

          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(user?.name || user?.email || 'U')}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[11px] text-gray-400 capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary-700 transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={item.path || item.label || index}>
          <span className="text-gray-400">/</span>
          {item.path ? (
            <Link to={item.path} className="hover:text-primary-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

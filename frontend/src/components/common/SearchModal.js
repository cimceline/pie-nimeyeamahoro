import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchAPI } from '../../api/endpoints';
import { DEBOUNCE_DELAY } from '../../utils/constants';
import { truncate } from '../../utils/formatters';

const TYPE_ROUTES = {
  publication: 'publications',
  research_project: 'research',
  project: 'projects',
  article: 'articles',
  resource: 'resources',
  service: 'services',
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({});
      setSelectedType(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchAPI.search({ q: searchQuery, limit: 50 });
      setResults(data.results || data);
    } catch {
      setResults({});
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), DEBOUNCE_DELAY);
  };

  const groupedResults = {};
  Object.entries(results).forEach(([type, items]) => {
    if (Array.isArray(items) && items.length > 0) {
      groupedResults[type] = items;
    }
  });

  const totalResults = Object.values(groupedResults).reduce((sum, arr) => sum + arr.length, 0);

  const filteredTypes = selectedType
    ? { [selectedType]: groupedResults[selectedType] }
    : groupedResults;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search publications, projects, articles..."
            className="flex-1 text-lg outline-none"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <span className="text-gray-500">×</span>
          </button>
        </div>

        {query && (
          <div className="px-4 py-2 border-b flex items-center gap-2 text-sm">
            <span className="text-gray-500">
              {loading ? 'Searching...' : `${totalResults} result${totalResults !== 1 ? 's' : ''}`}
            </span>
            <div className="flex-1" />
            {Object.keys(groupedResults).length > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-2 py-0.5 rounded text-xs ${
                    !selectedType ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {Object.keys(groupedResults).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2 py-0.5 rounded text-xs capitalize ${
                      selectedType === type ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {!query && (
            <div className="px-4 py-12 text-center text-gray-400">
              <p>Type to search across all content</p>
            </div>
          )}

          {query && !loading && totalResults === 0 && (
            <div className="px-4 py-12 text-center text-gray-400">
              <p>No results found for "{query}"</p>
            </div>
          )}

          {Object.entries(filteredTypes).map(([type, items]) => {
            return (
              <div key={type} className="border-b last:border-0">
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide capitalize">
                    {type}s ({items.length})
                  </span>
                </div>
                {items.map((item) => (
                  <Link
                    key={item._id || item.slug}
                    to={`/${TYPE_ROUTES[type] || type + 's'}/${item.slug || item._id}`}
                    onClick={onClose}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-0"
                  >
                    <h4 className="font-medium text-gray-900">{item.title || item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-0.5">{truncate(item.description, 100)}</p>
                    )}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

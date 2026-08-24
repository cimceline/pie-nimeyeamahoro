import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { searchAPI } from '../../api/endpoints';
import { DEBOUNCE_DELAY } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const debounceRef = React.useRef(null);

  const performSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults({}); return; }
    setLoading(true);
    try {
      const { data } = await searchAPI.search({ q, limit: 50 });
      setResults(data.results || data);
    } catch { setResults({}); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); performSearch(q); }
  }, [searchParams, performSearch]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams(val ? { q: val } : {});
      performSearch(val);
    }, DEBOUNCE_DELAY);
  };

  const allResults = Object.entries(results).flatMap(([type, items]) =>
    (Array.isArray(items) ? items : []).map((item) => ({ ...item, _type: type }))
  );

  return (
    <>
      <SEO title="Search" description="Search across all content." />
      <section className="py-16 lg:py-24 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <h1 className="font-display text-4xl font-bold mb-4">Search</h1>
          <div className="max-w-xl relative">
            <input type="text" value={query} onChange={handleInputChange} placeholder="Search..." className="w-full pl-4 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Search' }]} />
          {loading && <LoadingSpinner className="py-12" />}
          {!loading && query && allResults.length === 0 && (
            <p className="text-gray-500 text-center py-12">No results found for "{query}"</p>
          )}
          {!loading && allResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">{allResults.length} result(s) found</p>
              {allResults.map((item, i) => (
                <div key={item._id || i} className="card">
                  <span className="text-xs font-medium text-primary-600 capitalize">{item._type}</span>
                  <h3 className="font-semibold text-gray-900 mt-1">{item.title || item.name}</h3>
                  {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

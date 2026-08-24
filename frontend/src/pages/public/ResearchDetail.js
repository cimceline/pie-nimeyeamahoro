import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { formatDate } from '../../utils/formatters';

export default function ResearchDetail() {
  const { slug } = useParams();
  const { data, loading, error, execute } = useApi(`/research-projects/${slug}`);
  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;
  const item = data?.researchProject || data?.project || data || {};
  return (
    <>
      <SEO title={item.title} description={item.description || item.title} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Research', path: '/research' }, { label: item.title }]} />
          <Link to="/research" className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 mb-6"> Back</Link>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{item.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            {item.startDate && <span className="flex items-center gap-1">{formatDate(item.startDate)}{item.endDate ? ` - ${formatDate(item.endDate)}` : ''}</span>}
            {item.status && <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">{item.status}</span>}
          </div>
          {item.description && <p className="text-gray-600 mb-6">{item.description}</p>}
          {item.content && <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />}
          {item._id && <CommentSection entityType="project" entityId={item._id} />}
        </div>
      </section>
    </>
  );
}

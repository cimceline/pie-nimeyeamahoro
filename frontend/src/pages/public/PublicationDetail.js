import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { formatDate } from '../../utils/formatters';

export default function PublicationDetail() {
  const { slug } = useParams();
  const { data, loading, error, execute } = useApi(`/publications/${slug}`);

  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;

  const pub = data?.publication || data || {};

  return (
    <>
      <SEO title={pub.title} description={pub.abstract || pub.title} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Publications', path: '/publications' }, { label: pub.title }]} />
          <Link to="/publications" className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 mb-6">
            Back to Publications
          </Link>
          <article>
            {(pub.type || pub.publicationType) && (
              <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
                {pub.type || pub.publicationType}
              </span>
            )}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{pub.title}</h1>
            {pub.authors && <p className="text-lg text-gray-600 mb-4">{pub.authors}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
              {pub.publishedAt && (
                <span className="flex items-center gap-1">{formatDate(pub.publishedAt)}</span>
              )}
              {pub.journal && <span>{pub.journal}</span>}
            </div>
            {pub.doi && (
              <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-700 hover:underline mb-6">
                DOI: {pub.doi}
              </a>
            )}
            {pub.abstract && (
              <div className="prose prose-lg max-w-none mb-8">
                <h2 className="text-xl font-bold">Abstract</h2>
                <p>{pub.abstract}</p>
              </div>
            )}
            {pub.content && (
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: pub.content }} />
            )}
            {pub.keywords && pub.keywords.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {pub.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
          {pub._id && <CommentSection entityType="publication" entityId={pub._id} />}
        </div>
      </section>
    </>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { resourceAPI } from '../../api/endpoints';

export default function ResourceDetail() {
  const { slug } = useParams();
  const { data, loading, error, execute } = useApi(`/resources/${slug}`);

  const handleDownload = async () => {
    try {
      const item = data?.resource || data || {};
      const response = await resourceAPI.download(item._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.fileName || item.title || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;
  const item = data?.resource || data || {};
  return (
    <>
      <SEO title={item.title} description={item.description || item.title} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Resources', path: '/resources' }, { label: item.title }]} />
          <Link to="/resources" className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 mb-6"> Back</Link>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{item.title}</h1>
          {item.description && <p className="text-gray-600 mb-6">{item.description}</p>}
          {item.content && <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: item.content }} />}
          {(item.fileUrl || item._id) && (
            <button onClick={handleDownload} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">
              Download
            </button>
          )}
          {item._id && <CommentSection entityType="resource" entityId={item._id} />}
        </div>
      </section>
    </>
  );
}

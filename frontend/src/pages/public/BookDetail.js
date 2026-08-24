import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CommentSection from '../../components/common/CommentSection';
import useApi from '../../hooks/useApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { bookAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

export default function BookDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { data, loading, error, execute } = useApi(`/books/${slug}`);

  const handleDownload = async (book) => {
    if (!book.filePath) return;
    try {
      await bookAPI.incrementDownload(book._id);
      const link = document.createElement('a');
      link.href = book.filePath;
      link.download = book.fileName || book.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (error) return <ErrorMessage message={error} onRetry={execute} className="py-32" />;

  const book = data?.book || data?.data || data || {};

  return (
    <>
      <SEO title={book.title} description={book.description || book.title} />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl">
          <Breadcrumbs items={[{ label: t('nav.books', 'Books'), path: '/books' }, { label: book.title }]} />
          <Link to="/books" className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 mb-6">
            {t('books.backToBooks', 'Back to Books')}
          </Link>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full md:w-64 h-80 object-cover rounded-xl shadow-lg flex-shrink-0" />
            ) : (
              <div className="w-full md:w-64 h-80 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center rounded-xl flex-shrink-0">
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-primary-600 font-medium mb-2 uppercase">{book.category?.replace('_', ' ')}</p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">{book.author}</span>
                {book.publishedAt && <span className="flex items-center gap-1">{formatDate(book.publishedAt)}</span>}
              </div>
              {book.authorBio && <p className="text-sm text-gray-500 mb-4 italic">{book.authorBio}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">{book.viewCount || 0} {t('books.views', 'views')}</span>
                <span className="flex items-center gap-1">{book.downloadCount || 0} {t('books.downloads', 'downloads')}</span>
                {book.pageCount && <span>{book.pageCount} {t('books.pages', 'pages')}</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {book.filePath && (
                  <button onClick={() => handleDownload(book)} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">
                    {t('books.download', 'Download PDF')}
                  </button>
                )}
              </div>
              {book.isbn && <p className="text-xs text-gray-400 mt-3">{t('books.isbn', 'ISBN')}: {book.isbn}</p>}
              {book.publisher && <p className="text-xs text-gray-400">{t('books.publisher', 'Publisher')}: {book.publisher}</p>}
              {book.edition && <p className="text-xs text-gray-400">{t('books.edition', 'Edition')}: {book.edition}</p>}
            </div>
          </div>

          {book.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t('books.about', 'About this book')}</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          {book.content && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t('books.content', 'Content')}</h2>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: book.content }} />
            </div>
          )}

          {book.tags && book.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">{t('books.tags', 'Tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {book._id && <CommentSection entityType="book" entityId={book._id} />}
        </div>
      </section>
    </>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { commentAPI } from '../../api/endpoints';
import { useLanguage } from '../../contexts/LanguageContext';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

function CommentItem({ item, onReport }) {
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport(item._id, reportReason);
      setShowReport(false);
      setReportReason('');
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium">{item.authorName?.charAt(0) || 'U'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">{item.authorName}</span>
            <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
          {!showReport ? (
            <button
              onClick={() => setShowReport(true)}
              className="mt-2 text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
            >
              Report
            </button>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting..."
                className="text-xs border rounded px-2 py-1 flex-1"
              />
              <button onClick={handleReport} className="text-xs text-red-600 hover:underline">Submit</button>
              <button onClick={() => setShowReport(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ entityType, entityId }) {
  const { t } = useLanguage();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadComments = useCallback(async () => {
    try {
      const { data } = await commentAPI.getByEntity(entityType, entityId);
      setComments(data.data || data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await commentAPI.create({
        content: formData.content,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail || undefined,
        entityType,
        entityId,
      });
      toast.success(t('comments.success', 'Comment submitted for moderation!'));
      reset();
      loadComments();
    } catch (err) {
      toast.error(err.response?.data?.message || t('comments.error', 'Failed to submit comment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (commentId, reason) => {
    try {
      await commentAPI.report(commentId, { reason });
      toast.success(t('comments.reportSuccess', 'Comment reported'));
    } catch {
      toast.error(t('comments.reportError', 'Failed to report'));
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {t('comments.title', 'Comments')} ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{t('comments.leaveComment', 'Leave a Comment')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('comments.name', 'Name')} *</label>
            <input
              {...register('authorName', { required: true })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder={t('comments.namePlaceholder', 'Your name')}
            />
            {errors.authorName && <p className="text-red-500 text-xs mt-1">{t('common.required', 'Required')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('comments.email', 'Email')}</label>
            <input
              {...register('authorEmail')}
              type="email"
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder={t('comments.emailPlaceholder', 'Your email (not published)')}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('comments.comment', 'Comment')} *</label>
          <textarea
            {...register('content', { required: true })}
            rows={4}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder={t('comments.placeholder', 'Write your comment here...')}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1">{t('common.required', 'Required')}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">
            {submitting ? t('common.loading', 'Loading...') : t('comments.submit', 'Submit Comment')}
          </button>
          <p className="text-xs text-gray-400">{t('comments.moderation', 'Comments are moderated before appearing.')}</p>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">{t('comments.noComments', 'No comments yet. Be the first to comment!')}</p>
      ) : (
        <div className="space-y-0">
          {comments.map((item) => (
            <CommentItem key={item._id} item={item} onReport={handleReport} />
          ))}
        </div>
      )}
    </div>
  );
}

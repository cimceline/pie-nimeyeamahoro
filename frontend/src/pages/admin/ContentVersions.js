import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { contentVersionAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-500',
};

export default function ContentVersions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ resourceType: '', status: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.resourceType) params.resourceType = filter.resourceType;
      if (filter.status) params.status = filter.status;
      const { data } = await contentVersionAPI.getPendingReview(params);
      setItems(data.data || data.versions || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    try {
      await contentVersionAPI.updateStatus(id, { status });
      toast.success(`Version ${status}`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const restore = async (id) => {
    try {
      await contentVersionAPI.restore(id);
      toast.success('Version restored');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <>
      <SEO title="Content Versions" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Content Versions</h1>
        <p className="text-gray-500">Review and manage content version history.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <select onChange={(e) => setFilter(f => ({ ...f, resourceType: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Types</option>
          <option value="profile">Profile</option><option value="education">Education</option>
          <option value="experience">Experience</option><option value="publication">Publication</option>
          <option value="service">Service</option><option value="article">Article</option>
          <option value="project">Project</option><option value="resource">Resource</option>
        </select>
        <select onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option><option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option><option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No versions found.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.resourceType} v{item.versionNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                      by {item.changedBy?.name || 'Unknown'} | {formatDateTime(item.createdAt)}
                    </p>
                    {item.changeSummary && <p className="text-xs text-gray-400 mt-1">{item.changeSummary}</p>}
                    {item.reviewComment && <p className="text-xs text-orange-500 mt-1">Review: {item.reviewComment}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'pending_review' && (
                    <>
                      <button onClick={() => updateStatus(item._id, 'approved')} className="p-2 hover:bg-green-50 rounded-lg text-green-500" title="Approve">
                        Approve</button>
                      <button onClick={() => updateStatus(item._id, 'draft')} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Reject">
                        Reject</button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button onClick={() => updateStatus(item._id, 'published')} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100">
                      Publish</button>
                  )}
                  <button onClick={() => restore(item._id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Restore">
                    Restore</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

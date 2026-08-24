import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { commentAPI } from '../../api/endpoints';
import { formatDateTime, truncate } from '../../utils/formatters';

export default function CommentsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await commentAPI.getAll(); setItems(data.comments || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await commentAPI.updateStatus(id, { status }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    try { await commentAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Comments" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Comments</h1>
        <p className="text-gray-500">Moderate user comments.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No comments.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.author || item.name || 'Anonymous'}</span>
                  <StatusBadge status={item.status || 'pending'} />
                </div>
                <span className="text-xs text-gray-400">{formatDateTime(item.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{truncate(item.content || item.message, 200)}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => updateStatus(item._id, 'approved')} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100">
                  Approve</button>
                <button onClick={() => updateStatus(item._id, 'rejected')} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100">
                  Reject</button>
                <button onClick={() => setDeleteId(item._id)} className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100">
                  Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Comment" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

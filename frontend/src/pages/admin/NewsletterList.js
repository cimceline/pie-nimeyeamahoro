import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { newsletterAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

export default function NewsletterList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await newsletterAPI.getAll(); setItems(data.subscribers || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try { await newsletterAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Newsletter Subscribers" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Newsletter</h1>
        <p className="text-gray-500">Manage newsletter subscribers.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Subscribed</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No subscribers.</td></tr>}
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${item.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active !== false ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setDeleteId(item._id)} className="p-1 hover:bg-red-50 rounded text-red-500">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Subscriber" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

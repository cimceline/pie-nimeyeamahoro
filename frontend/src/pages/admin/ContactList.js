import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { contactAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

export default function ContactList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await contactAPI.getAll(); setItems(data.messages || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await contactAPI.updateStatus(id, { status }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <>
      <SEO title="Contact Messages" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Contact</h1>
        <p className="text-gray-500">Manage contact form submissions.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No messages.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name} - {item.subject}</h3>
                  <p className="text-sm text-gray-500">{item.email} | {formatDateTime(item.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status || 'unread'} />
                <select value={item.status || 'unread'} onChange={(e) => updateStatus(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1">
                  <option value="unread">Unread</option><option value="read">Read</option>
                  <option value="replied">Replied</option><option value="archived">Archived</option>
                </select>
                <button onClick={() => setViewItem(item)} className="p-2 hover:bg-gray-100 rounded-lg">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Message Details">
        {viewItem && (
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{viewItem.name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{viewItem.email}</p></div>
            <div><p className="text-sm text-gray-500">Subject</p><p className="font-medium">{viewItem.subject}</p></div>
            <div><p className="text-sm text-gray-500">Message</p>
              <p className="font-medium whitespace-pre-wrap">{viewItem.message}</p></div>
          </div>
        )}
      </Modal>
    </>
  );
}

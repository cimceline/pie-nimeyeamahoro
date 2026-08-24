import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { serviceRequestAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

export default function ServiceRequestsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await serviceRequestAPI.getAll(); setItems(data.requests || data.data || []); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await serviceRequestAPI.updateStatus(id, { status }); toast.success('Status updated'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <>
      <SEO title="Service Requests" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Service Requests</h1><p className="text-gray-500">View and manage service requests.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No requests.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name || item.subject}</h3>
                  <p className="text-sm text-gray-500">{item.email} | {formatDateTime(item.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status || 'new'} />
                <select
                  value={item.status || 'new'}
                  onChange={(e) => updateStatus(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={() => setViewItem(item)} className="p-2 hover:bg-gray-100 rounded-lg">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Request Details">
        {viewItem && (
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{viewItem.name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{viewItem.email}</p></div>
            <div><p className="text-sm text-gray-500">Service</p><p className="font-medium">{viewItem.service || viewItem.subject}</p></div>
            <div><p className="text-sm text-gray-500">Message</p><p className="font-medium whitespace-pre-wrap">{viewItem.message}</p></div>
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{formatDateTime(viewItem.createdAt)}</p></div>
          </div>
        )}
      </Modal>
    </>
  );
}

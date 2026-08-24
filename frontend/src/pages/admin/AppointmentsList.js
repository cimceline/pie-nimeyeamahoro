import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentAPI } from '../../api/endpoints';
import { formatDateTime, formatDate } from '../../utils/formatters';

export default function AppointmentsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await appointmentAPI.getAll(); setItems(data.appointments || data.data || []); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await appointmentAPI.updateStatus(id, { status }); toast.success('Status updated'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <>
      <SEO title="Appointments" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Appointments</h1><p className="text-gray-500">View and manage appointment requests.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No appointments.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.email} | {item.preferredDate ? formatDate(item.preferredDate) : 'No date set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status || 'pending'} />
                <select
                  value={item.status || 'pending'}
                  onChange={(e) => updateStatus(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => setViewItem(item)} className="p-2 hover:bg-gray-100 rounded-lg">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Appointment Details">
        {viewItem && (
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{viewItem.name}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{viewItem.email}</p></div>
            {viewItem.phone && <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{viewItem.phone}</p></div>}
            <div><p className="text-sm text-gray-500">Preferred Date</p><p className="font-medium">{viewItem.preferredDate ? formatDate(viewItem.preferredDate) : 'Not specified'}</p></div>
            {viewItem.service && <div><p className="text-sm text-gray-500">Service</p><p className="font-medium">{viewItem.service?.title || viewItem.service}</p></div>}
            {viewItem.notes && <div><p className="text-sm text-gray-500">Notes</p><p className="font-medium whitespace-pre-wrap">{viewItem.notes}</p></div>}
            <div><p className="text-sm text-gray-500">Submitted</p><p className="font-medium">{formatDateTime(viewItem.createdAt)}</p></div>
          </div>
        )}
      </Modal>
    </>
  );
}

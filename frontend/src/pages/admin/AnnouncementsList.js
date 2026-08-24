import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { announcementAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-500',
};

export default function AnnouncementsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await announcementAPI.getAll(); setItems(data.data || data.announcements || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditItem(null);
    reset({ title: '', message: '', type: 'information', priority: 'medium', startDate: '', endDate: '', displayOn: ['homepage'], status: 'draft', ctaText: '', ctaLink: '' });
    setModalOpen(true);
  };
  const openEdit = (item) => { setEditItem(item); reset(item); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editItem) { await announcementAPI.update(editItem._id, data); toast.success('Updated'); }
      else { await announcementAPI.create(data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await announcementAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Announcements" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Announcements</h1><p className="text-gray-500">Manage public announcements and banners.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No announcements.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                    {item.type} | {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex gap-3">
                    <span>{item.viewCount || 0} views</span>
                    <span>{item.clickCount || 0} clicks</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">Edit</button>
                <button onClick={() => setDeleteId(item._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Announcement' : 'Add Announcement'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><input {...register('title', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Message</label><textarea {...register('message', { required: true })} rows={4} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Type</label><select {...register('type')} className="w-full px-3 py-2 border rounded-lg">
              <option value="information">Information</option><option value="academic">Academic</option><option value="research">Research</option>
              <option value="service">Service</option><option value="important">Important</option>
            </select></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label><select {...register('priority')} className="w-full px-3 py-2 border rounded-lg">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Start Date</label><input {...register('startDate', { required: true })} type="datetime-local" className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">End Date</label><input {...register('endDate', { required: true })} type="datetime-local" className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Status</label><select {...register('status')} className="w-full px-3 py-2 border rounded-lg">
            <option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="active">Active</option><option value="archived">Archived</option>
          </select></div>
          <div><label className="block text-sm font-medium mb-1">CTA Text</label><input {...register('ctaText')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">CTA Link</label><input {...register('ctaLink')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Announcement" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

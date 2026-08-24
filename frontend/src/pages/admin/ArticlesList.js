import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { articleAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

export default function ArticlesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await articleAPI.getAll(); setItems(data.articles || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditItem(null);
    reset({ title: '', excerpt: '', category: 'education', body: '', status: 'draft', isFeatured: false });
    setModalOpen(true);
  };
  const openEdit = (item) => { setEditItem(item); reset(item); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editItem) { await articleAPI.update(editItem._id, data); toast.success('Updated'); }
      else { await articleAPI.create(data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await articleAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Articles" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Articles</h1>
        <p className="text-gray-500">Manage articles and blog posts.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No articles.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                   <p className="text-sm text-gray-500">{item.status} {item.createdAt && formatDate(item.createdAt)}</p>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Article' : 'Add Article'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label>
            <select {...register('category')} className="w-full px-3 py-2 border rounded-lg">
              <option value="research">Research</option><option value="education">Education</option>
              <option value="policy">Policy</option><option value="consulting">Consulting</option>
              <option value="methodology">Methodology</option><option value="opinion">Opinion</option>
              <option value="news">News</option><option value="tutorial">Tutorial</option>
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 border rounded-lg">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Scheduled Publish Date</label>
              <input {...register('scheduledPublishDate')} type="date" className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea {...register('excerpt')} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Body</label>
            <textarea {...register('body')} rows={6} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex items-center gap-2"><input {...register('isFeatured')} type="checkbox" className="rounded" /><label className="text-sm">Featured</label></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} title="Delete Article" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

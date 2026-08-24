import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { bookAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

const CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'research', label: 'Research' },
  { value: 'education', label: 'Education' },
  { value: 'social_science', label: 'Social Science' },
  { value: 'policy', label: 'Policy' },
  { value: 'guide', label: 'Guide' },
  { value: 'report', label: 'Report' },
  { value: 'other', label: 'Other' },
];

export default function BooksList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm();
  const statusFilter = watch('statusFilter');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await bookAPI.getAll(params);
      setItems(data.data || data.books || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditItem(null);
    reset({ title: '', description: '', content: '', author: '', category: 'other', tags: '', language: 'en', isbn: '', publisher: '', edition: '', pageCount: '', status: 'draft', isFeatured: false, visibility: 'public', coverImage: '', authorBio: '' });
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    reset({ ...item, tags: item.tags?.join(', ') || '' });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      const payload = { ...formData, tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (editItem) { await bookAPI.update(editItem._id, payload); toast.success('Updated'); }
      else { await bookAPI.create(payload); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await bookAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Books" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Books & Documents</h1>
          <p className="text-gray-500">Publish books and documents for clients to read.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add Book</button>
      </div>

      <div className="mb-4">
        <select value={statusFilter || ''} onChange={(e) => {}} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No books yet.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.author} &middot; {item.category} &middot; {formatDate(item.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">Views: {item.viewCount || 0}</span>
                <span className="flex items-center gap-1">Downloads: {item.downloadCount || 0}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">Edit</button>
                <button onClick={() => setDeleteId(item._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Book' : 'Add Book'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea {...register('description', { required: true })} rows={3} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content (HTML)</label>
            <textarea {...register('content')} rows={6} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder="Full book content in HTML..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author *</label>
              <input {...register('author', { required: true })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select {...register('category')} className="w-full px-3 py-2 border rounded-lg">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select {...register('language')} className="w-full px-3 py-2 border rounded-lg">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="la">Latin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 border rounded-lg">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input {...register('tags')} className="w-full px-3 py-2 border rounded-lg" placeholder="tag1, tag2, tag3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ISBN</label>
              <input {...register('isbn')} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publisher</label>
              <input {...register('publisher')} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Edition</label>
              <input {...register('edition')} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Page Count</label>
              <input type="number" {...register('pageCount')} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <input {...register('coverImage')} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author Bio</label>
            <textarea {...register('authorBio')} rows={2} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('isFeatured')} className="rounded" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              Visibility:
              <select {...register('visibility')} className="px-2 py-1 border rounded text-sm">
                <option value="public">Public</option>
                <option value="registered">Registered</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Book" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

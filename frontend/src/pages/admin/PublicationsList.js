import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { publicationAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

export default function PublicationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await publicationAPI.getAll(); setItems(data.publications || data.data || []); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); reset({ title: '', publicationType: 'journal_article', authors: '', journal: '', abstract: '', doi: '', publicationDate: '', status: 'published' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); reset({ ...item, authors: Array.isArray(item.authors) ? item.authors.join(', ') : item.authors || '' }); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, authors: data.authors ? data.authors.split(',').map(a => a.trim()).filter(Boolean) : [] };
      if (editItem) { await publicationAPI.update(editItem._id, payload); toast.success('Updated'); }
      else { await publicationAPI.create(payload); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await publicationAPI.delete(deleteId); toast.success('Deleted'); load(); } catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Publications" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Publications</h1><p className="text-gray-500">Manage academic publications.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No publications.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.publicationType || 'Article'} {item.publicationDate && `| ${formatDate(item.publicationDate)}`}</p>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Publication' : 'Add Publication'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><input {...register('title', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Type</label><select {...register('publicationType')} className="w-full px-3 py-2 border rounded-lg">
              <option value="journal_article">Journal Article</option><option value="conference_paper">Conference Paper</option>
              <option value="book_chapter">Book Chapter</option><option value="book">Book</option><option value="report">Report</option>
              <option value="policy_brief">Policy Brief</option><option value="working_paper">Working Paper</option><option value="other">Other</option>
            </select></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select {...register('status')} className="w-full px-3 py-2 border rounded-lg">
              <option value="published">Published</option><option value="draft">Draft</option><option value="under_review">Under Review</option><option value="archived">Archived</option>
            </select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Authors (comma-separated)</label><input {...register('authors')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Journal</label><input {...register('journal')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">DOI</label><input {...register('doi')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Publication Date</label><input {...register('publicationDate')} type="date" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Abstract</label><textarea {...register('abstract')} rows={4} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Publication" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

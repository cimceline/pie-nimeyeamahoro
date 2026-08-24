import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import client from '../../api/client';
import { translationAPI } from '../../api/endpoints';

export default function TranslationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/translations');
      setItems(data.translations || data.data || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); reset({ entityType: 'resource', entityId: '', language: 'en', translatedTitle: '', translatedDescription: '', status: 'draft', translator: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); reset(item); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editItem) { await translationAPI.update(editItem._id, data); toast.success('Updated'); }
      else { await translationAPI.create(data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await translationAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Translations" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Translations</h1><p className="text-gray-500">Manage translation strings.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No translations.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div><h3 className="font-medium text-gray-900 font-mono text-sm">{item.entityType}:{item.language}</h3>
                <p className="text-sm text-gray-500">{item.translatedTitle || item.translatedDescription || 'No translation'}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">Edit</button>
                <button onClick={() => setDeleteId(item._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Translation' : 'Add Translation'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Entity Type</label><select {...register('entityType', { required: true })} className="w-full px-3 py-2 border rounded-lg">
            <option value="resource">Resource</option><option value="publication">Publication</option><option value="article">Article</option>
            <option value="service">Service</option><option value="profile">Profile</option>
            <option value="faq">FAQ</option><option value="education">Education</option><option value="experience">Experience</option>
            <option value="expertise">Expertise</option><option value="skill">Skill</option>
          </select></div>
          <div><label className="block text-sm font-medium mb-1">Entity ID</label><input {...register('entityId', { required: true })} className="w-full px-3 py-2 border rounded-lg font-mono" placeholder="MongoDB ObjectId" /></div>
          <div><label className="block text-sm font-medium mb-1">Language</label><select {...register('language')} className="w-full px-3 py-2 border rounded-lg">
            <option value="en">English</option><option value="fr">French</option><option value="it">Italian</option><option value="de">German</option>
          </select></div>
          <div><label className="block text-sm font-medium mb-1">Translated Title</label><input {...register('translatedTitle')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Translated Description</label><textarea {...register('translatedDescription')} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Status</label><select {...register('status')} className="w-full px-3 py-2 border rounded-lg">
            <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="outdated">Outdated</option>
          </select></div>
          <div><label className="block text-sm font-medium mb-1">Translator</label><input {...register('translator')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Translation" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { skillAPI } from '../../api/endpoints';

export default function SkillsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await skillAPI.getAll(); setItems(data.skills || data.data || []); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); reset({ name: '', category: 'Research', proficiency: 'advanced', yearsOfExperience: 0, isFeatured: false }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); reset(item); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editItem) { await skillAPI.update(editItem._id, data); toast.success('Updated'); }
      else { await skillAPI.create(data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await skillAPI.delete(deleteId); toast.success('Deleted'); load(); } catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Skills" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Skills</h1><p className="text-gray-500">Manage skills and competencies.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12 col-span-3">No skills.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><h3 className="font-medium">{item.name}</h3></div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1 hover:bg-gray-100 rounded">Edit</button>
                  <button onClick={() => setDeleteId(item._id)} className="p-1 hover:bg-red-50 rounded text-red-400">Delete</button>
                </div>
              </div>
              {item.proficiency && <p className="text-xs text-gray-500">{item.category} | {item.proficiency}{item.yearsOfExperience ? ` | ${item.yearsOfExperience}y` : ''}</p>}
              {item.isFeatured && <span className="inline-block mt-2 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Featured</span>}
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Category</label><select {...register('category')} className="w-full px-3 py-2 border rounded-lg">
              <option value="Research">Research</option><option value="Methodology">Methodology</option>
              <option value="Evaluation">Evaluation</option><option value="Project Management">Project Management</option>
              <option value="Policy">Policy</option><option value="Education">Education</option>
              <option value="Consulting">Consulting</option><option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option><option value="Language">Language</option>
            </select></div>
            <div><label className="block text-sm font-medium mb-1">Proficiency</label><select {...register('proficiency')} className="w-full px-3 py-2 border rounded-lg">
              <option value="expert">Expert</option><option value="advanced">Advanced</option>
              <option value="intermediate">Intermediate</option><option value="beginner">Beginner</option>
            </select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Years of Experience</label><input {...register('yearsOfExperience')} type="number" min="0" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex items-center gap-2"><input {...register('isFeatured')} type="checkbox" className="rounded" /><label className="text-sm">Featured</label></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Skill" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

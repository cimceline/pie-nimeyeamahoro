import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { educationAPI } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';

export default function EducationList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await educationAPI.getAll({ sort: '-startDate' });
      setItems(data.education || data.data || []);
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); reset({ qualification: '', degreeType: 'Master', institution: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); reset(item); setModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editItem) { await educationAPI.update(editItem._id, data); toast.success('Updated'); }
      else { await educationAPI.create(data); toast.success('Created'); }
      setModalOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await educationAPI.delete(deleteId); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  return (
    <>
      <SEO title="Manage Education" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Education</h1><p className="text-gray-500">Manage your educational background.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-center py-12">No education records.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.qualification}</h3>
                  <p className="text-sm text-gray-500">{item.institution} {item.startDate && `• ${formatDate(item.startDate)} - ${item.endDate ? formatDate(item.endDate) : 'Present'}`}</p>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Qualification</label><input {...register('qualification', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Degree Type</label><select {...register('degreeType', { required: true })} className="w-full px-3 py-2 border rounded-lg">
            <option value="PhD">PhD</option><option value="Master">Master</option><option value="Bachelor">Bachelor</option>
            <option value="Diploma">Diploma</option><option value="Certificate">Certificate</option><option value="Fellowship">Fellowship</option>
            <option value="Professional Qualification">Professional Qualification</option><option value="Other">Other</option>
          </select></div>
          <div><label className="block text-sm font-medium mb-1">Institution</label><input {...register('institution', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Field of Study</label><input {...register('fieldOfStudy')} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Start Date</label><input {...register('startDate')} type="date" className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">End Date</label><input {...register('endDate')} type="date" className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea {...register('description')} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">{editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Education" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

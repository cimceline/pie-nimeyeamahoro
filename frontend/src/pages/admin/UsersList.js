import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { userAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

export default function UsersList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await userAPI.getAll(); setItems(data.users || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try { await userAPI.create(data); toast.success('User created'); setModalOpen(false); reset(); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleActive = async (user) => {
    try {
      if (user.isActive === false) { await userAPI.activate(user._id); }
      else { await userAPI.deactivate(user._id); }
      toast.success('Updated'); load();
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <SEO title="Manage Users" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Users</h1><p className="text-gray-500">Manage platform users.</p></div>
        <button onClick={() => { reset(); setModalOpen(true); }} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add User</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Joined</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No users.</td></tr>}
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="px-4 py-3"><div className="font-medium">{item.name}</div><div className="text-gray-500 text-xs">{item.email}</div></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 capitalize">{item.role}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${item.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleActive(item)} className="p-1 hover:bg-gray-100 rounded">
                      {item.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input {...register('email', { required: true })} type="email" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label><input {...register('password', { required: true })} type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Role</label><select {...register('role')} className="w-full px-3 py-2 border rounded-lg">
            <option value="editor">Editor</option><option value="content_manager">Content Manager</option>
            <option value="moderator">Moderator</option><option value="research_manager">Research Manager</option>
            <option value="service_manager">Service Manager</option>
          </select></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">Create</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

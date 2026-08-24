import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { userAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'communication_manager', label: 'Communication Manager' },
  { value: 'translator', label: 'Translator' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'editor', label: 'Editor' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'research_manager', label: 'Research Manager' },
  { value: 'service_manager', label: 'Service Manager' },
];

const ALL_PERMISSIONS = [
  'profile.read', 'profile.write', 'documents.read', 'documents.write',
  'translations.read', 'translations.write', 'comments.moderate',
  'messages.read', 'messages.reply', 'services.write', 'analytics.read',
  'settings.write', 'users.manage', 'audit.read', 'content.write',
  'content.publish', 'content.review', 'announcements.write',
  'media.write', 'export.data', 'system.health', 'system.maintenance',
];

export default function UsersManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // eslint-disable-line no-unused-vars
  const [permissionsModal, setPermissionsModal] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [sessionsModal, setSessionsModal] = useState(null);
  const [sessions, setSessions] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { register: permRegister, handleSubmit: permSubmit, reset: permReset } = useForm();
  const { register: pwRegister, handleSubmit: pwSubmit, reset: pwReset } = useForm();

  const load = async () => {
    setLoading(true);
    try { const { data } = await userAPI.getAll(); setItems(data.data || data.users || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      if (editItem) { toast.info('Use Role/Permissions buttons to modify'); }
      else { await userAPI.create(data); toast.success('User created'); setModalOpen(false); reset(); load(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleActive = async (user) => {
    try {
      if (user.isActive === false) { await userAPI.activate(user._id); }
      else { await userAPI.deactivate(user._id); }
      toast.success('Updated'); load();
    } catch { toast.error('Failed'); }
  };

  const openPermissions = (user) => {
    setPermissionsModal(user);
    permReset({ permissions: user.permissions || [] });
  };

  const onPermSubmit = async (data) => {
    try {
      await userAPI.updatePermissions(permissionsModal._id, { permissions: data.permissions || [] });
      toast.success('Permissions updated');
      setPermissionsModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openPassword = (user) => { setPasswordModal(user); pwReset({ newPassword: '' }); };

  const onPwSubmit = async (data) => {
    try {
      await userAPI.resetPassword(passwordModal._id, data);
      toast.success('Password reset');
      setPasswordModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openSessions = async (user) => {
    setSessionsModal(user);
    try {
      const { data } = await userAPI.getSessions(user._id);
      setSessions(data.data || []);
    } catch { setSessions([]); }
  };

  const revokeSession = async (sessionId) => {
    try {
      await userAPI.revokeSession(sessionsModal._id, sessionId);
      toast.success('Session revoked');
      openSessions(sessionsModal);
    } catch { toast.error('Failed'); }
  };

  const changeRole = async (userId, role) => {
    try {
      await userAPI.updateRole(userId, { role });
      toast.success('Role updated'); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <>
      <SEO title="Manage Users" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Users</h1><p className="text-gray-500">Manage admin users and permissions.</p></div>
        <button onClick={() => { reset(); setModalOpen(true); }} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">Add User</button>
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Last Login</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No users.</td></tr>}
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-500 text-xs">{item.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={item.role} onChange={(e) => changeRole(item._id, e.target.value)}
                      className="text-xs px-2 py-1 border rounded-lg bg-white">
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isActive !== false ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.lastLogin ? formatDateTime(item.lastLogin) : 'Never'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openPermissions(item)} className="p-1.5 hover:bg-gray-100 rounded text-xs" title="Permissions">
                        Perms</button>
                      <button onClick={() => openPassword(item)} className="p-1.5 hover:bg-gray-100 rounded text-xs" title="Reset Password">
                        Pw</button>
                      <button onClick={() => openSessions(item)} className="p-1.5 hover:bg-gray-100 rounded text-xs" title="Sessions">
                        Sessions</button>
                      <button onClick={() => toggleActive(item)} className="p-1.5 hover:bg-gray-100 rounded text-xs">
                        {item.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input {...register('email', { required: true })} type="email" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label><input {...register('password', { required: true })} type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Role</label><select {...register('role')} className="w-full px-3 py-2 border rounded-lg">
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">Create</button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={!!permissionsModal} onClose={() => setPermissionsModal(null)} title={`Permissions — ${permissionsModal?.name}`}>
        <form onSubmit={permSubmit(onPermSubmit)} className="space-y-4">
          <p className="text-xs text-gray-500">Role: <strong>{permissionsModal?.role}</strong>. Custom permissions are added on top of role defaults.</p>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {ALL_PERMISSIONS.map(p => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={p} {...permRegister('permissions')} className="rounded" />
                {p}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setPermissionsModal(null)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">Save</button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={!!passwordModal} onClose={() => setPasswordModal(null)} title={`Reset Password — ${passwordModal?.name}`}>
        <form onSubmit={pwSubmit(onPwSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">New Password</label>
            <input {...pwRegister('newPassword', { required: true, minLength: 8 })} type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setPasswordModal(null)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
            <button type="submit" className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 text-sm">Reset</button>
          </div>
        </form>
      </Modal>

      {/* Sessions Modal */}
      <Modal isOpen={!!sessionsModal} onClose={() => setSessionsModal(null)} title={`Sessions — ${sessionsModal?.name}`}>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sessions.length === 0 && <p className="text-gray-500 text-sm">No active sessions.</p>}
          {sessions.filter(s => s.isActive).map((s) => (
            <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <div className="font-medium">{s.device || 'Unknown device'} — {s.browser || 'Unknown browser'}</div>
                <div className="text-xs text-gray-500">IP: {s.ip} | {formatDateTime(s.loginAt)}</div>
              </div>
              <button onClick={() => revokeSession(s._id)} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100">Revoke</button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

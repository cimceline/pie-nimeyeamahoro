import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { settingsAPI } from '../../api/endpoints';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const { theme, setTheme } = useTheme();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    settingsAPI.getAll().then(({ data }) => {
      const s = data.data || {};
      reset(s);
      setMaintenanceEnabled(s.maintenance_mode === 'true' || s.maintenance_mode === true);
      setMaintenanceMessage(s.maintenance_message || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await settingsAPI.update({ ...data, maintenance_mode: maintenanceEnabled, maintenance_message: maintenanceMessage });
      toast.success('Settings updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner className="py-32" />;

  return (
    <>
      <SEO title="Settings" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Configure platform settings.</p></div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Site Information</h2>
          <div><label className="block text-sm font-medium mb-1">Site Title</label>
            <input {...register('siteTitle')} className="w-full px-4 py-2.5 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Site Description</label>
            <textarea {...register('siteDescription')} rows={3} className="w-full px-4 py-2.5 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Contact Email</label>
            <input {...register('contactEmail')} type="email" className="w-full px-4 py-2.5 border rounded-lg" /></div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <div><label className="block text-sm font-medium mb-1">Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Maintenance Mode</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={maintenanceEnabled} onChange={(e) => setMaintenanceEnabled(e.target.checked)}
              className="w-5 h-5 rounded" />
            <div>
              <span className="text-sm font-medium">Enable Maintenance Mode</span>
              <p className="text-xs text-gray-500">Only admins can access the site when enabled</p>
            </div>
          </label>
          <div><label className="block text-sm font-medium mb-1">Maintenance Message</label>
            <textarea value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} rows={2}
              placeholder="System is under maintenance. Please try again later."
              className="w-full px-4 py-2.5 border rounded-lg" /></div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">SEO</h2>
          <div><label className="block text-sm font-medium mb-1">Meta Keywords</label>
            <input {...register('metaKeywords')} className="w-full px-4 py-2.5 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Google Analytics ID</label>
            <input {...register('googleAnalyticsId')} className="w-full px-4 py-2.5 border rounded-lg" /></div>
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </>
  );
}

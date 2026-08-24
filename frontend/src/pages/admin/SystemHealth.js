import React, { useState, useEffect } from 'react';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { healthAPI } from '../../api/endpoints';
import { toast } from 'react-toastify';

const STATUS_STYLES = {
  healthy: 'bg-green-100 text-green-700 border-green-200',
  ok: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

function HealthCard({ title, status, children }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_STYLES[status] || STATUS_STYLES.healthy}`}>
          {status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">{children}</div>
    </div>
  );
}

export default function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [db, setDb] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [hRes, dbRes, sysRes] = await Promise.allSettled([
        healthAPI.check(),
        healthAPI.database(),
        healthAPI.system(),
      ]);
      if (hRes.status === 'fulfilled') setHealth(hRes.value.data.data);
      if (dbRes.status === 'fulfilled') setDb(dbRes.value.data.data);
      if (sysRes.status === 'fulfilled') setSystem(sysRes.value.data.data);
    } catch { toast.error('Failed to load health data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <>
      <SEO title="System Health" />
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">System Health</h1><p className="text-gray-500">Monitor system status and resources.</p></div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthCard title="Application" status={health?.status || 'ok'}>
          <p>Environment: {health?.environment}</p>
          <p>Node.js: {health?.nodeVersion}</p>
          <p>Uptime: {health?.uptime ? Math.round(health.uptime) + 's' : 'N/A'}</p>
        </HealthCard>

        <HealthCard title="Database" status={db?.status || 'healthy'}>
          <p>State: {db?.state}</p>
          <p>Host: {db?.host}</p>
          <p>Database: {db?.name}</p>
        </HealthCard>

        <HealthCard title="Memory" status={system?.status || 'healthy'}>
          {system?.memory && (
            <>
              <p>Used: {system.memory.used}MB / {system.memory.total}MB ({system.memory.percentUsed}%)</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full ${system.memory.percentUsed > 90 ? 'bg-red-500' : system.memory.percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${system.memory.percentUsed}%` }} />
              </div>
            </>
          )}
        </HealthCard>

        <HealthCard title="CPU" status="healthy">
          {system?.cpu && (
            <>
              <p>Model: {system.cpu.model}</p>
              <p>Cores: {system.cpu.cores}</p>
              <p>Load: {system.cpu.loadAverage['1m']?.toFixed(2)}</p>
            </>
          )}
        </HealthCard>
      </div>
    </>
  );
}

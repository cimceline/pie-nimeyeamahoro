import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import client from '../../api/client';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityFeed({ limit = 15, compact = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await client.get(`/audit-logs?limit=${limit}&sort=-createdAt`);
      setItems(res.data.data || res.data.logs || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSpinner className="py-8" />;

  if (items.length === 0) {
    return <p className="text-center text-gray-400 py-8 text-sm">No recent activity</p>;
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const action = item.action || 'update';

        return (
          <div key={item._id || i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                <span className="font-medium">{item.description || `${action} action`}</span>
              </p>
              {!compact && (
                <p className="text-xs text-gray-400">{item.entityType || ''} {timeAgo(item.createdAt)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

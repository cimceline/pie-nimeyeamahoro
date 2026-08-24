import React, { useState, useEffect } from 'react';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { auditLogAPI } from '../../api/endpoints';
import { formatDateTime } from '../../utils/formatters';

export default function AuditLogsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await auditLogAPI.getAll({ page: p, limit: 20 });
      setItems(data.logs || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page]);

  return (
    <>
      <SEO title="Audit Logs" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-gray-500">Track system activity and changes.</p></div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Entity</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
            </tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No logs.</td></tr>}
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="px-4 py-3"><span className="font-medium">{item.action}</span></td>
                  <td className="px-4 py-3 text-gray-500">{item.user?.name || item.userId || 'System'}</td>
                  <td className="px-4 py-3 text-gray-500">{item.entityType} {item.entityId && `#${item.entityId.slice(-6)}`}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDateTime(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

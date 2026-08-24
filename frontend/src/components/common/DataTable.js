import React, { useState } from 'react';
import Pagination from './Pagination';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../utils/formatters';
import { ITEMS_PER_PAGE } from '../../utils/constants';

export default function DataTable({
  columns,
  data = [],
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  onFilter,
  loading,
  emptyMessage = 'No data found',
  actions,
}) {
  const [filterText, setFilterText] = useState('');

  const handleSort = (field) => {
    if (onSort) {
      const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, newDirection);
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterText(value);
    if (onFilter) onFilter(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {onFilter && (
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Filter..."
              value={filterText}
              onChange={handleFilter}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-gray-600 ${
                    col.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row._id || rowIndex} className="border-b last:border-0 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row[col.key], row)
                        : col.key === 'status'
                        ? <StatusBadge status={row[col.key]} />
                        : col.key.includes('At') || col.key.includes('date')
                        ? formatDate(row[col.key])
                        : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{' '}
            {totalItems} results
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

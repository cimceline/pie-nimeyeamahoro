import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook for managing bulk selection and operations on list items.
 * @param {Function} apiBulkDelete - API function for bulk delete (accepts array of IDs)
 * @param {Function} onRefresh - Function to refresh the list after operations
 */
export function useBulkOperations(apiBulkDelete, onRefresh) {
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids) => {
    setSelected(prev => {
      if (prev.size === ids.length) return new Set();
      return new Set(ids);
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const bulkDelete = useCallback(async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} items? This cannot be undone.`)) return;

    setLoading(true);
    try {
      await apiBulkDelete([...selected]);
      toast.success(`${selected.size} items deleted`);
      clear();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk delete failed');
    } finally {
      setLoading(false);
    }
  }, [selected, apiBulkDelete, onRefresh, clear]);

  const isSelected = useCallback((id) => selected.has(id), [selected]);
  const isAllSelected = useCallback((ids) => ids.length > 0 && ids.every(id => selected.has(id)), [selected]);
  const someSelected = useCallback((ids) => ids.some(id => selected.has(id)), [selected]);

  return {
    selected,
    selectedCount: selected.size,
    loading,
    toggle,
    toggleAll,
    clear,
    bulkDelete,
    isSelected,
    isAllSelected,
    someSelected,
  };
}

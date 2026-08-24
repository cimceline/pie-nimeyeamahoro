import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FileUpload from '../../components/common/FileUpload';
import { mediaAPI } from '../../api/endpoints';
import { formatDateTime, formatFileSize } from '../../utils/formatters';

export default function MediaList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const { data } = await mediaAPI.getAll(); setItems(data.media || data.data || []); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await mediaAPI.upload(formData);
      toast.success('Uploaded');
      load();
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const handleDelete = async () => {
    try { await mediaAPI.delete(deleteId); toast.success('Deleted'); load(); }
    catch {} setDeleteId(null);
  };

  return (
    <>
      <SEO title="Media Library" />
      <div className="mb-8"><h1 className="text-2xl font-bold">Media</h1>
        <p className="text-gray-500">Manage uploaded media files.</p></div>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-3">Upload File</h2>
        <FileUpload onChange={handleUpload} />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      </div>
      {loading ? <LoadingSpinner className="py-12" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.length === 0 && <p className="text-gray-500 text-center py-12 col-span-4">No media files.</p>}
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border overflow-hidden group relative">
              {item.mimeType?.startsWith('image/') ? (
                <img src={item.url} alt={item.originalName} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                </div>
              )}
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 truncate">{item.originalName || item.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(item.size)} | {formatDateTime(item.createdAt)}</p>
              </div>
              <button onClick={() => setDeleteId(item._id)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-opacity text-red-500 text-xs">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Media" message="Are you sure?" confirmText="Delete" />
    </>
  );
}

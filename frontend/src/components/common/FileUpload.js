import React, { useRef, useState } from 'react';
import { formatFileSize } from '../../utils/formatters';

export default function FileUpload({ accept, onChange, multiple = false, preview = true, className = '' }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const updated = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <span className="text-blue-500">IMG</span>;
    return <span className="text-gray-500">FILE</span>;
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <p className="text-sm text-gray-600">
          Drag & drop or <span className="text-primary-700 font-medium">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {accept ? `Accepted: ${accept}` : 'All file types accepted'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {preview && files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <span className="text-gray-500 text-sm">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

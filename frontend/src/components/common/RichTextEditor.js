import React, { useState } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = 'Write here...', rows = 10 }) {
  const [showPreview, setShowPreview] = useState(false);

  const renderMarkdown = (text) => {
    if (!text) return '<p class="text-gray-400">Nothing to preview</p>';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
            !showPreview ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
            showPreview ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
      </div>
      {showPreview ? (
        <div
          className="p-4 min-h-[200px] prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      ) : (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-4 border-0 focus:ring-0 resize-y min-h-[200px]"
        />
      )}
    </div>
  );
}

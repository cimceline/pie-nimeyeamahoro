import React from 'react';
import { toast } from 'react-toastify';

export default function SocialSharing({ title, url, description }) {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || document.title);
  const shareLinks = [
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: 'hover:text-blue-400' },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:text-blue-600' },
    { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:text-blue-700' },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl, text: description });
      } catch {}
    }
  };

  return (
    <div className="flex items-center gap-2">
      {navigator.share && (
        <button onClick={nativeShare} className="p-2 hover:bg-gray-100 rounded-lg" title="Share">
          <span className="text-gray-500 text-sm">Share</span>
        </button>
      )}
      {shareLinks.map(({ name, url, color }) => (
        <a key={name} href={url} target="_blank" rel="noopener noreferrer"
          className={`p-2 hover:bg-gray-100 rounded-lg ${color}`} title={`Share on ${name}`}>
          <span className="text-sm">{name.charAt(0)}</span>
        </a>
      ))}
      <button onClick={copyLink} className="p-2 hover:bg-gray-100 rounded-lg" title="Copy link">
        <span className="text-gray-500 text-sm">Copy</span>
      </button>
    </div>
  );
}

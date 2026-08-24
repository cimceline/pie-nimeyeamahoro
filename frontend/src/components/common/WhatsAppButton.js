import React from 'react';
import { getWhatsAppUrl, trackWhatsAppClick } from '../../utils/whatsapp';

export default function WhatsAppButton({ message, source = 'general', className = '', size = 'md', label }) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const handleClick = () => {
    trackWhatsAppClick(source);
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <button onClick={handleClick}
      className={`inline-flex items-center justify-center font-medium bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-colors ${sizeClasses[size]} ${className}`}>
      {label || 'Chat on WhatsApp'}
    </button>
  );
}

export function WhatsAppLink({ message, source = 'general', className = '', children }) {
  return (
    <a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(source)}
      className={className}>
      {children}
    </a>
  );
}

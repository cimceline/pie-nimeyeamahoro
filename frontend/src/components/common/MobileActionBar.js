import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl, WHATSAPP_MESSAGES, trackWhatsAppClick } from '../../utils/whatsapp';

export default function MobileActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t shadow-lg safe-bottom">
      <div className="grid grid-cols-3 gap-1 p-2">
        <Link to="/contact?type=project"
          className="flex flex-col items-center gap-1 py-2.5 px-2 bg-primary-700 text-white rounded-lg text-xs font-medium">
          Request Project
        </Link>
        <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
          target="_blank" rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('mobile_bar')}
          className="flex flex-col items-center gap-1 py-2.5 px-2 bg-[#25D366] text-white rounded-lg text-xs font-medium">
          WhatsApp
        </a>
        <Link to="/contact?type=consultation"
          className="flex flex-col items-center gap-1 py-2.5 px-2 border-2 border-primary-700 text-primary-700 rounded-lg text-xs font-medium">
          Consultation
        </Link>
      </div>
    </div>
  );
}

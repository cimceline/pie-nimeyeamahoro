import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { WHATSAPP_MESSAGES } from '../../utils/whatsapp';

/**
 * Primary CTA: Request a Project
 */
export function RequestProjectCTA({ className = '', source = 'general', size = 'md', message }) {
  return (
    <Link to="/contact?type=project"
      className={`inline-flex items-center justify-center font-medium bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors ${size === 'lg' ? 'px-8 py-4 text-base gap-2.5' : size === 'sm' ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-6 py-3 text-sm gap-2'} ${className}`}>
      Request a Project
    </Link>
  );
}

/**
 * Secondary CTA: Book a Consultation
 */
export function BookConsultationCTA({ className = '', source = 'general', size = 'md' }) {
  return (
    <Link to="/contact?type=consultation"
      className={`inline-flex items-center justify-center font-medium border-2 border-primary-700 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors ${size === 'lg' ? 'px-8 py-4 text-base gap-2.5' : size === 'sm' ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-6 py-3 text-sm gap-2'} ${className}`}>
      Book a Consultation
    </Link>
  );
}

/**
 * Tertiary CTA: WhatsApp
 */
export function WhatsAppCTA({ className = '', source = 'general', size = 'md', message }) {
  return (
    <WhatsAppButton message={message || WHATSAPP_MESSAGES.general} source={source} size={size} className={className} />
  );
}

/**
 * Contextual CTA group for service pages
 */
export function ServiceCTAGroup({ serviceName, source = 'service', className = '' }) {
  const msg = `Hello, I would like to discuss a potential ${serviceName} project.`;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link to={`/contact?type=project&service=${encodeURIComponent(serviceName)}`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-lg transition-colors">
        Discuss Your Project
      </Link>
      <Link to="/contact?type=consultation"
        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-700 text-primary-700 hover:bg-primary-50 font-medium rounded-lg transition-colors">
        Book a Consultation
      </Link>
      <WhatsAppButton message={msg} source={source} size="md" />
    </div>
  );
}

/**
 * Inline contextual CTA
 */
export function InlineCTA({ text = 'Request a Project', to = '/contact', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-semibold transition-colors ${className}`}>
      {text}
    </Link>
  );
}

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '+250788441732';

/**
 * Build a WhatsApp chat URL with pre-filled message.
 * @param {string} message - The pre-filled message text
 * @param {string} phone - Optional phone override
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppUrl(message = '', phone = WHATSAPP_NUMBER) {
  const clean = phone.replace(/[^0-9+]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean.replace('+', '')}?text=${encoded}`;
}

/**
 * Pre-filled WhatsApp messages for common contexts.
 */
export const WHATSAPP_MESSAGES = {
  project: "Hello, I would like to discuss a potential project. I am interested in learning more about your services and how you can help.",
  consultation: "Hello, I would like to book a consultation to discuss my project needs.",
  evaluation: "Hello, I would like to discuss a Social Impact Evaluation project.",
  research: "Hello, I would like to discuss a research project.",
  grant: "Hello, I would like to discuss grant writing and project design support.",
  education: "Hello, I would like to discuss educational consulting services.",
  policy: "Hello, I would like to discuss public policy consulting services.",
  csr: "Hello, I would like to discuss CSR and social value consulting.",
  training: "Hello, I would like to discuss training services.",
  toc: "Hello, I would like to discuss Theory of Change consulting.",
  contact: "Hello, I found your website and would like to get in touch.",
  general: "Hello, I would like to inquire about your services.",
};

/**
 * Track WhatsApp click for analytics.
 */
export function trackWhatsAppClick(source = 'unknown') {
  try {
    const event = new CustomEvent('whatsapp_click', { detail: { source, timestamp: Date.now() } });
    window.dispatchEvent(event);
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', { source });
    }
  } catch {}
}

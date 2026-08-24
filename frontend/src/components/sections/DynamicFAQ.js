import React, { useState } from 'react';

const DEFAULT_FAQS = [
  { q: 'What types of projects can you support?', a: 'We support impact evaluations, Theory of Change development, grant writing, project design, educational consulting, policy analysis, CSR assessment, training programs, and more. If you have a specific challenge, we can discuss how our expertise applies.' },
  { q: 'Who can request a project?', a: 'Universities, research centers, NGOs, foundations, international organizations, public administrations, municipalities, educational institutions, social enterprises, and corporate CSR departments.' },
  { q: 'Do you work with international organizations?', a: 'Yes. We have experience working with international donors, EU programs, UN agencies, and multi-stakeholder partnerships across various countries.' },
  { q: 'Can you work remotely?', a: 'Absolutely. Most of our consulting and project work is conducted remotely, with in-person engagement available when needed.' },
  { q: 'How does the consultation process work?', a: 'Start by describing your project through our form or WhatsApp. We review your needs, schedule an initial consultation, and develop a tailored proposal with clear scope, timeline, and pricing.' },
  { q: 'How long does a project normally take?', a: 'Project timelines vary based on scope and complexity. A focused evaluation may take 4-8 weeks, while a comprehensive project design can take 2-4 months. We provide clear timelines in every proposal.' },
  { q: 'Can you prepare a custom proposal?', a: 'Yes. Every engagement begins with understanding your specific needs, followed by a custom proposal outlining scope, methodology, timeline, and pricing.' },
  { q: 'How is my information protected?', a: 'All project information is treated with strict confidentiality. We can sign NDAs and follow your organization\'s data protection requirements.' },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
        <span className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">{faq.a}</div>
      )}
    </div>
  );
}

export default function DynamicFAQ({ faqs = [], title = 'Frequently Asked Questions', className = '' }) {
  const [openIndex, setOpenIndex] = useState(0);
  const allFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <section className={`py-16 lg:py-24 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="space-y-2">
          {allFaqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import useApi from '../../hooks/useApi';

export default function TestimonialsSection({ className = '' }) {
  const { data } = useApi('/testimonials?isFeatured=true&limit=6');
  const testimonials = data?.testimonials || data?.data || [];

  if (testimonials.length === 0) return null;

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">Testimonials</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white p-6 rounded-xl border relative">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`w-4 h-4 ${s <= (t.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4 italic">"{t.quote || t.content || t.testimonial}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900 text-sm">{t.authorName || t.name}</p>
                <p className="text-xs text-gray-500">
                  {[t.authorPosition || t.role, t.authorOrganization || t.organization].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

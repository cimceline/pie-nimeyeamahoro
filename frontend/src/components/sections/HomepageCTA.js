import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../common/WhatsAppButton';
import TrustSignals from '../common/TrustSignals';
import { WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import useApi from '../../hooks/useApi';

export default function HomepageCTA({ className = '' }) {
  const { data: profileData } = useApi('/profile/public');
  const p = profileData?.profile || profileData || {};

  return (
    <section className={`py-16 lg:py-24 bg-primary-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p className="text-primary-200 max-w-2xl mx-auto mb-8 text-lg">
          Whether you need impact evaluation, project design, or strategic consulting, we are here to help you achieve meaningful results.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link to="/contact?type=project"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
            Request a Project
          </Link>
          <Link to="/contact?type=consultation"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Book a Consultation
          </Link>
          <WhatsAppButton message={WHATSAPP_MESSAGES.project} source="homepage_cta" size="lg"
            className="!bg-[#25D366] !border-0 !px-8 !py-4 !text-base" />
        </div>

        <TrustSignals profile={p} compact className="justify-center !text-primary-300 [&_span]:!text-primary-300 [&_svg]:!text-primary-400" />

        <p className="text-primary-300 text-sm mt-6">
          Free initial project discovery available. Describe your challenge and we will guide you on the best approach.
        </p>
      </div>
    </section>
  );
}

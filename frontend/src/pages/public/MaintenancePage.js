import React from 'react';
import SEO from '../../components/common/SEO';

export default function MaintenancePage() {
  return (
    <>
      <SEO title="Maintenance" />
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Under Maintenance</h1>
          <p className="text-gray-600 mb-6">
            We are currently performing scheduled maintenance. Please check back shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>We will be back soon</span>
          </div>
        </div>
      </div>
    </>
  );
}

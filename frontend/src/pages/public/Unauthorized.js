import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

export default function Unauthorized() {
  return (
    <>
      <SEO title="Unauthorized" />
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 px-6">
        <div className="text-center">
          <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500 mb-4">403</p>
          <h1 className="font-display text-3xl font-bold text-navy-950 mb-3">Unauthorized Access</h1>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            You don't have permission to access this page. Please contact an administrator.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}

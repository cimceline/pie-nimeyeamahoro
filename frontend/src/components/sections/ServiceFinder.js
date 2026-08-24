import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../common/WhatsAppButton';

const GOALS = [
  { id: 'evaluation', label: 'Evaluate a program', icon: '📊', services: ['Social Impact Evaluation', 'Monitoring & Evaluation', 'Theory of Change'] },
  { id: 'project-design', label: 'Design a project', icon: '🎯', services: ['Grant & Project Design', 'Theory of Change', 'Strategic Planning'] },
  { id: 'funding', label: 'Secure funding', icon: '💰', services: ['Grant & Project Design', 'Proposal Writing', 'Budget Development'] },
  { id: 'education', label: 'Improve educational service', icon: '📚', services: ['Educational Services Consulting', 'Curriculum Design', 'Training'] },
  { id: 'social-impact', label: 'Measure social impact', icon: '🌍', services: ['Social Impact Evaluation', 'CSR & Social Value', 'Impact Measurement'] },
  { id: 'policy', label: 'Develop public policy', icon: '🏛️', services: ['Public Policy Consulting', 'Policy Analysis', 'Welfare Evaluation'] },
  { id: 'welfare', label: 'Evaluate welfare services', icon: '🤝', services: ['Welfare Evaluation', 'Social Impact Evaluation', 'Policy Analysis'] },
  { id: 'csr', label: 'Improve CSR impact', icon: '🏢', services: ['CSR & Social Value', 'Impact Measurement', 'Reporting'] },
  { id: 'training', label: 'Train a team', icon: '👥', services: ['Training', 'Capacity Building', 'Workshop Design'] },
  { id: 'other', label: 'I have another project', icon: '💡', services: ['Consulting', 'Custom Project'] },
];

const ORG_TYPES = [
  { id: 'university', label: 'University', icon: '🎓' },
  { id: 'research-center', label: 'Research Center', icon: '🔬' },
  { id: 'ngo', label: 'NGO', icon: '🤲' },
  { id: 'foundation', label: 'Foundation', icon: '🏗️' },
  { id: 'international', label: 'International Organization', icon: '🌐' },
  { id: 'public', label: 'Public Administration', icon: '🏛️' },
  { id: 'municipality', label: 'Municipality', icon: '🏘️' },
  { id: 'educational', label: 'Educational Institution', icon: '📖' },
  { id: 'social-enterprise', label: 'Social Enterprise', icon: '🌱' },
  { id: 'corporate', label: 'Corporate / CSR', icon: '🏢' },
];

export default function ServiceFinder({ className = '' }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [orgType, setOrgType] = useState(null);

  const recommended = useMemo(() => {
    if (!goal) return [];
    const g = GOALS.find(x => x.id === goal);
    return g ? g.services : [];
  }, [goal]);

  const orgLabel = ORG_TYPES.find(o => o.id === orgType)?.label || '';

  const reset = () => { setStep(0); setGoal(null); setOrgType(null); };

  return (
    <section className={`py-16 lg:py-24 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Interactive
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Find the Right Service</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Answer two quick questions and we will recommend the most relevant services.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s <= step ? 'w-12 bg-primary-700' : 'w-8 bg-gray-200'}`} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 0: Goal */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">What are you trying to achieve?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => { setGoal(g.id); setStep(1); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all hover:border-primary-300 hover:bg-primary-50 ${goal === g.id ? 'border-primary-700 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Org Type */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">What type of organization are you?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ORG_TYPES.map(o => (
                  <button key={o.id} onClick={() => { setOrgType(o.id); setStep(2); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all hover:border-primary-300 hover:bg-primary-50 ${orgType === o.id ? 'border-primary-700 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                    <span className="text-2xl">{o.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{o.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                Back
              </button>
            </div>
          )}

          {/* Step 2: Results */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Services</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Based on your needs as a <strong>{orgLabel}</strong>, here are the most relevant services:
              </p>
              <div className="space-y-3 mb-8">
                {recommended.map((svc, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                    <span className="font-medium text-gray-900 flex-1">{svc}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={`/contact?type=project&service=${encodeURIComponent(recommended[0] || '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-lg transition-colors">
                  Start Your Project
                </Link>
                <WhatsAppButton message={`Hello, I am interested in ${recommended[0] || 'your services'}. I am from a ${orgLabel}.`} source="service_finder" size="md" />
                <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-3 border text-sm font-medium rounded-lg hover:bg-gray-50">
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../common/WhatsAppButton';

const PROBLEMS = [
  { id: 'impact', problem: 'Need to evaluate the impact of your program?', solution: 'Social Impact Evaluation', desc: 'Rigorous evaluation using mixed methods, outcome measurement, and evidence-based frameworks.', link: '/services', cta: 'Discuss Impact Evaluation' },
  { id: 'toc', problem: 'Need to develop a Theory of Change?', solution: 'Theory of Change Consulting', desc: 'Step-by-step development of logical frameworks connecting activities to intended outcomes.', link: '/services', cta: 'Discuss Theory of Change' },
  { id: 'grant', problem: 'Need help preparing a European project?', solution: 'Grant & Project Design', desc: 'Strategic project design aligned with EU, UN, and international funding requirements.', link: '/services', cta: 'Discuss Your Grant Project' },
  { id: 'education', problem: 'Need to design an educational service?', solution: 'Educational Services Consulting', desc: 'Curriculum design, learning outcome evaluation, and institutional development.', link: '/services', cta: 'Discuss Educational Consulting' },
  { id: 'policy', problem: 'Need to evaluate a welfare or public-policy intervention?', solution: 'Policy & Welfare Evaluation', desc: 'Evidence-based policy analysis and welfare assessment for government and public institutions.', link: '/services', cta: 'Discuss Policy Support' },
  { id: 'csr', problem: 'Need to measure the social value of a CSR initiative?', solution: 'CSR & Social Value Consulting', desc: 'Impact measurement, social value reporting, and stakeholder engagement strategies.', link: '/services', cta: 'Discuss CSR Impact' },
];

export default function ProblemSolution({ className = '' }) {
  const [active, setActive] = useState(0);

  return (
    <section className={`py-16 lg:py-24 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            How Can We Help You?
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Challenge Can We Solve?</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-2">
            {PROBLEMS.map((p, i) => (
              <button key={p.id} onClick={() => setActive(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${i === active ? 'border-primary-700 bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'}`}>
                <p className={`text-sm font-medium ${i === active ? 'text-primary-700' : 'text-gray-700'}`}>{p.problem}</p>
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-2">Recommended Solution</p>
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{PROBLEMS[active].solution}</h3>
            <p className="text-gray-600 mb-6">{PROBLEMS[active].desc}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={`${PROBLEMS[active].link}?highlight=${PROBLEMS[active].id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-lg transition-colors">
                {PROBLEMS[active].cta}
              </Link>
              <WhatsAppButton message={`Hello, I ${PROBLEMS[active].problem.toLowerCase().replace('need to ', '')} Can you help?`} source="problem_solution" size="md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

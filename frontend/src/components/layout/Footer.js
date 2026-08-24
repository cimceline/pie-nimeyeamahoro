import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { newsletterAPI } from '../../api/endpoints';
import profileImage from '../../upload/image.jpeg';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setSubscribeMsg('');
    try {
      await newsletterAPI.subscribe({ email });
      setSubscribeMsg('Thank you for subscribing.');
      setEmail('');
    } catch {
      setSubscribeMsg('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-copper-500 transition-all duration-300">
                <img src={profileImage} alt="Pie NEMEYAMAHORO" className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-bold tracking-[0.15em] text-white uppercase">Pie NEMEYAMAHORO</span>
              </div>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-8 max-w-xs">
              Social impact research and consulting for organizations committed to creating measurable, sustainable change.
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-3">Connect</p>
              <div className="flex gap-6">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-navy-300 hover:text-white transition-colors">LinkedIn</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-navy-300 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-6">Explore</h4>
            <ul className="space-y-3">
              {[
                { path: '/about', label: 'About' },
                { path: '/expertise', label: 'Expertise' },
                { path: '/research', label: 'Research' },
                { path: '/projects', label: 'Projects' },
                { path: '/publications', label: 'Publications' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-navy-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                { path: '/services', label: 'Impact Evaluation' },
                { path: '/services', label: 'Project Design' },
                { path: '/services', label: 'Policy Advisory' },
                { path: '/services', label: 'Research' },
                { path: '/services', label: 'Training' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm text-navy-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-6">Contact</h4>
            <div className="space-y-3 mb-8">
              <p className="text-sm text-navy-300">hello@celinecyuzuzo.com</p>
              <Link to="/appointments" className="text-sm text-navy-300 hover:text-white transition-colors block">
                Book an Appointment
              </Link>
            </div>

            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-navy-700 text-sm placeholder-navy-400 focus:outline-none focus:border-copper-500 transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full py-2.5 bg-copper-500 text-white text-sm font-semibold tracking-wide hover:bg-copper-600 transition-colors disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribeMsg && (
              <p className="text-xs text-copper-400 mt-2">{subscribeMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-xs">
            &copy; {new Date().getFullYear()} Pie NEMEYAMAHORO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-navy-400 text-xs">Privacy Policy</span>
            <span className="text-navy-400 text-xs">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

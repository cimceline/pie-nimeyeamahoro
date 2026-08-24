import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { contactAPI } from '../../api/endpoints';
import { FadeUp } from '../../components/common/AnimatedSection';

const CONTACT_INFO = {
  name: 'Pie NEMEYAMAHORO',
  title: 'PhD Candidate',
  email: 'pienemeye@gmail.com',
  phone: '+393515287375',
  twitter: '1983pie',
};

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sending, setSending] = useState(false);

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await contactAPI.create(data);
      toast.success('Message sent successfully. We will get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch to discuss your project, book a consultation, or request a proposal." />

      <section className="py-16 lg:py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Contact</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-ivory-50 max-w-3xl">
              Let's start a conversation.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-slate-400 mt-6">
              Tell us about your challenge and we will guide you on the best approach. No commitment required.
            </p>
            <div className="w-16 h-px bg-white/20 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
            <FadeUp className="lg:col-span-2">
              <div className="sticky top-24 space-y-10">
                <div>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4">Reach Out</p>
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-950 leading-tight mt-4 mb-6">
                    We're here to help.
                  </h2>
                  <div className="w-12 h-px bg-navy-950 mb-8" />
                </div>

                <div className="space-y-8">
                  <div className="border-l-2 border-navy-950 pl-6 py-2">
                    <p className="text-slate-500 font-body text-xs uppercase tracking-wider mb-1">Name</p>
                    <p className="text-navy-950 font-body text-sm font-semibold">{CONTACT_INFO.name}</p>
                  </div>
                  <div className="border-l-2 border-navy-950 pl-6 py-2">
                    <p className="text-slate-500 font-body text-xs uppercase tracking-wider mb-1">Position</p>
                    <p className="text-navy-950 font-body text-sm">{CONTACT_INFO.title}</p>
                  </div>
                  <div className="border-l-2 border-navy-950 pl-6 py-2">
                    <p className="text-slate-500 font-body text-xs uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-navy-950 font-body text-sm hover:text-navy-950/70 transition-colors">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                  <div className="border-l-2 border-navy-950 pl-6 py-2">
                    <p className="text-slate-500 font-body text-xs uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-navy-950 font-body text-sm hover:text-navy-950/70 transition-colors">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200" />

                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-950 mb-4">Connect</h3>
                  <div className="space-y-3">
                    <a
                      href={`https://twitter.com/${CONTACT_INFO.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-500 font-body text-sm hover:text-navy-950 transition-colors duration-200 group"
                    >
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                      Twitter (@{CONTACT_INFO.twitter})
                    </a>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200" />

                <div className="border-l-2 border-navy-950 pl-6 py-2">
                  <p className="text-navy-950 font-display text-sm font-semibold tracking-wide uppercase mb-1">Free Project Discovery</p>
                  <p className="text-slate-500 font-body text-sm leading-relaxed">
                    Not sure what you need? Describe your challenge briefly and we will suggest the best approach.
                  </p>
                </div>
              </div>
            </FadeUp>

            <FadeUp className="lg:col-span-3" delay={0.1}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-navy-950 transition-colors duration-200"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-navy-950 transition-colors duration-200"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Organization</label>
                  <input
                    {...register('organization')}
                    className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-navy-950 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Subject *</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:border-navy-950 transition-colors duration-200"
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  <p className="text-xs text-slate-500 mt-2">
                    Looking for a specific service? <Link to="/services" className="text-navy-950 hover:text-navy-950/70 transition-colors font-medium">Browse all services</Link>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    placeholder="Tell us about your project, challenge, or question..."
                    className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:border-navy-950 transition-colors duration-200 resize-none"
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-8 py-4 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 font-body">
                  Your information is treated with strict confidentiality.
                </p>
              </form>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

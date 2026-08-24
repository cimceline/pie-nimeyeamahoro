import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { appointmentAPI } from '../../api/endpoints';
import { FadeUp } from '../../components/common/AnimatedSection';

export default function Appointments() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sending, setSending] = useState(false);

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await appointmentAPI.create(data);
      toast.success('Appointment request submitted. We will confirm your booking soon.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit appointment request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO title="Book an Appointment" description="Schedule a consultation or meeting to discuss your project." />

      <section className="py-16 lg:py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">Consultation</p>
            <h1 className="font-display text-display-md lg:text-display-lg xl:text-display-xl font-bold text-navy-950 leading-[1.05] tracking-tight text-ivory-50 max-w-3xl">
              Let's discuss your project.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl text-slate-400 mt-6">
              Choose a convenient time for a consultation. We will confirm your appointment within 24 hours.
            </p>
            <div className="w-16 h-px bg-copper-500 mt-8" />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
            <FadeUp className="lg:col-span-2">
              <div className="sticky top-24 space-y-10">
                <div>
                  <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-500">What to Expect</p>
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-950 leading-tight mt-4 mb-6">
                    A focused session tailored to your needs.
                  </h2>
                  <div className="w-12 h-px bg-copper-500 mb-8" />
                </div>

                <div className="space-y-6">
                  <div className="border-l-2 border-copper-500 pl-6 py-2">
                    <p className="text-navy-950 font-display text-sm font-semibold tracking-wide uppercase mb-1">01 — Request</p>
                    <p className="text-slate-500 font-body text-sm leading-relaxed">
                      Fill in your details and preferred time. We will review your request promptly.
                    </p>
                  </div>
                  <div className="border-l-2 border-copper-500 pl-6 py-2">
                    <p className="text-navy-950 font-display text-sm font-semibold tracking-wide uppercase mb-1">02 — Confirm</p>
                    <p className="text-slate-500 font-body text-sm leading-relaxed">
                      We will confirm your appointment within 24 hours with all necessary details.
                    </p>
                  </div>
                  <div className="border-l-2 border-copper-500 pl-6 py-2">
                    <p className="text-navy-950 font-display text-sm font-semibold tracking-wide uppercase mb-1">03 — Meet</p>
                    <p className="text-slate-500 font-body text-sm leading-relaxed">
                      Discuss your project in a focused, collaborative session.
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200" />

                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-950 mb-4">Consultation Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <p className="text-navy-950 font-body text-sm">Project Discovery</p>
                      <p className="text-slate-500 font-body text-xs">30 min</p>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-navy-950 font-body text-sm">Strategy Session</p>
                      <p className="text-slate-500 font-body text-xs">60 min</p>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-navy-950 font-body text-sm">Follow-up Meeting</p>
                      <p className="text-slate-500 font-body text-xs">30 min</p>
                    </div>
                  </div>
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
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-copper-500 transition-colors duration-200"
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
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-copper-500 transition-colors duration-200"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Organization</label>
                    <input
                      {...register('organization')}
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-copper-500 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Subject *</label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      placeholder="e.g. Project consultation"
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:border-copper-500 transition-colors duration-200"
                    />
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Preferred Date *</label>
                  <input
                    {...register('preferredDate', { required: 'Preferred date is required' })}
                    type="date"
                    className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm focus:outline-none focus:border-copper-500 transition-colors duration-200"
                  />
                  {errors.preferredDate && <p className="text-xs text-red-500 mt-1">{errors.preferredDate.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell us about the purpose of the meeting..."
                    className="w-full px-4 py-3 border border-slate-200 bg-white text-navy-950 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:border-copper-500 transition-colors duration-200 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center px-7 py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide rounded-none hover:bg-navy-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 w-full md:w-auto"
                  >
                    {sending ? 'Submitting...' : 'Request Appointment'}
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

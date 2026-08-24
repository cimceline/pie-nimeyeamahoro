import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import client from '../../api/client';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await client.post('/auth/forgot-password', data);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 px-6">
      <div className="w-full max-w-md">
        <Link to="/admin/login" className="text-sm text-slate-500 hover:text-navy-950 transition-colors mb-10 inline-block">
          ← Back to Login
        </Link>

        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-navy-950 mb-2">Forgot password</h1>
          <p className="text-slate-500">Enter your email to receive a reset link.</p>
        </div>

        {sent ? (
          <div className="bg-white border border-slate-200 p-8">
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-navy-950/60 mb-3">Check your inbox</p>
            <p className="text-navy-950 font-medium mb-1">Reset link sent.</p>
            <p className="text-sm text-slate-500">Follow the instructions in the email to reset your password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-navy-950/20 transition-colors"
                placeholder="admin@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

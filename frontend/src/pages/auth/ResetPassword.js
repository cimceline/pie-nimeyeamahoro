import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import client from '../../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    setLoading(true);
    try {
      await client.post('/auth/reset-password', { token, password: data.password });
      setSuccess(true);
      toast.success('Password reset successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl font-bold text-navy-950 mb-4">Invalid Link</h1>
          <p className="text-slate-500 mb-8">This password reset link is invalid or has expired.</p>
          <Link to="/admin/forgot-password" className="text-sm text-navy-950 font-medium hover:text-navy-950/70 transition-colors">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50 px-6">
      <div className="w-full max-w-md">
        <Link to="/admin/login" className="text-sm text-slate-500 hover:text-navy-950 transition-colors mb-10 inline-block">
          &larr; Back to Login
        </Link>

        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-navy-950 mb-2">Reset password</h1>
          <p className="text-slate-500">Enter your new password below.</p>
        </div>

        {success ? (
          <div className="bg-white border border-slate-200 p-8">
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-navy-950/60 mb-3">Password updated</p>
            <p className="text-navy-950 font-medium mb-1">Your password has been reset.</p>
            <p className="text-sm text-slate-500 mb-6">You can now log in with your new password.</p>
            <Link to="/admin/login" className="inline-block px-6 py-3 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">New Password</label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-navy-950/20 transition-colors"
                placeholder="Min. 8 characters"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('password') || 'Passwords do not match'
                })}
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-navy-950/20 transition-colors"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-2">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

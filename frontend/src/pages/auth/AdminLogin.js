import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import profileImage from '../../upload/image.jpeg';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-copper-500/5 blur-3xl" />
          <svg className="absolute bottom-20 right-20 w-48 h-48 opacity-[0.04]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-copper-500" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-copper-500" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-copper-500 transition-all duration-300">
              <img src={profileImage} alt="Pie NEMEYAMAHORO" className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-[13px] font-bold tracking-[0.15em] text-white uppercase">Pie NEMEYAMAHORO</span>
          </Link>

          <div>
            <p className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-4 text-copper-400 mb-4">Admin Access</p>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Managing your<br />
              <span className="italic text-copper-400">research platform.</span>
            </h1>
            <p className="text-navy-300 text-lg max-w-md leading-relaxed">
              Sign in to manage your content, publications, projects, and consulting services.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-1">Role</p>
              <p className="text-sm text-navy-300">Administrator</p>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-copper-500 mb-1">Access</p>
              <p className="text-sm text-navy-300">Full Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-ivory-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-navy-950/20 group-hover:border-copper-500 transition-all duration-300">
                <img src={profileImage} alt="Pie NEMEYAMAHORO" className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-[13px] font-bold tracking-[0.15em] text-navy-950 uppercase">Pie NEMEYAMAHORO</span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your admin account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                type="email"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-copper-500 transition-colors"
                placeholder="admin@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 bg-white border border-slate-200 text-navy-950 placeholder-slate-400 focus:outline-none focus:border-copper-500 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-slate-300 text-copper-500 focus:ring-copper-500" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/admin/forgot-password" className="text-sm text-copper-500 hover:text-copper-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-navy-950 text-white font-semibold text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <Link to="/" className="text-sm text-slate-500 hover:text-navy-950 transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

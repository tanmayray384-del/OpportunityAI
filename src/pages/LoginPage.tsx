import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, Mail, Lock, ShieldCheck, Sun, Moon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme, profile } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please provide correct credentials.');
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 850);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 dark:bg-pink-500/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Theme selector inside login window */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          id="login-theme-toggle"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
              OpportunityAI
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">Unlock opportunities custom-mapped to your potential</p>
        </div>

        <div className="glass-panel rounded-2xl p-6.5 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-white/75 dark:bg-slate-900/60">
          <div className="mb-6.5">
            <h2 className="text-xl font-bold dark:text-white">Sign In</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Welcome back! Sign in or press "Sign In" to proceed with pre-filled details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-input"
                  className="w-full pl-10.5 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-sm transition-all dark:text-white"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Password</label>
                <a href="#" className="text-xs text-indigo-500 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password-input"
                  className="w-full pl-10.5 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-sm transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input 
                type="checkbox" 
                id="remember" 
                defaultChecked 
                className="rounded border-slate-300 dark:border-slate-800 accent-indigo-505"
              />
              <label htmlFor="remember" className="text-xs text-slate-500">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/80 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Don't have an account?</span>
            <Link to="/register" id="login-to-register-link" className="text-xs font-semibold text-indigo-500 hover:underline">
              Create a free student account
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Local storage authentication • Fully private and secure</span>
        </div>
      </div>

    </div>
  );
};

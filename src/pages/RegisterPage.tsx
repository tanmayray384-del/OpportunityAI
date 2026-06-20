import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, Mail, User, BookOpen, GraduationCap as CapIcon, ShieldCheck } from 'lucide-react';
import { SearchableSelect } from '../components/SearchableSelect';
import { COUNTRIES_DATA } from '../data/locations';

export const RegisterPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [collegeYear, setCollegeYear] = useState('Sophomore');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bangalore');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dependent dropdown handlers
  const handleCountryChange = (val: string) => {
    setCountry(val);
    const countryObj = COUNTRIES_DATA.find(c => c.name === val);
    if (countryObj && countryObj.states.length > 0) {
      const firstState = countryObj.states[0];
      setState(firstState.name);
      if (firstState.cities.length > 0) {
        setCity(firstState.cities[0]);
      } else {
        setCity('');
      }
    } else {
      setState('');
      setCity('');
    }
  };

  const handleStateChange = (val: string) => {
    setState(val);
    const countryObj = COUNTRIES_DATA.find(c => c.name === country);
    const stateObj = countryObj?.states.find(s => s.name === val);
    if (stateObj && stateObj.cities.length > 0) {
      setCity(stateObj.cities[0]);
    } else {
      setCity('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !country || !state || !city) {
      setError('Please fill in all details, including Country, State, and City.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Save newly registered fields to global AppContext
      updateProfile({
        name,
        email,
        branch,
        collegeYear,
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Git'],
        interests: ['Artificial Intelligence', 'Full Stack Development', 'Product Design'],
        preferredLocation: 'Remote',
        careerGoal: 'Software Engineer',
        achievements: ['Registered Student Member'],
        appliedCount: 0,
        country,
        state,
        city
      });
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 dark:bg-pink-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg relative z-10 my-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
              OpportunityAI
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">Join over 10K+ students tracking key milestones</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-white/75 dark:bg-slate-900/60">
          <div className="mb-6">
            <h2 className="text-xl font-bold dark:text-white">Create Student Account</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Instant matching in under 60 seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-sm dark:text-white"
                    placeholder="Chinmaya Parija"
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-10 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-sm dark:text-white"
                    placeholder="student@university.edu"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Academic Branch</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <BookOpen size={16} />
                  </span>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-sm dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Electrical Eng">Electrical Eng</option>
                    <option value="Business & Design">Business & Design</option>
                    <option value="Mechanical Eng">Mechanical Eng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">University Year</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <CapIcon size={16} />
                  </span>
                  <select
                    value={collegeYear}
                    onChange={(e) => setCollegeYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-sm dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="Freshman">Freshman (1st Yr)</option>
                    <option value="Sophomore">Sophomore (2nd Yr)</option>
                    <option value="Junior">Junior (3rd Yr)</option>
                    <option value="Senior">Senior (4th Yr)</option>
                    <option value="Master's">Master's Student</option>
                    <option value="Ph.D.">Ph.D. Researcher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Country -> State -> City Location setup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SearchableSelect
                id="register-country-select"
                label="Country"
                placeholder="Select country..."
                options={COUNTRIES_DATA.map((c) => c.name)}
                value={country}
                onChange={handleCountryChange}
              />

              <SearchableSelect
                id="register-state-select"
                label="State / Province"
                placeholder="Select state..."
                options={COUNTRIES_DATA.find((c) => c.name === country)?.states.map((s) => s.name) || []}
                value={state}
                onChange={handleStateChange}
                disabled={!country}
              />
            </div>

            <SearchableSelect
              id="register-city-select"
              label="City"
              placeholder="Select city..."
              options={
                COUNTRIES_DATA.find((c) => c.name === country)
                  ?.states.find((s) => s.name === state)
                  ?.cities || []
              }
              value={city}
              onChange={setCity}
              disabled={!state}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-sm dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center gap-2 py-0.5">
              <input 
                type="checkbox" 
                id="terms" 
                defaultChecked 
                className="rounded border-slate-300 dark:border-slate-800 accent-indigo-500"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-500">
                I agree to the OpportunityAI Academic Honor Code and Privacy Policies
              </label>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/80 text-center flex flex-col items-center justify-center gap-1.5">
            <span className="text-xs text-slate-500">Already registered?</span>
            <Link to="/login" id="register-to-login-link" className="text-xs font-semibold text-indigo-500 hover:underline">
              Sign into existing account
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Local storage auth • Instantly loaded on return</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare,
  Users,
  CheckCircle,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: '140+', label: 'Verified Opportunities' },
    { value: '10K+', label: 'Active Students' },
    { value: '$250K+', label: 'Total Prizes & Stipends' },
    { value: '98%', label: 'AI Match Accuracy' },
  ];

  const features = [
    {
      icon: <Sparkles className="text-indigo-500" size={24} />,
      title: 'Intelligent Match Engine',
      description: 'Input your technical skills, career goals, and academic background to instantly see custom compatibility scores.'
    },
    {
      icon: <Search className="text-indigo-500" size={24} />,
      title: 'Unified Search & Filters',
      description: 'Search through hundreds of hackathons, internships, fellowships, and scholarships in one single premium interface.'
    },
    {
      icon: <Calendar className="text-indigo-500" size={24} />,
      title: 'Smart Deadline Calendar',
      description: 'Never miss an application deadline again. Synchronize bookmarked opportunities with a built-in calendar tracking system.'
    },
    {
      icon: <Trophy className="text-indigo-500" size={24} />,
      title: 'Curated Prize Pools',
      description: 'Easily filter by reward, stipend, grant levels, or difficulty to find opportunities that match your commitment.'
    },
    {
      icon: <TrendingUp className="text-indigo-500" size={24} />,
      title: 'Personalized Learning Paths',
      description: 'For every high-match opportunity with minor skill gaps, we map out specific libraries and courses to cover.'
    },
    {
      icon: <ShieldCheck className="text-indigo-500" size={24} />,
      title: 'Verified Organizers Only',
      description: 'Our academic review board parses and verifies every listing to protect students from spam and non-paying events.'
    }
  ];

  const faqs = [
    {
      q: 'How does the Match Score work?',
      a: 'The OpportunityAI Match Score parses your profile attributes (such as active technical skills, interests, college branch, and career goals) and compares them with the strict eligibility and required skills of over 140+ active indexed records, calculating a percentage matching core.'
    },
    {
      q: 'Is my student profile data secure?',
      a: 'Absolutely. OpportunityAI operates completely client-side in this dashboard. All edited profiles, saved bookmarks, and custom dashboard configurations are persisted securely on your browser\'s local storage.'
    },
    {
      q: 'Can I apply directly within the application?',
      a: 'OpportunityAI aggregates application paths. When you select "Apply Now", we fast-track you with the direct verified organizer endpoint, and track the status in your interactive deadline calendar.'
    },
    {
      q: 'What types of opportunities do you index?',
      a: 'We index six direct academic and professional categories: Hackathons, Internships, Scholarships, Competitions, Fellowships, and Educational Events (workshops & guest lectures).'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Major at Stanford',
      quote: 'Through OpportunityAI, I identified a Google Scholarship and an open Web3 hackathon matching my exact stack. I received the grant and met my current co-founders!',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&h=128&fit=crop'
    },
    {
      name: 'Aditya Shinde',
      role: 'Junior Data Analyst at IIT Bombay',
      quote: 'The AI match identified a critical Python skill gap on a high-paying machine learning internship. The suggested training path helped me lock down the role in 3 weeks.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      
      {/* HEADER / NAVIGATION BAR */}
      <nav className="sticky top-0 w-full h-18 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-950 to-indigo-600 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
              OpportunityAI
            </span>
            <p className="text-[9px] -mt-1 tracking-widest text-indigo-500 uppercase font-mono font-bold">Empower Your Path</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
          <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Success Stories</a>
          <a href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            id="landing-theme-toggle"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link 
            to="/login" 
            id="landing-login-btn"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            id="landing-cta-btn"
            className="px-4.5 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 overflow-hidden px-6 lg:px-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Hero text */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/20 shadow-sm">
              <Sparkles size={13} />
              <span>Smart matching for academic success</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
              Find the Right <br className="hidden md:block" /> Opportunity at the <br />
              <span className="text-indigo-600 dark:text-indigo-400">Right Time.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              Stop scouring endless forums. Instantly match with verified Hackathons, Internships, Scholarships, and Fellowships custom-fitted to your tech skills and academic goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/register" 
                id="hero-register-btn"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 font-semibold transition-all shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Find Your Match</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 sm:group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                to="/discover" 
                id="hero-discover-btn"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-350 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowUpRight size={17} />
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg md:max-w-none mx-auto lg:mx-0">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-left">
                  <span className="block font-display text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CSS-Art App Illustration */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-float-slow">
            <div className="glass-panel rounded-2xl p-4 md:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative z-10 glow-indigo bg-white/70 dark:bg-slate-950/70">
              {/* App frame elements */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/80 mb-4.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 ml-4">opportunity_dashboard.tsx</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-mono font-bold">
                  96% MATCH
                </div>
              </div>

              {/* Simulated UI layout */}
              <div className="space-y-4">
                {/* Visual Card */}
                <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 uppercase">HACKATHON</span>
                      <h3 className="text-sm font-semibold dark:text-white mt-1">Stripe Global Fintech Hackathon</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Stripe Developer Network • San Francisco / Remote</p>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold font-mono">
                      $15,000 Prize
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/30">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-medium">React</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 font-medium">TypeScript</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">GraphQL</span>
                  </div>
                </div>

                {/* Secondary list skeleton */}
                <div className="space-y-2.5">
                  <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg p-2 flex items-center justify-between border border-slate-200/20 dark:border-slate-800/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <div className="w-10 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-10 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg p-2 flex items-center justify-between border border-slate-200/20 dark:border-slate-800/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-10 h-2 bg-slate-300 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-10 bg-indigo-500/5 rounded-lg p-2 flex items-center justify-between border border-indigo-500/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <div className="w-10 h-2 bg-indigo-500/30 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="p-3 bg-slate-100/30 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-mono text-slate-400">Live Match Telemetry</p>
                    <div className="h-3.5 overflow-hidden flex gap-1 items-end mt-1.5 pb-0.5">
                      <div className="w-2 bg-indigo-500/30 h-1/3 rounded-t"></div>
                      <div className="w-2 bg-indigo-500/40 h-1/2 rounded-t"></div>
                      <div className="w-2 bg-indigo-500/60 h-3/4 rounded-t"></div>
                      <div className="w-2 bg-indigo-500 h-full rounded-t"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-500 font-bold block">Next Deadline</span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mt-0.5">June 22, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Absolute decorative stats badges floating */}
            <div className="absolute -top-6 -right-6 glass-panel p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Verified Status</span>
                <span className="text-xs font-bold font-mono text-emerald-500 uppercase">100% Secure</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 glass-panel p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Global Reach</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">Active in 80+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-indigo-500 uppercase font-mono tracking-widest block bg-indigo-500/10 px-3 py-1 rounded-full w-max mx-auto">Core Capabilities</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold dark:text-white">Designed for High-Impact Students.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Say goodbye to generic job sites. OpportunityAI is built from the ground up to support academic, financial, leadership, and operational milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="p-6 md:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:-translate-y-1 hover:border-indigo-500/25 dark:hover:border-indigo-500/25 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 px-6 lg:px-12 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-indigo-500 uppercase font-mono tracking-widest block bg-indigo-500/10 px-3 py-1 rounded-full w-max mx-auto">IMPACT REPORT</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold dark:text-white">What Future Leaders Say.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Over 10,000 undergraduate and graduate students globally use OpportunityAI to secure stipends, internships, and build tech projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6.5 md:p-8 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg flex flex-col md:flex-row gap-5">
                <img 
                  src={test.img} 
                  alt={test.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/20"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-350 text-sm italic font-medium leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{test.name}</span>
                    <span className="text-xs text-indigo-500/80 font-semibold">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-bold text-indigo-500 uppercase font-mono tracking-widest block bg-indigo-500/10 px-3 py-1 rounded-full w-max mx-auto">SUPPORT HUBS</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle size={18} className="text-slate-400 flex-shrink-0" />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-250/20 dark:border-slate-800/50 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-indigo-900 to-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#6366f120,transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Ready to Land Your Dream <br />Opportunity?</h2>
          <p className="text-indigo-200/80 max-w-xl mx-auto text-sm md:text-base font-sans">
            Instantly set up your dashboard, upload your tech skills, and let our custom Match Score organize your pathway to scholarships and key sponsorships.
          </p>
          <div className="flex justify-center pt-2">
            <Link 
              to="/register" 
              id="cta-register-bottom-btn"
              className="px-7 py-4 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 font-bold transition-all shadow-xl shadow-black/20 flex items-center gap-2 group cursor-pointer"
            >
              <span>Unlock Dashboard Access</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 lg:px-12 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-500 text-center border-t border-slate-200/60 dark:border-slate-850/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
              <GraduationCap size={16} />
            </div>
            <span className="font-display font-semibold text-slate-800 dark:text-slate-350 text-sm">OpportunityAI</span>
          </div>

          <p className="text-xs">&copy; 2026 OpportunityAI Hub. Crafted with pride. All Rights Reserved.</p>

          <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-600">
            <a href="#" className="hover:text-indigo-500">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-500">Terms of Use</a>
            <a href="#" className="hover:text-indigo-500">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

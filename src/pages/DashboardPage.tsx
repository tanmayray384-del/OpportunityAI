import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getDifficultyColor, getCategoryIconColor, formatPrizeInINR } from '../data/opportunities';
import { 
  Trophy, 
  Bookmark, 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Zap,
  Activity,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Workflow
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { profile, bookmarks, appliedList } = useApp();

  // Pick premium recommended opportunities matching user skills, location, and interests
  const scoredOpportunities = OPPORTUNITIES.map((opp) => {
    // 1. Skills score
    const totalSkills = opp.requiredSkills.length;
    const skillsMatched = opp.requiredSkills.filter((s) =>
      profile.skills.some((ps) => ps.toLowerCase() === s.toLowerCase())
    ).length;
    const skillsScore = totalSkills > 0 ? (skillsMatched / totalSkills) * 50 : 20;

    // 2. Location score (Online = high; local offline/hybrid = absolute high)
    let locationScore = 0;
    if (opp.mode === 'Online') {
      locationScore = 40;
    } else {
      const userCity = profile.city?.toLowerCase() || '';
      const userState = profile.state?.toLowerCase() || '';
      const userCountry = profile.country?.toLowerCase() || '';

      const oppCity = opp.city?.toLowerCase() || '';
      const oppState = opp.state?.toLowerCase() || '';
      const oppCountry = opp.country?.toLowerCase() || '';

      if (oppCity === userCity && userCity !== '') {
        locationScore = 50;
      } else if (oppState === userState && userState !== '') {
        locationScore = 35;
      } else if (oppCountry === userCountry && oppCountry !== '') {
        locationScore = 20;
      } else {
        locationScore = 5;
      }
    }

    // 3. Interests matching score (overlaps with tags)
    const overlapsInterest = opp.tags.some((tag) =>
      profile.interests.some(
        (interest) =>
          interest.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    const interestScore = overlapsInterest ? 10 : 0;

    const matchPercent = Math.min(100, Math.round(skillsScore + locationScore + interestScore));

    return {
      ...opp,
      matchPercent,
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);

  const finalRecommended = scoredOpportunities.slice(0, 3);

  // Trending picks
  const trending = OPPORTUNITIES.filter(o => o.difficulty === 'Intermediate' || o.difficulty === 'Advanced').slice(10, 13);

  // Upcoming deadlines of saved opportunities, or general soonest deadlines
  const savedOpps = OPPORTUNITIES.filter(o => bookmarks.includes(o.id));
  const deadlineQueue = (savedOpps.length > 0 ? savedOpps : OPPORTUNITIES)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  // Calculate generic Opportunity Score based on matching criteria
  const oppScore = 88; // Static high-impact visual representation

  // Recharts Chart Data (weekly telemetry clicks or application tracking)
  const chartData = [
    { name: 'Mon', clicks: 24, applications: 1 },
    { name: 'Tue', clicks: 38, applications: 0 },
    { name: 'Wed', clicks: 15, applications: 2 },
    { name: 'Thu', clicks: 45, applications: 1 },
    { name: 'Fri', clicks: 30, applications: 3 },
    { name: 'Sat', clicks: 58, applications: 0 },
    { name: 'Sun', clicks: 40, applications: 1 },
  ];

  // Activities logs
  const activities = [
    { text: 'Completed questionnaire for "AI Match"', date: 'Today, 2:40 PM', type: 'ai' },
    { text: 'Bookmarked "Adobe Design Excellence Scholars"', date: 'Yesterday, 10:15 AM', type: 'bookmark' },
    { text: 'Applied for "Global Generative AI Hackathon"', date: 'June 16, 2026', type: 'apply' },
    { text: 'Set up appearance and notification preferences', date: 'June 15, 2026', type: 'setting' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* WELCOME BANNER & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-100 dark:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6366f120,transparent_55%)]"></div>
          <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold tracking-wide backdrop-blur-md">
                <Sparkles size={12} className="text-amber-400" />
                <span>AI Insights Activated</span>
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Unlock your academic milestones, {profile.name.split(' ')[0]}!
              </h2>
              <p className="text-sm text-indigo-200/80 max-w-lg">
                Your profile matches 42 key scholar fellowships, internships, and hackathons this month. Apply before deadlines expire.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link
                to="/ai-match"
                id="dash-welcome-ai-match-btn"
                className="px-4.5 py-2.5 rounded-xl bg-indigo-500 font-bold text-white text-xs hover:bg-indigo-650 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-505/20 border border-indigo-400/20"
              >
                <Sparkles size={13} />
                <span>Run Instant AI Match</span>
              </Link>
              <Link
                to="/discover"
                id="dash-welcome-discover-btn"
                className="px-4.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/15 font-bold text-white text-xs transition-colors border border-white/10"
              >
                Explore Active Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Opportunity Match Score Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-md shadow-slate-100/40 dark:shadow-none flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Opportunity Fit Score</h3>
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Activity size={16} />
            </span>
          </div>

          <div className="flex items-end gap-5 py-2">
            <div className="relative flex items-center justify-center">
              {/* Circular gauge */}
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" className="stroke-indigo-500 fill-none" strokeWidth="6" strokeDasharray="213" strokeDashoffset={213 - (213 * oppScore) / 100} strokeLinecap="round" />
              </svg>
              <span className="absolute font-display text-xl font-bold dark:text-white">{oppScore}%</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-850 dark:text-white flex items-center gap-1">
                <Zap size={12} className="text-amber-500" /> Great Match Status
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                Based on your {profile.skills.length} skills, computer engineering branch and location requirements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-4.5 mt-4 text-center">
            <div>
              <span className="block font-display text-lg font-bold text-indigo-600 dark:text-indigo-400">{bookmarks.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Saved</span>
            </div>
            <div className="border-x border-slate-100 dark:border-slate-850">
              <span className="block font-display text-lg font-bold text-slate-800 dark:text-white">{appliedList.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Applied</span>
            </div>
            <div>
              <span className="block font-display text-lg font-bold text-emerald-500">140</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Total</span>
            </div>
          </div>
        </div>

      </div>

      {/* QUICK STATS RAIL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-4.5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Trophy size={18} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Applied Milestones</span>
            <span className="block font-display text-lg font-bold dark:text-white mt-0.5">{appliedList.length} Opportunities</span>
          </div>
        </div>

        <div className="p-4.5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Bookmark size={18} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Saved Lists</span>
            <span className="block font-display text-lg font-bold dark:text-white mt-0.5">{bookmarks.length} Records</span>
          </div>
        </div>

        <div className="p-4.5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Under Review</span>
            <span className="block font-display text-lg font-bold dark:text-white mt-0.5">{appliedList.length} Active</span>
          </div>
        </div>

        <div className="p-4.5 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle size={18} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">System Sourcing</span>
            <span className="block font-display text-lg font-bold dark:text-white mt-0.5">Real-time Sourced</span>
          </div>
        </div>
      </div>

      {/* MID SECTION: CHARTS & LOG DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Recharts Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/80 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-semibold text-base dark:text-white">Weekly Activity</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Mock telemetry log showing platform interactions and detail click counts</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              <TrendingUp size={13} />
              <span>+18% From Last Week</span>
            </div>
          </div>

          <div className="h-64 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card & Quick Action Drawer */}
        <div className="space-y-6">
          {/* AI Advisor Insight */}
          <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent/5 dark:bg-slate-900/20 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Sparkles size={16} />
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-350 uppercase tracking-widest font-mono">Personal AI Advisor</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold dark:text-white">Perfect your TypeScript Fine-Tuning Gap</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                  "Based on your bookmarked hackathons, Stripe is looking for <strong>React</strong> developers who understand <strong>TypeScript</strong> typing. We recommend adding 'REST APIs' to your profile to bump your Match Score to 95%."
                </p>
              </div>
            </div>

            <Link
              to="/ai-match"
              id="dash-ai-advisor-insight-link"
              className="mt-6 text-xs text-indigo-500 flex items-center gap-1 font-semibold hover:underline"
            >
              <span>View custom learning path</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to="/discover" 
                className="p-3 rounded-xl bg-slate-55/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/80 hover:border-indigo-500/20 text-center transition-all cursor-pointer group"
              >
                <span className="block text-xs font-bold dark:text-white group-hover:text-indigo-500">Find Internships</span>
              </Link>
              <Link 
                to="/calendar" 
                className="p-3 rounded-xl bg-slate-15/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/80 hover:border-indigo-500/20 text-center transition-all cursor-pointer group"
              >
                <span className="block text-xs font-bold dark:text-white group-hover:text-indigo-500">Check Deadlines</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* RECOMMENDED OPPORTUNITIES GRID */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg dark:text-white">Recommended for Your Skills</h3>
            <p className="text-xs text-slate-400 mt-1">Based on the {profile.skills.slice(0, 4).join(', ')} skills listed in your profile</p>
          </div>
          <Link to="/discover" className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalRecommended.map((opp) => {
            const isBookmarked = bookmarks.includes(opp.id);
            return (
              <div 
                key={opp.id} 
                className="p-5.5 rounded-2xl bg-white border border-slate-200/60 dark:bg-slate-900/30 dark:border-slate-800/85 flex flex-col justify-between hover:shadow-lg transition-all border-l-4 border-l-indigo-500 relative"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded uppercase ${getCategoryIconColor(opp.category)}`}>
                        {opp.category}
                      </span>
                      {opp.isNew && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider bg-rose-500 text-white rounded uppercase animate-pulse">
                          New
                        </span>
                      )}
                      {opp.city?.toLowerCase() === profile.city?.toLowerCase() && opp.mode !== 'Online' && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded uppercase">
                          📍 Nearby ({opp.distance ? `${opp.distance}km` : 'Local'})
                        </span>
                      )}
                      {opp.state?.toLowerCase() === profile.state?.toLowerCase() && opp.city?.toLowerCase() !== profile.city?.toLowerCase() && opp.mode !== 'Online' && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded uppercase">
                          📍 In-State
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-indigo-550 font-mono">
                      {opp.matchPercent}% FIT MATCH
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm dark:text-white hover:text-indigo-505 transition-colors line-clamp-1">
                      <Link to={`/discover/${opp.id}`}>{opp.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{opp.organization}</p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed leading-normal">{opp.description}</p>
                </div>

                {/* Card footer metrics */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 font-extrabold text-slate-700 dark:text-slate-350 text-xs truncate max-w-[150px]" title={opp.prize}>
                      <Trophy size={12} className="text-amber-500 flex-shrink-0" />
                      {formatPrizeInINR(opp.prize)}
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-[10px]" title={`Apply before ${opp.deadline}`}>
                      <Clock size={11} className="text-slate-400" /> {opp.deadline}
                    </span>
                  </div>

                  {/* Location Scope with Travel & Distance indicators */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1 font-bold text-slate-555 dark:text-slate-400 truncate max-w-[130px]">
                      <MapPin size={11.5} className="text-indigo-400" />
                      {opp.city || opp.location}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded-sm text-[8px] font-bold uppercase">
                        {opp.mode}
                      </span>
                      {opp.distance && (
                        <span className="bg-indigo-550/10 text-indigo-500 px-1 rounded-sm text-[8px] font-extrabold">
                          {opp.distance}km
                        </span>
                      )}
                      {opp.travelRequired && (
                        <span className="text-amber-500 bg-amber-500/10 px-1 rounded-sm text-[8px] font-bold">
                          ✈ Travel
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRENDING SECTION & DEADLINE TRACKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trending Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-display font-semibold text-base dark:text-white flex items-center gap-1.5">
              <Flame size={17} className="text-orange-500 animate-pulse" />
              <span>Trending Opportunities</span>
            </h3>
          </div>

          <div className="space-y-3">
            {trending.map((opp) => (
              <div 
                key={opp.id} 
                className="p-4.5 rounded-xl bg-white max-w-full dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850/80 flex items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 p-0.5 px-1.5 rounded truncate uppercase leading-none">{opp.category}</span>
                    <span className="text-[10px] text-slate-550 flex items-center gap-1 font-medium text-slate-400 truncate">
                      <MapPin size={10} /> {opp.location}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold dark:text-white truncate">
                    <Link to={`/discover/${opp.id}`} className="hover:text-indigo-500">{opp.title}</Link>
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{opp.organization}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-500 block">{opp.prize}</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono block">Deadline: {opp.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines log */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-base dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              <span>Your Action Queue</span>
            </h3>

            <div className="space-y-3.5">
              {deadlineQueue.map((opp) => (
                <div key={opp.id} className="flex justify-between items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/discover/${opp.id}`} className="text-xs font-bold text-slate-800 dark:text-white hover:text-indigo-500 transition-colors block truncate">{opp.title}</Link>
                    <span className="text-[10px] text-slate-400 mt-0.5 block truncate">{opp.organization}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono flex-shrink-0">
                    {opp.deadline.split('-').slice(1).join('/')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/calendar"
            id="dash-view-full-calendar-btn"
            className="w-full mt-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-150 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-350 text-xs font-bold flex items-center justify-center gap-1 transition-all"
          >
            <span>Launch Track Calendar</span>
            <ChevronRight size={13} />
          </Link>
        </div>

      </div>

    </div>
  );
};

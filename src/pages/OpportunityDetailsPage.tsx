import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getDifficultyColor, getCategoryIconColor, formatPrizeInINR } from '../data/opportunities';
import { 
  ArrowLeft, 
  MapPin, 
  Trophy, 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  ExternalLink,
  Milestone,
  BookOpen,
  Send,
  Sparkle
} from 'lucide-react';

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookmarks, appliedList, toggleBookmark, applyToOpportunity, profile } = useApp();

  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);

  // Find targeted opportunity
  const opp = useMemo(() => {
    return OPPORTUNITIES.find(item => item.id === id);
  }, [id]);

  // Related opportunities from the same category
  const relatedOpps = useMemo(() => {
    if (!opp) return [];
    return OPPORTUNITIES.filter(item => item.category === opp.category && item.id !== opp.id).slice(0, 3);
  }, [opp]);

  if (!opp) {
    return (
      <div className="text-center p-12 max-w-md mx-auto space-y-4">
        <h3 className="font-bold text-lg dark:text-white">Opportunity Not Found</h3>
        <p className="text-xs text-slate-400">The opportunity ID you specified might have expired or does not exist.</p>
        <Link to="/discover" className="btn inline-block bg-indigo-550 h-10 px-4 text-white hover:bg-indigo-600 rounded-xl text-xs font-bold leading-10">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(opp.id);
  const isApplied = appliedList.includes(opp.id);

  // Calculate matching skills score
  const matchedSkillsList = opp.requiredSkills.filter(s => profile.skills.includes(s));
  const missingSkillsList = opp.requiredSkills.filter(s => !profile.skills.includes(s));
  const skillMatchPercent = opp.requiredSkills.length > 0 
    ? Math.round((matchedSkillsList.length / opp.requiredSkills.length) * 100)
    : 75;

  const handleApply = () => {
    applyToOpportunity(opp.id);
    setAppliedSuccessfully(true);
    setTimeout(() => {
      setAppliedSuccessfully(false);
    }, 4500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opp.title,
        text: `Applying for ${opp.title} on OpportunityAI!`,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Details URL copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER SECTION WITH BACK ACTIONS */}
      <div className="flex justify-between items-center">
        <Link 
          to="/discover" 
          id="detail-back-to-catalog"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-650 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Catalyst Catalog</span>
        </Link>

        <div className="flex gap-2">
          {/* Bookmark Trigger */}
          <button
            onClick={() => toggleBookmark(opp.id)}
            id="detail-bookmark-trigger"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          
          {/* Share Trigger */}
          <button
            onClick={handleShare}
            id="detail-share-trigger"
            className="p-2.5 rounded-xl border bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 transition-all cursor-pointer"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* CORE INFO HEADER HERO */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-900/30 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded uppercase border ${getCategoryIconColor(opp.category)}`}>
              {opp.category}
            </span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded border ${getDifficultyColor(opp.difficulty)}`}>
              {opp.difficulty} Level
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-xl md:text-3xl font-bold dark:text-white tracking-tight leading-snug">
              {opp.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{opp.organization}</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-xs text-slate-400 font-medium pt-1">
            <span className="flex items-center gap-1 flex-wrap">
              <MapPin size={14} className="text-indigo-400" />
              <span>{opp.city ? `${opp.city}, ${opp.state}, ${opp.country}` : opp.location}</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold uppercase stroke-none text-slate-500 dark:text-slate-400">
                {opp.mode}
              </span>
              {opp.distance && (
                <span className="px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[9px] font-bold">
                  {opp.distance} km away
                </span>
              )}
              {opp.travelRequired && (
                <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-600 text-[9px] font-bold">
                  ✈ Travel Reimbursements Offered
                </span>
              )}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar size={14} className="text-slate-500" />
              Deadline: {opp.deadline}
            </span>
          </div>
        </div>

        {/* APPLY ACTION */}
        <div className="w-full md:w-auto text-center md:text-right space-y-3 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/55 dark:border-slate-850 inline-block text-left md:text-right pr-6 min-w-[180px]">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider font-mono">Grant Value & Stipend</span>
            <span className="text-base font-bold text-emerald-500 mt-1 block">{formatPrizeInINR(opp.prize)}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono italic block mt-0.5">Original: {opp.prize}</span>
          </div>

          <div>
            {isApplied ? (
              <button
                disabled
                id="detail-apply-started-btn"
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 font-semibold text-sm transition-all border border-transparent cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle size={15} />
                <span>Application Submitted</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                id="detail-apply-now-btn"
                className="w-full md:w-auto px-7 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 font-semibold text-sm transition-all shadow-md shadow-indigo-605/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply Instantly</span>
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS ALERTS OVERLAYS */}
      {appliedSuccessfully && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center justify-between gap-4 animate-float-mid">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>Success! Application registered. We've pushed a calendar check and notified your notifications feed.</span>
          </div>
          <Link to="/calendar" className="underline font-bold hover:text-emerald-400">View Calendar</Link>
        </div>
      )}

      {/* TWO COLUMN GRID DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main description, Criteria, timeline) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Paragraph */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-900/30 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-display font-bold text-base dark:text-white">Role Overview & Objective</h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans mt-2">
              {opp.description}
            </p>
          </div>

          {/* Benefits Bulletins */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-900/30 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-semibold text-base dark:text-white">Core Student Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5Column">
              {opp.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={11} className="stroke-[2.5]" />
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Requirements */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-900/30 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-semibold text-base dark:text-white">Candidate Eligibility</h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed leading-normal mt-1.5">
              {opp.eligibility}
            </p>
          </div>

          {/* Chronological Timeline Tracker */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-900/30 dark:border-slate-800 space-y-6">
            <h3 className="font-display font-semibold text-base dark:text-white flex items-center gap-2">
              <Milestone size={17} className="text-indigo-505" />
              <span>Chronological Event Milestone Tracker</span>
            </h3>

            {/* Vertical timeline visual */}
            <div className="relative pl-6 space-y-6 border-l border-slate-200 dark:border-slate-800 ml-2">
              {opp.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-indigo-505 flex items-center justify-center text-[10px] font-bold text-indigo-500">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold dark:text-white block">{item.event}</span>
                    <span className="text-[11px] font-semibold text-slate-400 font-mono mt-1 block">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Skills Analysis & Application process summary) */}
        <div className="space-y-6">
          
          {/* AI Compatibility / Skills check */}
          <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-505/5 to-transparent/5 dark:bg-slate-905/20 space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-indigo-500/10 text-indigo-505">
                  <Sparkles size={15} />
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-350 font-mono tracking-widest uppercase">Match Analysis</span>
              </div>
              <span className="text-xs font-bold font-mono text-indigo-500">{skillMatchPercent}% Match</span>
            </div>

            {/* Skills gauges */}
            <div className="space-y-4.5">
              
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${skillMatchPercent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                  Compared with {profile.skills.length} skills listed on your professional profile.
                </span>
              </div>

              {/* Matched skills lists */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Matched Competencies</span>
                <div className="flex flex-wrap gap-1">
                  {matchedSkillsList.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      ✓ {skill}
                    </span>
                  ))}
                  {matchedSkillsList.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic">No skills match yet. Update profile skills!</span>
                  )}
                </div>
              </div>

              {/* Missing skills */}
              {missingSkillsList.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-xs font-bold text-slate-705 dark:text-slate-300 block">Identified Technical Gap</span>
                  <div className="flex flex-wrap gap-1">
                    {missingSkillsList.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                        ? {skill}
                      </span>
                    ))}
                  </div>

                  <Link 
                    to="/ai-match" 
                    id="detail-missing-skills-ai-match-link"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 hover:underline pt-2"
                  >
                    <Sparkle size={10} className="text-amber-400 animate-pulse" />
                    <span>Generate AI learning pathway to cover gaps</span>
                  </Link>

                </div>
              )}

            </div>
          </div>

          {/* Quick Checklist Application Steps */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/85 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">Application Routine</h4>
            <div className="space-y-3 font-sans text-xs text-slate-600 dark:text-slate-400">
              <div className="flex gap-2">
                <span className="font-bold text-indigo-500">Step 1:</span>
                <span>Confirm you meet all candidate eligibility guidelines listed above.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-500">Step 2:</span>
                <span>Ensure your Resume is uploaded and sync is configured correctly.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-500">Step 3:</span>
                <span>Submit standard application. Tracking in Calendar commences automatically.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RELATED OPPORTUNITIES ELEMENT */}
      {relatedOpps.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-850 space-y-6">
          <h3 className="font-display font-bold text-base dark:text-white">Related {opp.category}s You Might Like</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedOpps.map((related) => (
              <div 
                key={related.id} 
                className="p-4.5 rounded-xl bg-white dark:bg-slate-900/20 border border-slate-205/50 dark:border-slate-850/80 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 truncate uppercase block w-max">
                    {related.difficulty}
                  </span>
                  <h4 className="text-xs font-bold dark:text-white truncate">
                    <Link to={`/discover/${related.id}`} className="hover:text-indigo-500 transition-colors">{related.title}</Link>
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate font-semibold">{related.organization}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-850/50 flex justify-between items-center text-[10px]">
                  <span className="font-bold text-emerald-500">{related.prize}</span>
                  <span className="text-slate-400 font-mono">{related.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

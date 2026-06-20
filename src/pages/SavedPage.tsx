import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getDifficultyColor, getCategoryIconColor } from '../data/opportunities';
import { Bookmark, MapPin, Award, Clock, ArrowRight, Info, BookmarkCheck } from 'lucide-react';

export const SavedPage: React.FC = () => {
  const { bookmarks, toggleBookmark } = useApp();

  // Filter bookmarked list from overall catalog
  const savedList = OPPORTUNITIES.filter(opp => bookmarks.includes(opp.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Summary */}
      <div>
        <h2 className="font-display font-bold text-2xl dark:text-white flex items-center gap-2">
          <Bookmark className="text-indigo-500" />
          <span>Saved Opportunities</span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Review, sort, and apply to your {savedList.length} bookmarked opportunities.
        </p>
      </div>

      {savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((opp) => (
            <div 
              key={opp.id} 
              className="glass-panel rounded-2xl p-6 border border-slate-205/60 dark:border-slate-800 bg-white/75 dark:bg-slate-900/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Category header and Bookmark controls */}
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider rounded uppercase border ${getCategoryIconColor(opp.category)}`}>
                    {opp.category}
                  </span>
                  
                  <button
                    onClick={() => toggleBookmark(opp.id)}
                    className="p-1.8 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-550/20 cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <BookmarkCheck size={14} />
                  </button>
                </div>

                {/* Main Titles */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm dark:text-white line-clamp-1 hover:text-indigo-550 transition-colors">
                    <Link to={`/discover/${opp.id}`}>{opp.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">{opp.organization}</p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Mini skill pill arrays */}
                <div className="flex flex-wrap gap-1">
                  {opp.requiredSkills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450">
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Bottom footer specs */}
              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-850/60 space-y-4">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-slate-705 dark:text-slate-350 font-bold text-xs">
                    <Award size={13} className="text-amber-500" strokeWidth="2.5" />
                    {opp.prize}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={11} />
                    {opp.deadline}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/discover/${opp.id}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-slate-705 bg-slate-100 hover:bg-slate-200/60 dark:bg-slate-950 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty States */
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/80 max-w-sm mx-auto space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-505 rounded-full flex items-center justify-center mx-auto">
            <Bookmark size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold dark:text-white">Your Saved Board is Clean</h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              Bookmark deadlines from the Catalyst Catalog to keep your milestones synchronized.
            </p>
          </div>
          <Link 
            to="/discover" 
            id="saved-explore-catalog-btn"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer-all"
          >
            <span>Explore Catalyst Catalog</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

    </div>
  );
};

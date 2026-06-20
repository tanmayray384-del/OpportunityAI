import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getCategoryIconColor } from '../data/opportunities';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  AlertCircle,
  HelpCircle,
  Trophy
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { bookmarks, appliedList } = useApp();

  // Selected calendar day (defaults to 18th since current date is June 18th, 2026!)
  const [selectedDay, setSelectedDay] = useState<number>(18);

  // Month guidelines
  const currentMonthName = 'June 2026';
  const startOffsetDays = 0; // June 1st, 2026 starts on a Monday!
  const totalDays = 30; // June has 30 days

  // Pull deadlines mapped into June 2026
  const juneDeadlines = useMemo(() => {
    return OPPORTUNITIES.filter(opp => {
      if (!opp.deadline.startsWith('2026-06')) return false;
      return true;
    }).map(opp => {
      const day = parseInt(opp.deadline.split('-')[2], 10);
      const isSaved = bookmarks.includes(opp.id);
      return { ...opp, day, isSaved };
    });
  }, [bookmarks]);

  // Click handler to select and load details
  const activeDayDeadlines = useMemo(() => {
    return juneDeadlines.filter(item => item.day === selectedDay);
  }, [juneDeadlines, selectedDay]);

  // Calendar cells builder array
  const calendarCells = useMemo(() => {
    const cells = [];
    // Prefix empty slots
    for (let i = 0; i < startOffsetDays; i++) {
      cells.push({ day: null, hasDeadline: false, isSaved: false });
    }
    // Days
    for (let d = 1; d <= totalDays; d++) {
      const dayDeadlines = juneDeadlines.filter(item => item.day === d);
      const hasDeadline = dayDeadlines.length > 0;
      const isSaved = dayDeadlines.some(item => item.isSaved);
      cells.push({ day: d, hasDeadline, isSaved, count: dayDeadlines.length });
    }
    return cells;
  }, [juneDeadlines]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="font-display font-bold text-2xl dark:text-white flex items-center gap-2.5">
          <CalendarIcon className="text-indigo-500" />
          <span>Interactive Milestone Calendar</span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Synchronize application windows. Click on any date containing high-fit milestones to reveal submission instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CALENDAR MONTH GRID ELEMENT */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/60 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-105/50 dark:border-slate-850">
            <span className="font-display font-bold text-base dark:text-white">{currentMonthName}</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1.5 rounded-lg border border-transparent hover:bg-slate-50 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <button disabled className="p-1.5 rounded-lg border border-transparent hover:bg-slate-50 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Titles */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold font-mono text-slate-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days cells */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarCells.map((cell, idx) => {
              if (cell.day === null) {
                return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20 dark:bg-slate-950/20 rounded-xl border border-transparent" />;
              }

              const isSelected = selectedDay === cell.day;
              return (
                <button
                  key={`day-${cell.day}`}
                  onClick={() => setSelectedDay(cell.day!)}
                  id={`calendar-day-btn-${cell.day}`}
                  className={`aspect-square rounded-xl border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 shadow-md shadow-indigo-500/20'
                      : cell.isSaved
                        ? 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400'
                        : cell.hasDeadline
                          ? 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-150 text-slate-800 dark:text-slate-205 border-transparent'
                          : 'bg-white dark:bg-slate-950/20 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-bold font-mono">{cell.day}</span>
                  {cell.hasDeadline && (
                    <span className={`w-1.5 h-1.5 rounded-full self-end ${isSelected ? 'bg-white' : cell.isSaved ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend guidelines */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-850/80 text-[10px] font-semibold text-slate-455 uppercase tracking-wide font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500/15 border border-indigo-550/20"></span>
              <span className="dark:text-slate-400">Saved Target Deadline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800"></span>
              <span className="dark:text-slate-400">Other Catalog Deadlines</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600 dark:bg-indigo-500"></span>
              <span className="dark:text-slate-400">Selected Day</span>
            </div>
          </div>
        </div>

        {/* SIDE BAR ACTIVE DETAILS DROPDOWN */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-h-[350px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
                <h3 className="font-display font-bold text-sm dark:text-white flex items-center gap-2">
                  <Clock size={16} className="text-indigo-500" />
                  <span>June {selectedDay} Deadlines</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold font-mono dark:text-white">
                  {activeDayDeadlines.length} Match{activeDayDeadlines.length === 1 ? '' : 'es'}
                </span>
              </div>

              {activeDayDeadlines.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {activeDayDeadlines.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl border space-y-2.5 ${
                        item.isSaved 
                          ? 'border-indigo-500/25 bg-indigo-500/5' 
                          : 'border-slate-200/50 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/20'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.2 text-[8px] font-bold tracking-wider rounded uppercase ${getCategoryIconColor(item.category)}`}>
                            {item.category}
                          </span>
                          {item.isSaved && (
                            <span className="text-[9px] font-bold text-indigo-500 uppercase font-mono">My Target</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold dark:text-white leading-normal hover:text-indigo-500 transition-colors">
                          <Link to={`/discover/${item.id}`}>{item.title}</Link>
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{item.organization}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-100 dark:border-slate-850/50 pt-2">
                        <span className="flex items-center gap-0.5 text-slate-750 dark:text-slate-350 font-bold"><Trophy size={11} className="text-amber-500" /> {item.prize}</span>
                        <span className="flex items-center gap-0.5"><MapPin size={9} /> {item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state of selected day */
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-850  rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <AlertCircle size={18} />
                  </div>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-normal">
                    No active targets or academic deadlines scheduled on June {selectedDay}. Select a highlighted day on the calendar.
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/discover"
              className="w-full py-2.5 mt-6 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-605/10"
            >
              <span>Explore Roles Catalyst</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

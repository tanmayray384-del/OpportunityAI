import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex items-center justify-center p-6 relative overflow-hidden text-center transition-colors">
      
      {/* Background visual meshes */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-500/5 dark:bg-pink-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-md space-y-6 relative z-10">
        <div className="flex justify-center flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md mx-auto">
            <GraduationCap size={24} />
          </div>
          <span className="font-display font-bold text-lg text-slate-800 dark:text-slate-350">OpportunityAI</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-7xl font-bold text-indigo-500 font-mono tracking-tight">404</h1>
          <h2 className="text-xl font-bold dark:text-white">Milestone Pathway Expired</h2>
          <p className="text-xs text-slate-500 dark:text-slate-450 max-w-sm mx-auto leading-relaxed">
            The opportunity, dynamic path, or dashboard route you are looking for does not exist on this student portal session.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            id="notfound-dashboard-link"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-705 dark:bg-indigo-500 text-white hover:bg-indigo-600 font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Return to Student Dashboard</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

    </div>
  );
};

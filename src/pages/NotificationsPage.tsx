import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Info,
  Calendar
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification 
  } = useApp();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return (
          <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <Calendar size={16} />
          </span>
        );
      case 'match':
        return (
          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-505">
            <Sparkles size={16} />
          </span>
        );
      default:
        return (
          <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Info size={16} />
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl dark:text-white flex items-center gap-2.5">
            <Bell className="text-indigo-505" />
            <span>Student Alerts & Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Stay updated with active matches, upcoming deadlines, and platform sync announcements.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            id="notif-mark-all-btn"
            className="text-xs font-bold text-indigo-505 hover:text-indigo-700 bg-indigo-500/10 hover:bg-indigo-500/15 py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all self-start cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Dismiss All Alerts</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3.5">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4.5 rounded-2xl border transition-all flex justify-between items-start gap-4.5 cursor-pointer hover:shadow-sm ${
                n.read 
                  ? 'bg-white/40 dark:bg-slate-900/10 border-slate-200/50 dark:border-slate-850/80 opacity-70' 
                  : 'bg-white dark:bg-slate-900 border-l-4 border-l-indigo-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{n.title}</h3>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans pr-4">{n.description}</p>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1">{n.date}</span>
                </div>
              </div>

              {/* Clear separate item trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification(n.id);
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                title="Delete Alert Item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty dynamic state */
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-204/5a shadow-sm max-w-sm mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center justify-center mx-auto text-slate-405">
            <Bell size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold dark:text-white">Your Alerts feed is clear</h4>
            <p className="text-xs text-slate-400">We will notify you here when newly indexed opportunities trigger dynamic match scores.</p>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Bookmark, 
  Calendar, 
  User, 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X,
  LogOut,
  GraduationCap
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, bookmarks, notifications, profile } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const savedCount = bookmarks.length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/discover', label: 'Discover', icon: <Compass size={19} /> },
    { to: '/ai-match', label: 'AI Match', icon: <Sparkles size={19} className="text-zinc-650" /> },
    { to: '/ai-assistant', label: 'AI Coach', icon: <Sparkles size={19} className="text-amber-500 dark:text-amber-400" /> },
    { to: '/saved', label: 'Saved', icon: <Bookmark size={19} />, badge: savedCount > 0 ? savedCount : undefined },
    { to: '/notifications', label: 'Alerts', icon: <Bell size={19} />, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
    { to: '/calendar', label: 'Calendar', icon: <Calendar size={19} /> },
    { to: '/profile', label: 'Profile', icon: <User size={19} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={19} /> },
  ];

  const handleLogout = () => {
    // Soft logout - redirects to home page, since it's mock
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-800/80 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
                OpportunityAI
              </span>
              <p className="text-[9px] -mt-1 tracking-wider text-indigo-500/80 uppercase font-bold font-mono">Student Hub</p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                id={`sidebar-link-${item.label.toLowerCase()}`}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border-l-[3px] border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:translate-x-0.5'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-sans">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold truncate dark:text-white">{profile.name}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="sidebar-logout-btn"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/5 transition-all text-xs font-medium"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER (TOP NAVIGATION) */}
      <header className="md:hidden sticky top-0 w-full h-15 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between px-4 z-40">
        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
            <GraduationCap size={16} className="stroke-[2.5]" />
          </div>
          <span className="font-display font-bold text-base bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
            OpportunityAI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme}
            id="mobile-theme-toggle"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications Bell */}
          <Link 
            to="/notifications" 
            id="mobile-notif-link"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
          >
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </Link>

          {/* Collapsible Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            id="mobile-hamburger-btn"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN DRAWER PANEL */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-15 max-h-[calc(100vh-3.75rem)] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-45 overflow-y-auto shadow-xl"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  id={`mobile-nav-${item.label.toLowerCase()}`}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <img src={profile.avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium dark:text-white truncate max-w-[120px]">{profile.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-500 flex items-center gap-1 font-semibold"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* DESKTOP TOP BAR (STICKY) */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="hidden md:flex h-16 w-full bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 border-b border-transparent items-center justify-between px-8 z-25">
          <div className="flex items-center">
            <h1 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Welcome back, <span className="text-slate-900 dark:text-white font-bold">{profile.name.split(' ')[0]}</span> 👋
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="desktop-theme-toggle"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm text-slate-505 dark:text-slate-400 transition-all cursor-pointer"
              title="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Notifications Bell with unread counter */}
            <Link
              to="/notifications"
              id="desktop-notif-bell"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-705 shadow-sm text-slate-500 dark:text-slate-400 relative transition-all"
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-rose-500 text-[10px] text-white font-extrabold rounded-full px-1">
                  {unreadNotifCount}
                </span>
              )}
            </Link>

            {/* User Profile Quick Access */}
            <Link
              to="/profile"
              id="desktop-user-avatar-btn"
              className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-1.5 pr-3 rounded-xl shadow-sm hover:border-slate-350 dark:hover:border-slate-700 transition-all"
            >
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-7 h-7 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {profile.name.split(' ')[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* MAIN ROUTE CONTENT CONTAINER */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-around px-2 z-40 shadow-lg shadow-black/10">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              id={`mobile-footer-nav-${item.label.toLowerCase()}`}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 scale-105 font-medium'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[8px] font-extrabold rounded-full bg-indigo-600 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-sans">{item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

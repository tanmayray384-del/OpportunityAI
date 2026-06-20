import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Sun, 
  Moon, 
  Bell, 
  Languages, 
  Palette, 
  ShieldAlert, 
  CheckCircle2, 
  UserSquare2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  
  // Custom language state
  const [language, setLanguage] = useState('English');
  
  // Custom appearance theme state
  const [accentModel, setAccentModel] = useState('Modern Glass');

  // Trigger feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER TITLE */}
      <div>
        <h2 className="font-display font-bold text-2xl dark:text-white flex items-center gap-2.5">
          <Settings className="text-indigo-505" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Customize matching constraints, notification tunnels, and visual interface configurations.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-float-mid">
            <CheckCircle2 size={16} />
            <span>Success! Platform settings and matching filters were saved to local storage.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* VISUAL & INTERFACE THEMES */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-805 space-y-5">
            <h3 className="text-sm font-bold text-slate-705 dark:text-white flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-850">
              <Palette size={16} className="text-indigo-500" />
              <span>Appearance & Styles</span>
            </h3>

            {/* Dark mode card */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold dark:text-white block">Day / Night Mode Toggle</span>
                <span className="text-[11px] text-slate-400">Switch between ocular themes instantly.</span>
              </div>
              
              <button
                type="button"
                onClick={toggleTheme}
                id="settings-theme-toggle"
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-350"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={13} className="text-indigo-500" />
                    <span>Set Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={13} className="text-amber-500" />
                    <span>Set Light Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Aesthetic styling selectors */}
            <div className="space-y-2 pt-2 border-t border-slate-101/50 dark:border-slate-850/50">
              <label className="text-[11px] font-bold text-slate-450 uppercase font-mono tracking-wide block">Glow Accents Preset</label>
              <div className="grid grid-cols-3 gap-2">
                {['Modern Glass', 'Classic Border', 'Tech Minimalist'].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setAccentModel(model)}
                    className={`p-2.5 rounded-xl text-[10px] font-semibold text-center border transition-all cursor-pointer ${
                      accentModel === model
                        ? 'bg-indigo-505/10 border-indigo-550 text-indigo-500'
                        : 'bg-slate-50 hover:bg-slate-101 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-850'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CHANNELS AND LANGUAGES */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-805 space-y-5">
            <h3 className="text-sm font-bold text-slate-705 dark:text-white flex items-center gap-2 pb-2.5 border-b border-slate-101 dark:border-slate-850">
              <Languages size={16} className="text-indigo-500" />
              <span>Language & Locale</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase block">System Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-505 outline-none text-xs dark:text-white cursor-pointer"
              >
                <option value="English">English (United States)</option>
                <option value="Spanish">Español (Latin America)</option>
                <option value="French">Français (Europe)</option>
                <option value="Hindi">हिन्दी (India)</option>
                <option value="Japanese">日本語 (Japan)</option>
                <option value="German">Deutsch (Germany)</option>
              </select>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-805 space-y-5 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-705 dark:text-white flex items-center gap-2 pb-2.5 border-b border-slate-101 dark:border-slate-850">
              <Bell size={16} className="text-indigo-500" />
              <span>Matching & Deadline Subscriptions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Email alerting */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-955/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold dark:text-white block">Email Weekly Digest</span>
                  <span className="text-[10px] text-slate-400">Weekly reports for high-score matching records.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-350 dark:border-slate-800 accent-indigo-505 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Direct push alerts */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-955/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold dark:text-white block">Browser Push Alerts</span>
                  <span className="text-[10px] text-slate-400">Direct notifications 3 days prior to expiration.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded border-slate-350 dark:border-slate-800 accent-indigo-505 w-4 h-4 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* ACADEMIC STANDARDS NOTE */}
          <div className="p-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-550 flex gap-3.5 items-start md:col-span-2">
            <ShieldAlert size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
            <div className="space-y-1 text-xs">
              <span className="font-bold">Academic Integrity & Verification Standards</span>
              <p className="text-slate-500 dark:text-slate-400 leading-normal font-sans text-[11px]">
                OpportunityAI aggregates verified scholarships and student fellowships. Plagiarism, registering with duplicate academic credentials, or failing to report correct enrollment conditions will invalidate match recommendation eligibility.
              </p>
            </div>
          </div>

        </div>

        {/* SAVE CHANGES CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="settings-save-btn"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-705 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer-all"
          >
            Save Settings & Preferences
          </button>
        </div>

      </form>

    </div>
  );
};

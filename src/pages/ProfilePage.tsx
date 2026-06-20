import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getCategoryIconColor } from '../data/opportunities';
import { 
  User, 
  BookOpen, 
  Mail, 
  MapPin, 
  Trophy, 
  Sparkles, 
  Edit, 
  X, 
  CheckCircle,
  Clock,
  Workflow,
  Plus,
  Compass,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchableSelect } from '../components/SearchableSelect';
import { COUNTRIES_DATA } from '../data/locations';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, bookmarks, appliedList } = useApp();
  
  // Modal toggle state
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(profile.name);
  const [editCollegeYear, setEditCollegeYear] = useState(profile.collegeYear);
  const [editBranch, setEditBranch] = useState(profile.branch);
  const [editPreferredLocation, setEditPreferredLocation] = useState(profile.preferredLocation);
  const [editCareerGoal, setEditCareerGoal] = useState(profile.careerGoal);
  const [editSkills, setEditSkills] = useState(profile.skills.join(', '));
  const [editInterests, setEditInterests] = useState(profile.interests.join(', '));
  const [editAchievements, setEditAchievements] = useState(profile.achievements.join(', '));
  const [editCountry, setEditCountry] = useState(profile.country || 'India');
  const [editState, setEditState] = useState(profile.state || 'Karnataka');
  const [editCity, setEditCity] = useState(profile.city || 'Bangalore');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Approximate bounding check for Indian peninsula
            if (lat > 8 && lat < 37 && lng > 68 && lng < 97) {
              setEditCountry('India');
              setEditState('Karnataka');
              setEditCity('Bangalore');
            } else {
              setEditCountry('United States');
              setEditState('California');
              setEditCity('San Francisco');
            }
            setIsDetecting(false);
          }, 1000);
        },
        (error) => {
          console.error("Browser location blocked, fallback to api based details:", error);
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              if (data && data.country_name === 'India') {
                setEditCountry('India');
                setEditState('Maharashtra');
                setEditCity('Mumbai');
              } else if (data && data.country_name === 'United States') {
                setEditCountry('United States');
                setEditState('California');
                setEditCity('San Diego');
              } else {
                setEditCountry('India');
                setEditState('Karnataka');
                setEditCity('Bangalore');
              }
            })
            .catch(() => {
              setEditCountry('India');
              setEditState('Karnataka');
              setEditCity('Bangalore');
            })
            .finally(() => {
              setIsDetecting(false);
            });
        },
        { timeout: 4000 }
      );
    } else {
      setEditCountry('India');
      setEditState('Karnataka');
      setEditCity('Bangalore');
      setIsDetecting(false);
    }
  };

  const handleEditCountryChange = (val: string) => {
    setEditCountry(val);
    const countryObj = COUNTRIES_DATA.find((c) => c.name === val);
    if (countryObj && countryObj.states.length > 0) {
      const firstState = countryObj.states[0];
      setEditState(firstState.name);
      if (firstState.cities.length > 0) {
        setEditCity(firstState.cities[0]);
      } else {
        setEditCity('');
      }
    } else {
      setEditState('');
      setEditCity('');
    }
  };

  const handleEditStateChange = (val: string) => {
    setEditState(val);
    const countryObj = COUNTRIES_DATA.find((c) => c.name === editCountry);
    const stateObj = countryObj?.states.find((s) => s.name === val);
    if (stateObj && stateObj.cities.length > 0) {
      setEditCity(stateObj.cities[0]);
    } else {
      setEditCity('');
    }
  };

  // Resolved lists of saved and applied items
  const savedOpps = OPPORTUNITIES.filter(o => bookmarks.includes(o.id));
  const appliedOpps = OPPORTUNITIES.filter(o => appliedList.includes(o.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      collegeYear: editCollegeYear,
      branch: editBranch,
      preferredLocation: editPreferredLocation,
      careerGoal: editCareerGoal,
      skills: editSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      interests: editInterests.split(',').map(s => s.trim()).filter(s => s.length > 0),
      achievements: editAchievements.split(',').map(s => s.trim()).filter(s => s.length > 0),
      country: editCountry,
      state: editState,
      city: editCity
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER HERO AREA */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6366f115,transparent_50%)]"></div>
        
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-20 h-20 rounded-2xl object-cover border-4 border-indigo-500/20"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5Col">
            <h2 className="font-display font-bold text-2xl tracking-tight dark:text-white">{profile.name}</h2>
            <p className="text-sm text-indigo-200/90 font-medium">
              {profile.collegeYear} • {profile.branch} Major
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-200/70 pt-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {profile.city}, {profile.state}, {profile.country}
              </span>
              <span className="flex items-center gap-1">
                <Workflow size={13} /> Preferred: {profile.preferredLocation === 'Any' ? 'Anywhere' : profile.preferredLocation}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={13} /> {profile.email}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          id="profile-edit-btn"
          className="px-4.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer relative z-10 self-start md:self-auto"
        >
          <Edit size={13} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* CORE PORTFOLIO METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (Active Competency tags/interets) */}
        <div className="space-y-6">
          
          {/* Objective Statement */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-800 p-6 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">Objective</span>
            <p className="text-sm text-slate-800 dark:text-gray-300 font-bold leading-relaxed">
              "{profile.careerGoal}"
            </p>
          </div>

          {/* Technical Skills Pile */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">Technical Skills</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-550 font-bold px-2 py-0.5 rounded-lg">{profile.skills.length} list</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills.map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-semibold text-xs font-sans">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Fields of Interest */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">Core Interests</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-550 font-bold px-2 py-0.5 rounded-lg">{profile.interests.length} fields</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.interests.map(interest => (
                <span key={interest} className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Student Achievements */}
          {profile.achievements.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">Notable Accomplishments</span>
              <div className="space-y-2.5 pt-1">
                {profile.achievements.map((ach, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs font-sans text-slate-600 dark:text-slate-400 leading-normal">
                    <Trophy size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right column (Saved/Applied lists history) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applications history tracker */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-805 space-y-4 shadow-sm">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">Your Active Applications Queue</span>
            
            {appliedOpps.length > 0 ? (
              <div className="space-y-3">
                {appliedOpps.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 flex justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 text-[8px] font-bold tracking-wider rounded uppercase ${getCategoryIconColor(item.category)}`}>
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold dark:text-white truncate">
                          <Link to={`/discover/${item.id}`} className="hover:text-indigo-505">{item.title}</Link>
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">{item.organization}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-500 block">{item.prize}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 font-mono block">Deadline: {item.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic p-4 text-center">No active applications currently registered. Apply immediately to mock opportunities.</p>
            )}
          </div>

          {/* Bookmarks tracking */}
          <div className="p-6 rounded-2xl bg-white border border-slate-205/60 dark:bg-slate-905/30 dark:border-slate-805 space-y-4 shadow-sm">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">Your saved bookmarks</span>
            
            {savedOpps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedOpps.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 p-4 space-y-2">
                    <h4 className="text-xs font-bold dark:text-white truncate">
                      <Link to={`/discover/${item.id}`} className="hover:text-indigo-550">{item.title}</Link>
                    </h4>
                    <p className="text-[10px] text-slate-400">{item.organization}</p>
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-850/50 flex justify-between items-center text-[10px]">
                      <span className="text-emerald-500 font-bold">{item.prize}</span>
                      <span className="text-slate-400 font-mono">End: {item.deadline.split('-').slice(1).join('/')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic p-4 text-center">Your bookmarked lists are currently clean. Add items via the Discover catalog.</p>
            )}
          </div>

        </div>

      </div>

      {/* EDIT PROFILE DIALOG PORTAL MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-float-mid p-6 space-y-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-display font-bold text-base dark:text-white">Edit Academic Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-505 dark:text-slate-400 font-mono uppercase">College Year</label>
                  <select
                    value={editCollegeYear}
                    onChange={(e) => setEditCollegeYear(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white cursor-pointer"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Master's">Master's</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-550 dark:text-slate-400 font-mono uppercase">Branch</label>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">Preferred Location Preference</label>
                <input
                  type="text"
                  value={editPreferredLocation}
                  onChange={(e) => setEditPreferredLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-840 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white"
                  required
                />
              </div>

              {/* Auto-Detect location indicator panel */}
              <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20 px-3.5 py-3 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
                <div className="flex items-center gap-2.5 text-xs">
                  <MapPin className="text-indigo-600 dark:text-indigo-400 animate-pulse" size={16} />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-350 block text-[11px]">Geo-Location Smart Detector</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">Auto-detect country, state, and city</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-[9px] font-bold shadow hover:bg-indigo-700 dark:hover:bg-indigo-650 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isDetecting ? (
                    <>
                      <Loader className="animate-spin" size={10} />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Compass size={11} />
                      <span>Detect Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Searchable Selects for Country -> State -> City */}
              <div className="grid grid-cols-2 gap-4">
                <SearchableSelect
                  id="profile-country-select"
                  label="Country"
                  placeholder="Select country..."
                  options={COUNTRIES_DATA.map((c) => c.name)}
                  value={editCountry}
                  onChange={handleEditCountryChange}
                />
                <SearchableSelect
                  id="profile-state-select"
                  label="State / Province"
                  placeholder="Select state..."
                  options={COUNTRIES_DATA.find((c) => c.name === editCountry)?.states.map((s) => s.name) || []}
                  value={editState}
                  onChange={handleEditStateChange}
                  disabled={!editCountry}
                />
              </div>

              <SearchableSelect
                id="profile-city-select"
                label="City / Locality"
                placeholder="Select city..."
                options={
                  COUNTRIES_DATA.find((c) => c.name === editCountry)
                    ?.states.find((s) => s.name === editState)
                    ?.cities || []
                }
                value={editCity}
                onChange={setEditCity}
                disabled={!editState}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">Career Goal Statement</label>
                <input
                  type="text"
                  value={editCareerGoal}
                  onChange={(e) => setEditCareerGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 font-mono uppercase">Skills (Comma separated)</label>
                <textarea
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white leading-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 dark:text-slate-400 font-mono uppercase">Achievements (Comma separated)</label>
                <input
                  type="text"
                  value={editAchievements}
                  onChange={(e) => setEditAchievements(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850/80 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="profile-modal-save-btn"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile Configuration
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

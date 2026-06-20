import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getCategoryIconColor } from '../data/opportunities';
import { Opportunity } from '../types';
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Award, 
  Settings,
  ChevronRight, 
  GraduationCap, 
  ListTodo, 
  Compass, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Workflow,
  Sparkle
} from 'lucide-react';

interface MatchAnalysis {
  opp: Opportunity;
  percentage: number;
  reason: string;
  matchedSkills: string[];
  missingSkills: string[];
  learningPath: string[];
}

export const AIMatchPage: React.FC = () => {
  const { profile, updateProfile, bookmarks, toggleBookmark } = useApp();

  // Active student profiling state
  const [skillsStr, setSkillsStr] = useState(profile.skills.join(', '));
  const [interestsStr, setInterestsStr] = useState(profile.interests.join(', '));
  const [collegeYear, setCollegeYear] = useState(profile.collegeYear);
  const [branch, setBranch] = useState(profile.branch);
  const [preferredLocation, setPreferredLocation] = useState(profile.preferredLocation);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);

  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true); // Default loaded on launch based on standard profile

  // Programmatic Match Engine
  const matchResults = useMemo<MatchAnalysis[]>(() => {
    // Parse input skills & interests
    const parsedSkills = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedInterests = interestsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    return OPPORTUNITIES.map(opp => {
      // Calculate matching metrics
      const matched = opp.requiredSkills.filter(skill => 
        parsedSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
      );
      const missing = opp.requiredSkills.filter(skill => 
        !parsedSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
      );

      // Category / Interest boost
      let interestBoost = 0;
      parsedInterests.forEach(interest => {
        if (opp.title.toLowerCase().includes(interest.toLowerCase()) || 
            opp.description.toLowerCase().includes(interest.toLowerCase()) ||
            opp.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))) {
          interestBoost += 15;
        }
      });

      // Location match
      let locationBoost = 10;
      if (preferredLocation !== 'Any' && opp.location.toLowerCase() === preferredLocation.toLowerCase()) {
        locationBoost = 25;
      }

      // Calculate base percentage
      const skillRatio = opp.requiredSkills.length > 0 ? (matched.length / opp.requiredSkills.length) : 0.6;
      let score = Math.round((skillRatio * 50) + interestBoost + locationBoost + 25);
      
      // Clamp bounds
      if (score > 98) score = 98;
      if (score < 45) score = 45;

      // Custom advisory text based on category
      let reason = '';
      if (opp.category === 'Hackathon') {
        reason = `Great fit because they require ${opp.requiredSkills.slice(0,2).join('/')} to build prototypes, and aligns with your interest in ${parsedInterests[0] || 'Software development'}.`;
      } else if (opp.category === 'Internship') {
        reason = `Selected because ${opp.organization} is hiring ${branch} grads with background in ${matched[0] || 'general programming'}.`;
      } else if (opp.category === 'Scholarship') {
        reason = `Matches your academic year (${collegeYear}) and provides educational stipends for STEM-related fields.`;
      } else {
        reason = `Excellent opportunity matching your career goal of becoming a ${careerGoal || 'Technology Specialist'}.`;
      }

      // Generate Suggested Learning Pathway for missing skills
      const learningPath: string[] = [];
      if (missing.length > 0) {
        missing.forEach((skill, i) => {
          if (i === 0) {
            learningPath.push(`Build a miniature GitHub repository using ${skill} to handle fundamental logic.`);
          } else if (i === 1) {
            learningPath.push(`Complete the official interactive sandbox tutorials for ${skill}.`);
          } else {
            learningPath.push(`Review top-voted open-source sample templates implementing ${skill}.`);
          }
        });
      } else {
        learningPath.push(`Review advanced design patterns in ${matched[0] || 'your core stack'}.`);
        learningPath.push(`Contribute helper functions directly to peer repositories before application.`);
      }

      return {
        opp,
        percentage: score,
        reason,
        matchedSkills: matched,
        missingSkills: missing,
        learningPath
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Return top 5 high-fitting matches
  }, [skillsStr, interestsStr, collegeYear, branch, preferredLocation, careerGoal]);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setHasRun(false);

    // Sync input profiles to profile context variables
    const parsedSkills = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedInterests = interestsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    updateProfile({
      skills: parsedSkills,
      interests: parsedInterests,
      collegeYear,
      branch,
      preferredLocation,
      careerGoal
    });

    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-550 dark:text-indigo-400" />
            <span>Smart Match Center</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Build and optimize your candidate parameters to compute dynamic multi-metric opportunity fit indexes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CRITERIA FORM */}
        <div className="glass-panel p-6.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/60 h-max space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-850">
            <Settings size={18} className="text-slate-400" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-500 uppercase">Profiling Credentials</h3>
          </div>

          <form onSubmit={handleRunAnalysis} className="space-y-4">
            
            {/* Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Your Technical Skills</label>
              <textarea
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs leading-relaxed dark:text-white"
                placeholder="React, TypeScript, Tailwind CSS, Python, Figma, Git..."
              />
              <span className="text-[10px] text-slate-400 block leading-snug">Separate items using commas. These trigger match score indexing.</span>
            </div>

            {/* Interests */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Fields of Interest</label>
              <input
                type="text"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white"
                placeholder="Artificial Intelligence, Full Stack, Product Design"
              />
            </div>

            {/* University Branch + Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">College Year</label>
                <select
                  value={collegeYear}
                  onChange={(e) => setCollegeYear(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white cursor-pointer"
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
                <label className="text-xs font-bold text-slate-550 dark:text-slate-400 font-mono uppercase tracking-wider block">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Business & Design">Business & Design</option>
                </select>
              </div>
            </div>

            {/* Preferred Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Preferred Location State</label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-xs dark:text-white cursor-pointer"
              >
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid Models</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="London, UK">London, UK</option>
                <option value="Any">Global (Any Location)</option>
              </select>
            </div>

            {/* Career Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Core Career Objective</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-205/60 dark:border-slate-850 rounded-xl focus:border-indigo-550 outline-none text-xs dark:text-white"
                placeholder="e.g. AI Safety Researcher, Lead Frontend Engineer"
              />
            </div>

            <button
              type="submit"
              id="ai-match-submit-btn"
              disabled={isRunning}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Recalculating Match Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-300 animate-pulse" />
                  <span>Update & Match</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: DISCOVERED PATHS AND SCORES */}
        <div className="lg:col-span-2 space-y-6">
          
          {isRunning && (
            <div className="p-8 text-center glass-panel rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500/10 border-t-indigo-505 animate-spin mx-auto"></div>
              <div className="space-y-1">
                <span className="text-sm font-semibold dark:text-white block">Optimizing match vectors</span>
                <p className="text-xs text-slate-400">Parsing eligibility checklists against 140 indexed options...</p>
              </div>
            </div>
          )}

          {hasRun && !isRunning && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                <h3 className="font-display font-bold text-base dark:text-white">Your High-Fidelity Matches</h3>
                <span className="text-xs bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-lg">Top 5 Fits</span>
              </div>

              {matchResults.map((result, idx) => {
                const isSaved = bookmarks.includes(result.opp.id);
                return (
                  <div 
                    key={result.opp.id} 
                    className="p-6 rounded-2xl bg-white border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-805 shadow-sm space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded uppercase ${getCategoryIconColor(result.opp.category)}`}>
                            {result.opp.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{result.opp.organization}</span>
                        </div>
                        <h4 className="font-bold text-base dark:text-white hover:text-indigo-500 transition-colors">
                          <Link to={`/discover/${result.opp.id}`}>{result.opp.title}</Link>
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <MapPin size={12} /> {result.opp.location}
                        </p>
                      </div>

                      {/* Percentage gauge wrapper */}
                      <div className="text-center sm:text-right flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto p-2 bg-indigo-500/5 sm:bg-transparent rounded-lg">
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-display font-bold text-2xl pr-4 sm:pr-0">
                          <Sparkles size={16} className="text-amber-400 animate-pulse" />
                          <span>{result.percentage}%</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">Fit Index</span>
                      </div>
                    </div>

                    {/* Advisor Commentary Quote */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 flex items-start gap-2.5">
                      <Lightbulb size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans mt-0.1">
                        <strong>Advisor rationale:</strong> "{result.reason}"
                      </p>
                    </div>

                    {/* SKILLS GAUGES WITH CHECKBOX PATHWAY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-500 block mb-1.5">✓ Skills You Have Matches</span>
                        <div className="flex flex-wrap gap-1">
                          {result.matchedSkills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                              {skill}
                            </span>
                          ))}
                          {result.matchedSkills.length === 0 && (
                            <span className="text-[10px] text-slate-400 italic">No exact technical overlap yet.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {result.missingSkills.length > 0 ? (
                          <>
                            <span className="text-xs font-bold text-amber-500 block mb-1.5 flex items-center gap-1">
                              <AlertTriangle size={11} /> Skills Gaps Identified
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.missingSkills.map(skill => (
                                <span key={skill} className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-600 dark:text-amber-500">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-left py-2">
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                              <CheckCircle size={14} /> Full Technical Mastery!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INTERACTIVE SUGGESTED LEARNING PATH */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block flex items-center gap-1.5 uppercase font-mono tracking-wide text-[10px]">
                        <Workflow size={13} className="text-indigo-505" /> Suggested Learning Pathways
                      </span>

                      <div className="space-y-2 pl-1.5">
                        {result.learningPath.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                            <span className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                               Phase {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Application Trigger */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-850/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                        <Award size={13} className="text-amber-500" />
                        Value: {result.opp.prize}
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(result.opp.id)}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSaved 
                              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-slate-800'
                          }`}
                        >
                          {isSaved ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        
                        {/* Detail Link */}
                        <Link
                          to={`/discover/${result.opp.id}`}
                          className="flex-1 sm:flex-none px-4 py-2 bg-indigo-650 hover:bg-indigo-705 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1"
                        >
                          <span>Apply Now</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

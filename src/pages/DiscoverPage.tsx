import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OPPORTUNITIES, getDifficultyColor, getCategoryIconColor, formatPrizeInINR } from '../data/opportunities';
import { Opportunity, OpportunityCategory } from '../types';
import { COUNTRIES_DATA } from '../data/locations';
import { SearchableSelect } from '../components/SearchableSelect';
import { 
  Search, 
  MapPin, 
  Award, 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  Info,
  Clock,
  ArrowLeft,
  ArrowRight,
  Map,
  X,
  Compass
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { bookmarks, toggleBookmark, profile } = useApp();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'prize' | 'match'>('deadline');
  
  // Custom manual location exploration states
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');
  const [showAdvanceLocation, setShowAdvanceLocation] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Search suggestions pool
  const suggestions = ['AI', 'React', 'Python', 'Web3', 'Diversity', 'TypeScript', 'Paid', 'Google'];

  // Categories list
  const categories: string[] = ['All', 'Hackathon', 'Internship', 'Scholarship', 'Competition', 'Fellowship', 'Event', 'Workshop', 'Bootcamp', 'Career Fair', 'Training Program'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const modes = ['All', 'Online', 'Offline', 'Hybrid'];

  const resetManualLocation = () => {
    setFilterCountry('');
    setFilterState('');
    setFilterCity('');
  };

  const handleCountryFilterChange = (val: string) => {
    setFilterCountry(val);
    setFilterState('');
    setFilterCity('');
  };

  const handleStateFilterChange = (val: string) => {
    setFilterState(val);
    setFilterCity('');
  };

  // Filter & Search Logic
  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter(opp => {
      // Search matches title, organization, tags, description, or requiredSkills
      const matchesSearch = searchTerm === '' || 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        opp.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || opp.difficulty === selectedDifficulty;
      const matchesMode = selectedMode === 'All' || opp.mode === selectedMode;
      
      let matchesLocation = true;

      if (nearMeOnly) {
        // "Near Me" prioritizes matching registered coordinate and also includes online
        if (opp.mode === 'Online') {
          matchesLocation = true;
        } else {
          const userCountry = profile.country?.toLowerCase() || '';
          const userState = profile.state?.toLowerCase() || '';
          const userCity = profile.city?.toLowerCase() || '';

          const oppCountry = opp.country?.toLowerCase() || '';
          const oppState = opp.state?.toLowerCase() || '';
          const oppCity = opp.city?.toLowerCase() || '';

          // Match on city, state, or country
          matchesLocation = (oppCity === userCity || oppState === userState || oppCountry === userCountry);
        }
      } else {
        // Manual location filters if user wishes to explore other locations specifically
        if (filterCountry) {
          matchesLocation = matchesLocation && (opp.country?.toLowerCase() === filterCountry.toLowerCase());
        }
        if (filterState) {
          matchesLocation = matchesLocation && (opp.state?.toLowerCase() === filterState.toLowerCase());
        }
        if (filterCity) {
          matchesLocation = matchesLocation && (opp.city?.toLowerCase() === filterCity.toLowerCase());
        }
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesMode && matchesLocation;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedMode, nearMeOnly, filterCountry, filterState, filterCity, profile]);

  // Sort Logic
  const sortedOpportunities = useMemo(() => {
    const list = [...filteredOpportunities];
    if (sortBy === 'deadline') {
      return list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'prize') {
      // Sorting by reward amount (extract numeric values)
      const getNum = (str: string) => {
        const match = str.match(/\d+[\d,]*/);
        if (!match) return 0;
        return parseInt(match[0].replace(/,/g, ''), 10);
      };
      return list.sort((a, b) => getNum(b.prize) - getNum(a.prize));
    } else if (sortBy === 'match') {
      // Calculate dynamic match score based on shared skills
      const getMatchScore = (opp: Opportunity) => {
        const shared = opp.requiredSkills.filter(s => profile.skills.includes(s)).length;
        const total = opp.requiredSkills.length;
        return total > 0 ? (shared / total) * 100 : 50;
      };
      return list.sort((a, b) => getMatchScore(b) - getMatchScore(a));
    }
    return list;
  }, [filteredOpportunities, sortBy, profile.skills]);

  // Pagination bounds
  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedOpportunities.slice(start, start + itemsPerPage);
  }, [sortedOpportunities, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (opp: Opportunity, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: opp.title,
        text: `Check out ${opp.title} at ${opp.organization}!`,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(`${opp.title} at ${opp.organization} - Sourced via OpportunityAI`);
      alert('Link copied to clipboard!');
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const getDynamicMatchPercentage = (opp: Opportunity) => {
    const shared = opp.requiredSkills.filter(s => profile.skills.includes(s)).length;
    const total = opp.requiredSkills.length;
    if (total === 0) return 70;
    return Math.round((shared / total) * 40 + 60); // range from 60 to 100
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER SUMMARY */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl dark:text-white">Discover Opportunities</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Showing {filteredOpportunities.length} of {OPPORTUNITIES.length} active scholarships, internships, events and workshops
          </p>
        </div>

        {/* 'Near Me' Toggler */}
        <button
          onClick={() => {
            setNearMeOnly(!nearMeOnly);
            setCurrentPage(1);
            if (!nearMeOnly) {
              // Reset manual override location selectors if user toggles "Near Me"
              resetManualLocation();
            }
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
            nearMeOnly
              ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Compass size={14} className={nearMeOnly ? 'animate-spin-once' : ''} />
          {nearMeOnly ? `Filtering: Near Me (in ${profile.city})` : 'Filter Near Me'}
        </button>
      </div>

      {/* SEARCH AND SUGGESTION DOCKS */}
      <div className="space-y-3 p-5.5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-850/80 shadow-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            id="discover-search-input"
            className="w-full pl-10.5 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-205/50 dark:border-slate-800 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-sm transition-all text-slate-820 dark:text-white"
            placeholder="Search key words, tech stack, colleges, cities..."
          />
        </div>

        {/* Clicks Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-slate-400 font-medium">Quick tags:</span>
          {suggestions.map((term) => (
            <button
              key={term}
              onClick={() => handleSuggestionClick(term)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                searchTerm.toLowerCase() === term.toLowerCase()
                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                  : 'bg-slate-100 hover:bg-slate-200/60 text-slate-655 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-transparent dark:text-slate-350'
              }`}
            >
              #{term}
            </button>
          ))}
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-red-500 font-bold hover:underline ml-1 cursor-pointer text-[11px] font-sans"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR ACTIONS */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          {/* Category togglers */}
          <div className="lg:col-span-3 flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={(() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                })}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-650 text-white dark:bg-indigo-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'All' ? 'All Roles' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Sort Options switcher */}
          <div className="flex items-center justify-end gap-2 text-xs font-semibold bg-white dark:bg-slate-900 p-2 border border-slate-200/50 dark:border-slate-850 rounded-xl">
            <ArrowUpDown size={13} className="text-slate-400" />
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="outline-none bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs"
            >
              <option value="deadline">Soonest Deadline</option>
              <option value="prize">Highest Reward/Stipend</option>
              <option value="match font-bold">Match Percentage</option>
            </select>
          </div>
        </div>

        {/* EXTRA SLIDER FILTERS FOR DIFFICULTY AND LOCATION MODES */}
        <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-850 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase w-20">Difficulty:</span>
              <div className="flex gap-1.5 flex-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/30 dark:border-slate-850'
                    }`}
                  >
                    {diff === 'All' ? 'All' : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Mode Filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase w-20">Mode:</span>
              <div className="flex gap-1.5 flex-1">
                {modes.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMode(m);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedMode === m
                        ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-205/30 dark:border-slate-850'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Manual Location Exploration Selects */}
          <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3">
            <button
              onClick={() => setShowAdvanceLocation(!showAdvanceLocation)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Map size={13} />
              {showAdvanceLocation ? 'Hide Location Explorer' : 'Explore specific cities/locations...'}
            </button>

            {showAdvanceLocation && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900 shadow-inner">
                <SearchableSelect
                  id="discover-filter-country"
                  label="Country Scope"
                  placeholder="All countries"
                  options={COUNTRIES_DATA.map(c => c.name)}
                  value={filterCountry}
                  onChange={handleCountryFilterChange}
                  disabled={nearMeOnly}
                />

                <SearchableSelect
                  id="discover-filter-state"
                  label="State Scope"
                  placeholder="All states"
                  options={COUNTRIES_DATA.find(c => c.name === filterCountry)?.states.map(s => s.name) || []}
                  value={filterState}
                  onChange={handleStateFilterChange}
                  disabled={!filterCountry || nearMeOnly}
                />

                <SearchableSelect
                  id="discover-filter-city"
                  label="City Scope"
                  placeholder="All cities"
                  options={COUNTRIES_DATA.find(c => c.name === filterCountry)?.states.find(s => s.name === filterState)?.cities || []}
                  value={filterCity}
                  onChange={setFilterCity}
                  disabled={!filterState || nearMeOnly}
                />

                {(filterCountry || filterState || filterCity) && (
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      onClick={resetManualLocation}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      <X size={12} /> Clear Location Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS LISTING GRID */}
      {paginatedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedOpportunities.map((opp) => {
            const isBookmarked = bookmarks.includes(opp.id);
            const matchPercent = getDynamicMatchPercentage(opp);
            return (
              <div 
                key={opp.id} 
                className="rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg flex flex-col justify-between hover:-translate-y-1 hover:border-indigo-500/20 dark:hover:border-indigo-500/35 transition-all group relative"
              >
                <div className="space-y-4">
                  
                  {/* Category Pill, New indicator and Bookmark icons */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider rounded uppercase border ${getCategoryIconColor(opp.category)}`}>
                        {opp.category}
                      </span>
                      {opp.isNew && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider bg-red-500 text-white rounded uppercase animate-pulse">
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
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(opp.id)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isBookmarked 
                            ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
                            : 'bg-slate-100 hover:bg-slate-200/60 text-slate-400 dark:bg-slate-950 dark:hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
                      >
                        {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(opp, e)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/60 text-slate-400 dark:bg-slate-950 dark:hover:bg-slate-800 cursor-pointer"
                        title="Share Link"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Header Title Information */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-bold font-mono">
                      <Sparkles size={11} />
                      <span>{matchPercent}% SKILL MATCH</span>
                    </div>

                    <h3 className="font-bold text-sm dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                      <Link to={`/discover/${opp.id}`}>{opp.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 truncate font-semibold">{opp.organization}</p>
                  </div>

                  {/* Description segment */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skill tagging lists */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {opp.requiredSkills.slice(0, 3).map((skill) => {
                      const ownsSkill = profile.skills.includes(skill);
                      return (
                        <span 
                          key={skill} 
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            ownsSkill
                              ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-transparent font-mono'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {opp.requiredSkills.length > 3 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        +{opp.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer segment: Reward / Location / Button triggers */}
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-850 space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium font-mono">
                    {/* Prize formatted in Rupees automatically */}
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-xs" title={opp.prize}>
                      <Award size={13} className="text-amber-500" />
                      {formatPrizeInINR(opp.prize)}
                    </span>
                    
                    {/* Location presentation showing distance, mode, travel info */}
                    <div className="flex flex-col items-end text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-0.5 font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]" title={opp.location}>
                        <MapPin size={11} className="text-slate-400" />
                        {opp.city || opp.location}
                      </span>
                      <div className="flex gap-1 items-center mt-0.5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded-sm text-[8px] font-bold uppercase">
                          {opp.mode}
                        </span>
                        {opp.distance && (
                          <span className="bg-indigo-500/10 text-indigo-500 px-1 rounded-sm text-[8px] font-extrabold">
                            {opp.distance}km
                          </span>
                        )}
                        {opp.travelRequired && (
                          <span className="text-amber-500 bg-amber-500/10 px-1 rounded-sm text-[8px] font-semibold" title="Travel Reimbursements Offered">
                            ✈ Travel
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/discover/${opp.id}`}
                      className="flex-1 py-2 text-center text-xs font-bold text-slate-700 hover:text-indigo-500 dark:text-slate-300 bg-slate-100 hover:bg-slate-205/50 dark:bg-slate-950 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                      Inspect Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl relative shadow-sm">
          <Info size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-display font-semibold text-sm dark:text-white">No Matching Opportunities Sourced</h3>
          <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, turning off "Near Me Only", or typing general key terms like "AI" or "React".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedMode('All');
              setNearMeOnly(false);
              resetManualLocation();
            }}
            className="mt-4 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      )}

      {/* PAGINATION PANEL FOOTER */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-xl">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1.5 px-3 py-1.8 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft size={13} />
            Previous
          </button>
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 select-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all text-xs font-bold cursor-pointer ${
                  idx === currentPage
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-600 dark:text-slate-450 border-slate-150 dark:border-slate-850'
                }`}
              >
                {idx}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1.5 px-3 py-1.8 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

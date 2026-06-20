import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface SearchableSelectProps {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize state with incoming prop values
  useEffect(() => {
    setSearch(value);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search term back to chosen value on close if search doesn't match an option
        if (!options.includes(search)) {
          setSearch(value);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [search, value, options]);

  return (
    <div ref={containerRef} className="space-y-1.5 relative w-full">
      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
        {label}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type="text"
          disabled={disabled}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-xs dark:text-white transition-all pr-16 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
          }`}
        />

        {/* Action icons right-aligned */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {search && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setSearch('');
                onChange('');
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
            >
              <X size={12} />
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300"
          >
            <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
          {filteredOptions.length > 0 ? (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setSearch(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    option === value
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-400 italic">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

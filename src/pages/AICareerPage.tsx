import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  MapPin, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  User,
  Compass,
  LineChart
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const AICareerPage: React.FC = () => {
  const { profile } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Suggestions for guided coaching queries
  const suggestions = [
    { text: "Suggest 3 full-stack projects matching my skills.", icon: <Sparkles size={13} className="text-amber-500" /> },
    { text: `What are the best certs for a ${profile.branch} student?`, icon: <BookOpen size={13} className="text-indigo-500" /> },
    { text: `Help me structure a learning roadmap to fill my skill gaps.`, icon: <LineChart size={13} className="text-emerald-500" /> },
    { text: `Suggest career paths in ${profile.city || 'my city'} for my major.`, icon: <MapPin size={13} className="text-rose-500" /> }
  ];

  // Run the initial profile analysis call on load
  useEffect(() => {
    const triggerInitialAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: profile,
            message: "Analyze my profile and provide my primary career, internships, hackathons, certifications, and portfolio project suggestions."
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to contact Gemini API");
        }

        const data = await response.json();
        setMessages([
          {
            role: 'assistant',
            text: data.text
          }
        ]);
      } catch (err: any) {
        console.error("AI Assistant init error:", err);
        setError(err.message || "An unexpected error occurred. Please check if the GEMINI_API_KEY is configured in your platform secrets.");
        // Fallback friendly message for smooth UX in case of first-run unconfigured key
        setMessages([
          {
            role: 'assistant',
            text: `### Welcome to your OpportunityAI Career Coach! 👋 \n\nI am currently operating in standalone discovery mode. To activate my fully dynamic real-time Gemini reasoning backend, please make sure your **GEMINI_API_KEY** is configured in your Environment / Secrets panel. \n\nBased on your registered student profile, here is an initial strategic blueprint:\n\n*   **Recommended Career Pathways:** Since you are in your **${profile.collegeYear}** year studying **${profile.branch}**, high-value technical tracks include: Lead Cloud Engineer, Full Stack Integrator, or Data Platform Specialist.\n*   **Skills to Master Next:** Focus heavily on **Docker, AWS Services**, and advanced **SQL Optimization** parameters.\n*   **Bootstrap Projects:** Consider building an automated location-specific crawler or a responsive scheduler dashboard to strengthen your GitHub portfolio.`
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    triggerInitialAnalysis();
  }, [profile]);

  // Scroll to bottom helper
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);
    setError(null);

    // Formulate message chat history for context
    const chatHistory = messages.map(msg => ({
      role: msg.role,
      text: msg.text
    }));

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profile,
          message: textToSend,
          chatHistory: chatHistory
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send message to Gemini API");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err: any) {
      console.error("AI Assistant send error:", err);
      setError(err.message || "Unable to retrieve AI advice. Check network credentials.");
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ **Connection Timeout or Missing Credentials**\n\nI was unable to establish connection with the Gemini server. This usually happens if the \`GEMINI_API_KEY\` is not set inside the workspace secrets. \n\nHowever, regarding your question, I recommend continuing to expand your knowledge of **${profile.skills.slice(0, 3).join(', ')}** and seeking nearby opportunities in **${profile.city}, ${profile.state}**!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Crude markdown-to-html helper for styling response lists nicely
  const parseMarkdownText = (text: string) => {
    return text.split('\n').map((line, index) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('###')) {
        return <h4 key={index} className="text-sm font-bold text-slate-800 dark:text-white mt-4 mb-2 flex items-center gap-2">{trimmed.replace('###', '')}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={index} className="text-base font-display font-bold text-indigo-600 dark:text-indigo-400 mt-5 mb-2.5 flex items-center gap-2">{trimmed.replace('##', '')}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={index} className="text-lg font-display font-bold text-slate-900 dark:text-white mt-5 mb-3 border-b border-indigo-500/10 pb-1">{trimmed.replace('#', '')}</h2>;
      }

      // Bullets
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        let cleanText = trimmed.substring(1).trim();
        // Check for basic bold inside
        return (
          <div key={index} className="pl-4 py-1.5 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 leading-normal">
            <span className="text-indigo-505 select-none mt-1">•</span>
            <span>{renderFormattedInlineText(cleanText)}</span>
          </div>
        );
      }

      // Regular lines
      if (trimmed === '') return <div key={index} className="h-2"></div>;

      return (
        <p key={index} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed py-1">
          {renderFormattedInlineText(line)}
        </p>
      );
    });
  };

  // Render inline formatting like **bold text**
  const renderFormattedInlineText = (line: string) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-bold text-slate-900 dark:text-white">{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      
      {/* LEFT PROFILE PARAMETERS COLUMN */}
      <div className="lg:col-span-1 flex flex-col gap-6 h-full">
        
        {/* Student parameters dashboard */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <GraduationCap className="text-indigo-500" size={18} />
            <span className="font-display font-semibold text-sm dark:text-white">Active Mentoring Context</span>
          </div>

          <div className="space-y-3.5">
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Student</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.name}</p>
            </div>
            
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Education</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.collegeYear} Study • {profile.branch} Major
              </p>
            </div>

            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Region Setup</span>
              <div className="flex items-center gap-1 mt-0.5 font-semibold text-indigo-650 dark:text-indigo-400">
                <MapPin size={13} />
                <span>{profile.city}, {profile.state}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.skills.slice(0, 6).map(s => (
                  <span key={s} className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                    {s}
                  </span>
                ))}
                {profile.skills.length > 6 && <span className="text-[9px] text-slate-400 font-mono font-bold">+{profile.skills.length - 6} more</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Guided Advice Prompts */}
        <div className="hidden lg:block p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            <HelpCircle size={14} className="text-amber-500" />
            <span>Coaching Prompts</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(s.text)}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 hover:border-indigo-500 dark:hover:border-indigo-400 text-[11px] font-medium text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all shadow-sm flex items-start gap-1.5 leading-normal cursor-pointer"
              >
                <span className="mt-0.5 flex-shrink-0">{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT INTERACTIVE CONVERSATIONAL CHAT COLUMN */}
      <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden @apply shadow-sm;">
        
        {/* Chat window header */}
        <div className="px-5 py-4.5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-505/15">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm dark:text-white">AI Career Coach</h3>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Active Advisor • Gemini Cloud Intelligence</span>
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Container */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-520 rounded-full flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-white">Initializing Coach Interface</h4>
                <p className="text-xs text-slate-450 mt-1">Connecting to server pipelines to generate your student parameters blueprint...</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex gap-4.5 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
                
                {/* Micro Avatar */}
                <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                  isUser 
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350' 
                    : 'bg-indigo-600 text-white shadow shadow-indigo-500/15'
                }`}>
                  {isUser ? <User size={14} /> : <GraduationCap size={15} />}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 leading-normal text-xs shadow-sm shadow-slate-100/10 ${
                  isUser 
                    ? 'bg-indigo-600 dark:bg-indigo-550 text-white rounded-tr-none' 
                    : 'bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-200 border border-slate-200/40 dark:border-slate-850/60 rounded-tl-none space-y-1.5'
                }`}>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-1 select-text">
                      {parseMarkdownText(msg.text)}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Loading loader bubble */}
          {isLoading && (
            <div className="flex gap-4.5 items-start">
              <div className="w-8.5 h-8.5 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <GraduationCap size={15} />
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-850/60 rounded-2xl rounded-tl-none px-5 py-4 text-xs font-semibold text-slate-400 flex items-center gap-2">
                <Clock size={13} className="animate-spin text-indigo-500" />
                <span>OpportunityAI Advisor is formulating academic strategies...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs flex gap-2.5 items-start">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Credential Service Error</span>
                <p className="mt-1 text-[11px] text-rose-500/80 leading-normal">{error}</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Guided queries slider for mobile */}
        <div className="lg:hidden px-4 py-2 bg-slate-50 dark:bg-slate-950/20 border-t border-b border-slate-100 dark:border-slate-850 flex gap-2 overflow-x-auto select-none">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(s.text)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-550 flex items-center gap-1.5 cursor-pointer"
            >
              {s.icon}
              <span>{s.text.substring(0, 32)}...</span>
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
          className="p-4 border-t border-slate-100 dark:border-slate-850/85 bg-slate-50/50 dark:bg-slate-900/30 flex gap-3.5 items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask Coach anything... (e.g., "Suggest a cybersecurity track in ${profile.city}")`}
            className="flex-1 px-4 py-3 text-xs bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl outline-none focus:border-indigo-500 dark:text-white"
            disabled={isLoading}
          />

          <button
            type="submit"
            id="chat-submit-btn"
            disabled={!inputVal.trim() || isLoading}
            className="h-10 w-10 rounded-xl bg-indigo-650 hover:bg-indigo-650 hover:brightness-105 active:scale-95 transition-all text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer shadow shadow-indigo-650/15"
          >
            <Send size={15} />
          </button>
        </form>

      </div>

    </div>
  );
};

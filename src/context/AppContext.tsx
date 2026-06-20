import React, { createContext, useContext, useState, useEffect } from 'react';
import { Opportunity, StudentProfile, AppNotification, SavedOpportunity } from '../types';
import { OPPORTUNITIES } from '../data/opportunities';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  bookmarks: string[]; // Opportunity IDs
  toggleBookmark: (id: string) => void;
  appliedList: string[]; // Opportunity IDs
  applyToOpportunity: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (title: string, description: string, type: AppNotification['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: StudentProfile = {
  name: "Chinmaya Parija",
  avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop",
  email: "chinmayaparija798@gmail.com",
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Git', 'Figma'],
  interests: ['Artificial Intelligence', 'Full Stack Development', 'Product Design', 'Open Source'],
  collegeYear: 'Junior',
  branch: 'Computer Science',
  preferredLocation: 'Remote',
  careerGoal: 'Software Architect & Full Stack Developer',
  achievements: [
    'Microsoft Azure Certified Developer',
    'Overall Winner - Regional Fintech Hackathon 2025',
    'Open Source Core Contributor to Vite UI Kits',
    'Maintained 3.92/4.0 GPA Academic Excellence'
  ],
  appliedCount: 6,
  country: 'India',
  state: 'Karnataka',
  city: 'Bangalore'
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-work-1',
    title: 'New Workshop Listed Near You!',
    description: 'A newly added workshop "Aesthetic UI Dev with Tailwind container grids" is available in Bangalore, Karnataka.',
    date: '2026-06-18',
    read: false,
    type: 'system'
  },
  {
    id: 'n-hack-1',
    title: 'Newly Added Hackathon Alert!',
    description: 'Devpost just added "Global Generative AI Hackathon" with a reward of $10,000 (~₹8,30,000).',
    date: '2026-06-18',
    read: false,
    type: 'match'
  },
  {
    id: 'n-1',
    title: 'Deadline Approaching!',
    description: 'Only 3 days left to submit application for "Global Generative AI Hackathon".',
    date: '2026-06-18',
    read: false,
    type: 'deadline'
  },
  {
    id: 'n-2',
    title: 'Excellent AI Match!',
    description: 'We found a 96% Skills compatibility match for "Software Engineering Intern (Summer 2026)" at Stripe.',
    date: '2026-06-17',
    read: false,
    type: 'match'
  },
  {
    id: 'n-3',
    title: 'Welcome to OpportunityAI',
    description: 'Complete your AI Match Profile to unlock personalized career and learning recommendations.',
    date: '2026-06-15',
    read: true,
    type: 'system'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('opportunity_ai_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('opportunity_ai_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('opportunity_ai_bookmarks');
    // Seed some initial bookmarks to make dashboard exciting right away!
    return saved ? JSON.parse(saved) : ['hackathon-100', 'internship-101', 'scholarship-100'];
  });

  const [appliedList, setAppliedList] = useState<string[]>(() => {
    const saved = localStorage.getItem('opportunity_ai_applied');
    // Seed some initial applied ones
    return saved ? JSON.parse(saved) : ['hackathon-102', 'internship-102', 'event-100'];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('opportunity_ai_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state modifications to DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('opportunity_ai_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('opportunity_ai_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('opportunity_ai_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('opportunity_ai_applied', JSON.stringify(appliedList));
  }, [appliedList]);

  useEffect(() => {
    localStorage.setItem('opportunity_ai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updated,
      appliedCount: updated.appliedCount !== undefined ? updated.appliedCount : prev.appliedCount
    }));
    addNotification('Profile Updated', 'Your student achievements and skillsets were saved successfully.', 'system');
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const isBookmarked = prev.includes(id);
      let next;
      if (isBookmarked) {
        next = prev.filter(item => item !== id);
        addNotification('Bookmark Removed', `Removed opportunity from your saved lists.`, 'system');
      } else {
        next = [...prev, id];
        const opportunity = OPPORTUNITIES.find(o => o.id === id);
        addNotification('Bookmark Saved', `Successfully bookmarked "${opportunity?.title || 'Opportunity'}"!`, 'system');
      }
      return next;
    });
  };

  const applyToOpportunity = (id: string) => {
    if (appliedList.includes(id)) return;
    setAppliedList(prev => [...prev, id]);
    setProfile(prev => ({ ...prev, appliedCount: prev.appliedCount + 1 }));
    const opportunity = OPPORTUNITIES.find(o => o.id === id);
    addNotification('Application Started', `You initiated an application for "${opportunity?.title || 'Opportunity'}". Track details in your Calendar!`, 'deadline');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (title: string, description: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `n-${Date.now()}`,
      title,
      description,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        profile,
        updateProfile,
        bookmarks,
        toggleBookmark,
        appliedList,
        applyToOpportunity,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

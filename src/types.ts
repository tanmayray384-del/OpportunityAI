export type OpportunityCategory = 'Hackathon' | 'Internship' | 'Scholarship' | 'Competition' | 'Fellowship' | 'Event' | 'Workshop' | 'Bootcamp' | 'Career Fair' | 'Training Program';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location: string; // 'Remote', 'On-site', 'Hybrid' or specific city
  deadline: string; // YYYY-MM-DD
  prize: string; // Prize money, stipend, or grant info (e.g., "$5,000", "$2,500/mo")
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  eligibility: string;
  benefits: string[];
  timeline: { event: string; date: string }[];
  requiredSkills: string[];
  city?: string;
  state?: string;
  country?: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  travelRequired?: boolean;
  distance?: number; // distance in km
  isNew?: boolean;
  createdAt?: string; // YYYY-MM-DD
}

export interface StudentProfile {
  name: string;
  avatar: string;
  email: string;
  skills: string[];
  interests: string[];
  collegeYear: string; // "Freshman", "Sophomore", "Junior", "Senior", "Master's", "Ph.D."
  branch: string; // "Computer Science", "Electrical Eng", "Mechanical Eng", "Data Science", etc.
  preferredLocation: string; // "Remote", "India", "USA", "Europe", "Any"
  careerGoal: string;
  achievements: string[];
  appliedCount: number;
  country: string;
  state: string;
  city: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'deadline' | 'match' | 'system';
}

export interface SavedOpportunity {
  id: string;
  savedAt: string;
  applied: boolean;
  appliedAt?: string;
}

export interface MatchResult {
  opportunityId: string;
  percentage: number;
  reason: string;
  matchedSkills: string[];
  missingSkills: string[];
  suggestedLearningPath: string[];
}

import { Opportunity, OpportunityCategory } from '../types';
import { COUNTRIES_DATA } from './locations';

// Helper to format any dollar/euro prize to INR (₹)
export function formatPrizeInINR(prize: string): string {
  if (!prize) return '';
  if (prize.includes('₹')) return prize;

  // Replace any occurrence of $ followed by numeric values
  if (prize.includes('$')) {
    const usdRegex = /\$(\d[\d,]*(\.\d+)?)/g;
    const replaced = prize.replace(usdRegex, (match, p1) => {
      const numericStr = p1.replace(/,/g, '');
      const usdValue = parseFloat(numericStr);
      if (!isNaN(usdValue)) {
        const inrValue = Math.round(usdValue * 83);
        const formattedINR = inrValue.toLocaleString('en-IN');
        return `${match} (~₹${formattedINR})`;
      }
      return match;
    });
    return replaced;
  }

  // Replace any occurrence of € or EUR followed by numeric values
  if (prize.includes('€') || prize.toLowerCase().includes('eur')) {
    const eurRegex = /(?:€|EUR)\s*(\d[\d,]*(\.\d+)?)/gi;
    const replaced = prize.replace(eurRegex, (match, p1) => {
      const numericStr = p1.replace(/,/g, '');
      const eurValue = parseFloat(numericStr);
      if (!isNaN(eurValue)) {
        const inrValue = Math.round(eurValue * 90);
        const formattedINR = inrValue.toLocaleString('en-IN');
        return `${match} (~₹${formattedINR})`;
      }
      return match;
    });
    return replaced;
  }

  return prize;
}

// Helper pools of realistic organizations
const ORGS_BY_CAT: Record<OpportunityCategory, string[]> = {
  Hackathon: [
    'Google Cloud', 'Meta AI', 'Microsoft Azure', 'Devpost', 'MLH (Major League Hacking)',
    'Ethereum Foundation', 'Solana Labs', 'OpenAI', 'Anthropic', 'Hugging Face',
    'Vercel', 'Supabase', 'Figma', 'Atlassian', 'GitHub', 'Databricks', 'AWS', 'Stripe'
  ],
  Internship: [
    'Stripe', 'Nvidia', 'Apple', 'Amazon Web Services', 'Netflix', 'Uber', 'Lyft', 'Slack',
    'Notion', 'Linear', 'Airbnb', 'Tesla', 'SpaceX', 'Coinbase', 'Databricks', 'Snowflake',
    'Intel', 'AMD', 'Microsoft Research', 'Adobe'
  ],
  Scholarship: [
    'Generation Google', 'Microsoft STEM Education', 'Adobe Design Scholar Foundation',
    'Grace Hopper Scholars', 'Palantir Pathways', 'Society of Women Engineers', 'Intel Scholar Grant',
    'National Science Foundation', 'Ford Foundation', 'TED Fellows', 'Rotary International', 'Rhodes Trust'
  ],
  Competition: [
    'Kaggle', 'Codeforces Association', 'IEEE Computer Society', 'Microsoft Imagine Cup',
    'ACM-ICPC Committee', 'Google Competitive Coding', 'Meta Hacker Cup', 'HackerRank',
    'Cyber Defense Alliance', 'NASA Space Apps', 'XPRIZE Foundation'
  ],
  Fellowship: [
    'Thiel Foundation', 'Kleiner Perkins (KP Fellows)', 'GitHub Octernships', 'Mozilla Open Web',
    'Schmidt Futures', 'Stanford Knight-Hennessy', 'Y Combinator Fellowship', 'a16z Crypto School',
    'OpenAI Safety', 'CERN Research Group'
  ],
  Event: [
    'TEDx Student Network', 'DeveloperWeek Expo', 'Google I/O Community', 'Microsoft Build Community',
    'AWS Summit Academic', 'TechCrunch Disrupt', 'Web Summit NextGen', 'Figma Config Prep',
    'Vercel Ship Summit', 'JSConf Global', 'PyCon Education', 'KubeCon Cloud Native'
  ],
  Workshop: [
    'Google Developer Groups', 'HashiCorp Academy', 'Red Hat University', 'AWS Academy Training',
    'Postman Devrel Group', 'Twilio Academic', 'Clerk Auth Labs', 'Algolia Search School', 'Sentry Error Masters'
  ],
  Bootcamp: [
    'General Assembly', 'Springboard Academy', 'Y Combinator Startup School', 'Coding Temple',
    'App Academy', 'Hack Reactor', 'Ironhack', 'Udacity Nanodegree', 'Flatiron School'
  ],
  'Career Fair': [
    'National STEM Career Expo', 'Silicon Valley Tech Career Fair', 'Grace Hopper Celebration Fair',
    'Europe Graduate Careers Forum', 'India Tech Job Expo', 'Virtual Developer Career Summit'
  ],
  'Training Program': [
    'Ministry of Skill Development & Entrepreneurship', 'Digital India Learn Initiative', 'PMKVY Govt Training',
    'US National Apprenticeship Program', 'AWS Educate Career Pathway', 'Google Career Certificates Initiative',
    'National Skill Development Corporation'
  ]
};

const HACK_TITLES = [
  'Global Generative AI Hackathon', 'Smart Contracts & Web3 Challenge', 'Sustainable Energy Hackathon',
  'Web3 Future Builder Hack', 'EduTech Innovators Challenge', 'Healthcare Accessibility Hack',
  'Astro Hackathon 2026', 'Next-Gen Fintech Sprint', 'AI for Social Good Hack',
  'CyberSecurity Defense League Hack', 'Quantum Computing Explorers Hack', 'SaaS MVP Builder Sprint',
  'Autonomous AI Agents Hackathon', 'Zero-Knowledge Privacy Hack', 'EcoTech Climate Solutions',
  'Civic Tech Hack for Smarter Cities', 'Metaverse & VR Spatial Hack', 'No-Code/Low-Code Innovation Sprint',
  'BioTech AI DNA Hack', 'DeFi Liquidity Hackathon', 'DevOps Automations Challenge',
  'Accessibility for Everyone Hack', 'Robotics & IoT Sync Hack', 'Real-time Collaborative Web Hack',
  'Serverless Stack Hackathon', 'Edge Computing Future Sprint', 'Voice AI Assistant Hack',
  'Big Data Analytics Hackathon', 'Mobile-First Student Hack', 'Design-to-Code Speed Hack'
];

const INTERN_TITLES = [
  'Software Engineering Intern (Summer 2026)', 'Data Science & Machine Learning Intern',
  'Product Design (UI/UX) Intern', 'Product Management Summer Intern', 'Frontend React Developer Intern',
  'Backend Cloud Infrastructure Intern', 'Cybersecurity Engineering Intern', 'Mobile App Development Intern',
  'Site Reliability & DevOps Intern', 'AI/LLM Fine-Tuning Research Intern', 'Hardware Verification Engineering Intern',
  'Developer Relations & Community Intern', 'Growth Marketing & Analytics Intern', 'Full Stack Web Intern (Vite/Node)',
  'Embedded Systems & IoT Intern', 'Quantitative Finance Intern', 'Database Systems Engineering Intern',
  'Security Audit & Pentesting Intern', 'VR/AR App Development Intern', 'Clinical BioInformatics Intern',
  'Blockchain Protocol Research Intern', 'Solutions Architect Intern', 'User Research & Strategy Intern',
  'Natural Language Processing Intern', 'High-Performance Computing Intern', 'Graphics Engine Software Intern',
  'Cloud Security Specialist Intern', 'Computer Vision Engineering Intern', 'iOS/Swift Application Intern',
  'Systems Core Kernel Intern'
];

const SCHOLAR_TITLES = [
  'Women in Technology Empowerment Scholarship', 'STEM Academic Excellence Grant', 'Adobe UX Creator Excellence Scholars',
  'Grace Hopper Celebration Attendee Grant', 'Future AI Researchers Fellowship', 'Palantir Pathfinders Undergrad Grant',
  'SWE Leadership Undergraduate Scholarship', 'Underrepresented Tech Founders Grant', 'Global Clean Energy Innovators Scholarship',
  'Cybersecurity Leaders of Tomorrow Scholarship', 'Next-Gen Open-Source Developer Grant', 'Quantum Physics Student Grant',
  'BIPOC Software Engineers Scholarship', 'Disabled Tech Innovators Scholarship', 'Community Impact Leader Scholarship',
  'Rural Technology Pioneers Grant', 'Math and Computer Science Scholars', 'SaaS Innovators Scholarship Fund',
  'Creative Web Typography Scholarship', 'Global Educational Accessibility Fellowship'
];

const COMP_TITLES = [
  'Global Deep Learning Kaggle Masters', 'Algorithm Speed Championship (Div 1/2)', 'National Cyber Capture-The-Flag (CTF)',
  'IEEE Smart Cities Grand Challenge', 'Imagine Cup Student Innovation League', 'UX Design Showdown 2026',
  'Intelligent AI Agent Algorithmic Showdown', 'Autonomous Miniature Robotics Speed Cup', 'Global Tech Trivia Bowl',
  'Game Development 72-Hour Rapid Challenge', 'International Data Visualization Bowl', 'Cloud Cost Optimization Cup',
  'Zero-Day Security Patching Challenge', 'SQL Optimization Grand Prix', 'Quantum Circuit Design Speedrun',
  'Green Code Efficiency Challenge', 'API Integration Speed Contest', 'Distributed Systems Load Test Cup',
  'Student Mobile App Pitch Competitions', 'Natural Language Translation Accuracy Cup'
];

const FELLOW_TITLES = [
  'Thiel Fellowship for Maverick Founders', 'KP Fellowship (Engineering Cohort)', 'GitHub Next-Gen Octernship Fellowship',
  'Mozilla Open Web Advocate Fellowship', 'Schmidt Futures Student Scholars Program', 'Knight-Hennessy Scholarship Residency',
  'AI Safety Research Academic Residency', 'Web3 / DeFi Protocol Fellowship Program', 'ClimateTech Innovators Fellowship',
  'Education Innovation Venture Fellowship', 'Civic Technology Founders Cohort', 'BioInformatics Systems Fellowship',
  'Human-Computer Interaction Fellowship', 'Developer Tools Next-Gen Fellowship', 'Database Engine Fellow Program',
  'Artificial General Intelligence Ethics Fellow', 'Decentralized Identity Fellow', 'Augmented Human Interfaces Fellowship',
  'Edge Computing Research Fellowship', 'Global Student Venture Capital Fellow'
];

const EVENT_TITLES = [
  'Generative AI & LLM Developer Summit', 'Modern React & Tailwind Masterclass', 'Intro to Quantum Computing Concepts',
  'Figma Design Sprint & Layout Mastery', 'Cloud Architecture Academic Bootcamp', 'Open Source Contribution Warm-up Day',
  'React Global Summit for Students', 'AWS Hybrid Cloud Hands-on Labs', 'Cybersecurity Pentesting 101 Interactive',
  'SaaS Entrepreneurship Student Masterclass', 'Python for Scientific Data Analytics', 'Kubernetes and Docker Essentials',
  'DeveloperWeek NextGen Academic Track', 'UX Research Best Practices Workshop', 'Git and Advanced Version Control Hub',
  'AI Ethics and Governance Round Table', 'Building Scalable APIs Crash Course', 'Vector Databases & RAG Systems Day',
  'Interactive Audio Synthesis Masterclass', 'Career Readiness in Tech Panel & Mixer'
];

const WORKSHOP_TITLES = [
  'Aesthetic UI Dev with Tailwind container grids', 'Full-stack Express API Design Patterns',
  'Practical Fine-Tuning and RAG Integration', 'Debugging Production React Memory Leak gaps',
  'Next-generation Web3 Smart Contract Audits', 'Responsive Visual Aesthetics and Typography pair-ups',
  'Secure Authentication flows with OAuth and Cookies'
];

const BOOTCAMP_TITLES = [
  'Full Stack AI & Web Development Academy', 'Data Science & Analytics Immersive Bootcamp',
  'DevOps & Kubernetes Cloud Foundations', 'UI/UX Visual Craft Design Bootcamp',
  'Cybersecurity Defense & Ethical Hacking Academy', 'Smart Contract Audits & Web3 Bootcamp'
];

const CAREER_FAIR_TITLES = [
  'Annual National STEM Student Career Fair', 'Software Engineering Opportunity Day',
  'Global Virtual Developer Careers Summit', 'Tech Careers & Internship Expo',
  'Diversity & Inclusion Tech Recruitment Fair', 'Government & Public Sectors Jobs Fair'
];

const TRAINING_PROGRAM_TITLES = [
  'National Digital India Skills Training Program', 'Cloud Architect Career Pathway Accelerator',
  'Vocational Mobile App Builders Apprenticeship', 'Industrial IoT & Hardware Systems Training',
  'Advanced Data Engineering & RAG Systems Academy', 'Government Sponsored Cybersecurity Leadership Program'
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

const SKILL_POOL = [
  'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'Machine Learning', 'Next.js',
  'Docker', 'AWS', 'PostgreSQL', 'Git', 'Figma', 'UI Design', 'Go', 'Data Science', 'PyTorch',
  'Cybersecurity', 'Solidity', 'Web3', 'GraphQL', 'Kubernetes', 'FastAPI', 'Express',
  'C++', 'Rust', 'TensorFlow', 'NLP', 'SEO', 'Scrum'
];

const TAGS_POOL: Record<OpportunityCategory, string[]> = {
  Hackathon: ['AI', 'Web3', 'Social Good', 'Finance', 'EcoTech', 'SaaS', 'Mobile', 'Design', 'Privacy'],
  Internship: ['Frontend', 'Backend', 'Full Stack', 'Full-time', 'Paid', 'DevOps', 'Data', 'UI/UX', 'Cloud'],
  Scholarship: ['Diversity', 'STEM', 'Financial Aid', 'Women In Tech', 'Leadership', 'Tuition', 'Undergrad'],
  Competition: ['Algorithms', 'Kaggle', 'CTF', 'Coding Speed', 'UI Showdown', 'Global', 'Cash Prize'],
  Fellowship: ['Founders', 'Mentorship', 'Equity-free', 'Research', 'Stipend', 'Prestigious', 'Network'],
  Event: ['Workshop', 'Bootcamp', 'Networking', 'Certification', 'Panel', 'Q&A', 'Free Tech'],
  Workshop: ['Code Along', 'Deep Dive', 'Hands-on', 'Design Patterns', 'API Sync', 'Security CTF'],
  Bootcamp: ['Code Bootcamp', 'Career Pivot', 'Intensive Learn', 'Full Stack', 'Certificate'],
  'Career Fair': ['Networking', 'Recruiting', 'Employers', 'Resumes', 'Speed Interviews'],
  'Training Program': ['Govt Initiative', 'Apprenticeship', 'Skill Development', 'Sponsor', 'Free Career']
};

function generateDescription(category: OpportunityCategory, title: string, org: string): string {
  switch (category) {
    case 'Hackathon':
      return `Join ${org} for an intense, highly collaborative coding marathon where you'll build innovative software. The ${title} brings together talented developers, designers, and visionaries from around the globe to build working MVPs, address real-world challenges, and win impressive cash prizes. You'll gain access to exclusive developer APIs, direct mentorship from lead architects, and opportunities to pitch to top VC firms.`;
    case 'Internship':
      return `Embark on a high-growth career journey with ${org} as a ${title}. In this role, you will be embedded directly into a core product squad, taking full ownership of shipping production code that impacts millions of active users. You will work side-by-side with senior engineering staff, participate in code reviews, technical architecture sessions, and benefit from structured technical training.`;
    case 'Scholarship':
      return `The ${title} offered by ${org} is dedicated to supporting academic excellence, reducing financial barriers, and promoting diversity within computer science and STEM fields. Recipients of this scholarship will receive financial aid, invitations to premium tech workshops, one-on-one professional coaching, and matching pipelines for upcoming fast-tracked internship applications.`;
    case 'Competition':
      return `Challenge yourself against the world's best students in the ${title} hosted by ${org}. This competition is meticulously designed to push your limit in algorithm design, optimization, mathematical analysis, or design fidelity depending on your track. Stand out, showcase your technical prowess, and lock in global leaderboards position along with incredible prizes.`;
    case 'Fellowship':
      return `The ${title} is a prestigious, long-term program sponsored by ${org} to empower next-generation builders, academics, and researchers. As a fellow, you will receive equity-free funding/stipends, unlimited access to compute infrastructure, and an intimate network of industry leaders, guiding you to successfully scale your project or academic research.`;
    case 'Event':
      return `Participate in ${org}'s ${title}, an immersive multi-day experience structured for ambitious students. Perfect your craft through structured code-alongs, panel discussions with tech innovators, and direct Q&A. This hands-on event is fully responsive to students looking to learn modern technical tooling, expand their professional network, and prepare for career benchmarks.`;
    case 'Workshop':
      return `Master the hottest industry tools and techniques inside ${org}'s ${title}. Designed by expert practitioners, this interactive session walks you through configuration code-alongs, security standards, and local debugging loops. Walk away with clean copyable boilerplates, strong core mental models, and an official completion badge.`;
    case 'Bootcamp':
      return `Join ${org} for the intensive, fast-paced ${title}. This immersive program covers cutting-edge industrial techniques, architectures, and standard tools. You will follow a highly accelerated, hands-on path supported by senior tech practitioners, complete live mock projects, and earn verification certificates to upgrade your portfolio for upcoming employment cycles.`;
    case 'Career Fair':
      return `Connect with leading recruiters and tech team leads at the ${title} hosted by ${org}. This premier recruitment hub bridges ambitious student talent with open internship positions, graduate trainee programs, and full-time vacancies. Submit your portfolio direct to decision makers, undergo on-the-spot speed interviews, and receive expert resume feedback.`;
    case 'Training Program':
      return `Enroll in ${org}'s ${title}, a fully structured skill-enhancement and apprenticeship track. This comprehensive program is designed to deliver immediate, job-ready technical capacity in computer engineering fields. Under the direction of master educators, you will complete technical modules, undergo regular assessments, and position yourself for direct partner placement pipelines.`;
  }
}

function generateEligibility(category: OpportunityCategory): string {
  switch (category) {
    case 'Hackathon':
      return 'Open to all undergraduate, graduate, and high school students globally over the age of 15. Individual registrations or teams of up to 4 members are supported. All backgrounds are encouraged, from absolute coding beginners to advanced blockchain/AI practitioners.';
    case 'Internship':
      return 'Currently enrolled in an undergraduate, graduate, or associate program in Computer Science, engineering, or a related field. Graduates within 6 months are also eligible. Strong foundational understanding of data structures, algorithms, and modular coding patterns is required.';
    case 'Scholarship':
      return 'Must be currently enrolled as a full-time university student. Applicants must demonstrate a strong academic and community leadership record, and be pursuing a degree in computer engineering, data science, tech policy, or design fields.';
    case 'Competition':
      return 'Registered students in any accredited degree-granting program worldwide. No active professional software engineering experience exceeding 1 year is allowed. Clean competitive record required.';
    case 'Fellowship':
      return 'Aspiring young researchers, founders, or open-source contributors. Must be willing to commit at least 15-20 hours per week during the program duration. Projects must be non-commercial open source or pre-seed startup concepts.';
    case 'Event':
      return 'Free and open to all technology enthusiasts, developers, secondary school/college students, and lifelong learners. No background prerequisites required. Standard internet connection for virtual streams.';
    case 'Workshop':
      return 'Open to curious tech students looking to establish practical engineering skills. Basic understanding of files systems, terminals, and command utilities is helpful but not strictly required.';
    case 'Bootcamp':
      return 'Open to current students, recent graduates, or self-taught builders eager to specialize. Basic knowledge of computer logic is helpful. Must commit to the full study hours of the bootcamp curriculum.';
    case 'Career Fair':
      return 'Free and open to all active university students, developers, and early-career jobseekers. Pre-registration and an uploaded PDF resume are required to access recruiter rooms.';
    case 'Training Program':
      return 'Open to undergraduate and graduate students in technical or vocational fields. Priority is granted to students matching regional state/local criteria under community initiatives.';
  }
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePrizes(category: OpportunityCategory): string {
  const numbers = ['$10,000 Total Prize Pool', '$5,000 Grand Prize', '$15,000 in Cash & Credits', '$2,000 Stipend + Travel', '$8,000 Tech Grants', 'Fully Covered Travel & Ticket', '$1,500/month stipend', '$120,000 Venture Grant', 'Gold Medal + $3,000', 'Mentorship & Macbook Pro'];
  if (category === 'Internship') {
    return `$${(40 + Math.floor(Math.random() * 45))}/hr Paid + Housing Stipend`;
  } else if (category === 'Scholarship') {
    return `$${(5 + Math.floor(Math.random() * 10)) * 1000} Educational Scholarship`;
  } else if (category === 'Event' || category === 'Workshop') {
    return 'Free Certificate & VIP Tech Swag Bag';
  } else if (category === 'Bootcamp') {
    return 'Official Industry Certificate & Hiring Placement Assistance';
  } else if (category === 'Career Fair') {
    return 'Direct Recruiter Networking & Free Registration';
  } else if (category === 'Training Program') {
    return `Sponsored Tuition (~$500 value) & Paid Apprenticeship Stipend`;
  }
  return numbers[Math.floor(Math.random() * numbers.length)];
}

const ALL_OPPORTUNITIES: Opportunity[] = [];

// Helper to assemble an opportunity list
function createCohort(category: OpportunityCategory, titles: string[], countDesired: number) {
  const orgsList = ORGS_BY_CAT[category];
  
  for (let i = 0; i < countDesired; i++) {
    const title = titles[i % titles.length] + (i >= titles.length ? ` (Cohort ${Math.floor(i / titles.length) + 1})` : '');
    const org = orgsList[i % orgsList.length];
    
    // Choose mode: Online, Offline, Hybrid
    const modeIndex = (i + category.charCodeAt(0)) % 3;
    const mode = modeIndex === 0 ? 'Online' : (modeIndex === 1 ? 'Hybrid' : 'Offline');
    
    let country: string | undefined = undefined;
    let state: string | undefined = undefined;
    let city: string | undefined = undefined;
    let locationStr = 'Online / Remote';
    let travelRequired = false;
    let distance: number | undefined = undefined;

    if (mode !== 'Online') {
      // Pick Country -> State -> City
      // Biase towards India (about 55%) and US (about 30%) to create beautiful localized matches
      const biasIndex = (i + i % 2) % 10;
      let countryObj = COUNTRIES_DATA[0]; // India
      if (biasIndex >= 5 && biasIndex < 8) {
        countryObj = COUNTRIES_DATA[1]; // US
      } else if (biasIndex >= 8) {
        countryObj = COUNTRIES_DATA[(i % (COUNTRIES_DATA.length - 2)) + 2]; // UK, Germany, Japan
      }

      country = countryObj.name;
      const stateObj = countryObj.states[i % countryObj.states.length];
      state = stateObj.name;
      city = stateObj.cities[(i * 3) % stateObj.cities.length];
      
      locationStr = `${city}, ${state}, ${country}`;
      travelRequired = (i % 4 === 0); // some offline events need travel
      
      // Calculate a randomized distance field (e.g., in km closer to local users)
      distance = 5 + (i * 7) % 45; // 5km to 50km
    }

    // Deadlines should span from next few days to 6 months in the future
    const daysOffset = 3 + (i * 4) % 180;
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const deadlineString = date.toISOString().split('T')[0];

    // Skills
    const reqSkills = getRandomItems(SKILL_POOL, 3 + (i % 3));
    const benefits = [
      'Direct industry mentorship from senior leaders',
      'Exclusive high-quality merchandise and premium swag',
      'Certificate of validation signed by project founders',
      'Fast-track interview loop for prospective full-time roles',
      'Access to private developer community channels'
    ];

    const timeline = [
      { event: 'Registration Window Opens', date: new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { event: 'Submissions/Applications Deadline', date: deadlineString },
      { event: 'Evaluation and Peer Reviews', date: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { event: 'Grand Finale Showcase & Awards Ceremony', date: new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ];

    // Determine if opportunity was "newly added" during the last few days
    // Let's mark indices divisible by 5 as isNew: true
    const isNew = i % 5 === 0;
    const createdOffset = (i % 4) + 1;
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - createdOffset);
    const createdAtString = createdDate.toISOString().split('T')[0];

    ALL_OPPORTUNITIES.push({
      id: `${category.toLowerCase()}-${100 + i}`,
      title,
      organization: org,
      category,
      location: locationStr,
      deadline: deadlineString,
      prize: generatePrizes(category),
      tags: getRandomItems(TAGS_POOL[category], 2 + (i % 2)),
      difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
      description: generateDescription(category, title, org),
      eligibility: generateEligibility(category),
      benefits,
      timeline,
      requiredSkills: reqSkills,
      city,
      state,
      country,
      mode,
      travelRequired: mode === 'Online' ? false : travelRequired,
      distance,
      isNew,
      createdAt: createdAtString
    });
  }
}

// Generate the cohorts exactly matching requirements
createCohort('Hackathon', HACK_TITLES, 30);
createCohort('Internship', INTERN_TITLES, 30);
createCohort('Scholarship', SCHOLAR_TITLES, 20);
createCohort('Competition', COMP_TITLES, 20);
createCohort('Fellowship', FELLOW_TITLES, 20);
createCohort('Event', EVENT_TITLES, 20);
createCohort('Workshop', WORKSHOP_TITLES, 20);
createCohort('Bootcamp', BOOTCAMP_TITLES, 15);
createCohort('Career Fair', CAREER_FAIR_TITLES, 15);
createCohort('Training Program', TRAINING_PROGRAM_TITLES, 15);

export const OPPORTUNITIES: Opportunity[] = ALL_OPPORTUNITIES;

export function getDifficultyColor(difficulty: Opportunity['difficulty']) {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Intermediate':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'Advanced':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  }
}

export function getCategoryIconColor(category: OpportunityCategory) {
  switch (category) {
    case 'Hackathon': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'Internship': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    case 'Scholarship': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'Competition': return 'text-rose-500 bg-rose-500/10 border-rose-505/20';
    case 'Fellowship': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'Event': return 'text-teal-500 bg-teal-500/10 border-teal-500/20';
    case 'Workshop': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
    case 'Bootcamp': return 'text-emerald-505 bg-emerald-500/10 border-emerald-500/20';
    case 'Career Fair': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
    case 'Training Program': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  }
}

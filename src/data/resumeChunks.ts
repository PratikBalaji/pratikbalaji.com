export interface ResumeChunk {
  id: string;
  label: string;
  summary: string;
  x: number;
  y: number;
  keywords: string[];
}

export const RESUME_CHUNKS: ResumeChunk[] = [
  {
    id: 'edu',
    label: 'Education',
    summary: 'Temple University — BS Data Science, Computational Analytics (Expected 2027). Coursework: Calculus I-III, Mathematical Concepts in Computing I-II, Data Structures & Algorithms, Computer Systems & Low-Level Programming, Principles of Data Science(s), Linear Algebra, Principles of Database Systems, Probability Theory. Extracurriculars: Temple Data Analytics Club, Temple Data Science Community, Research Scholars Club.',
    x: 2.1, y: 4.3,
    keywords: ['education', 'university', 'degree', 'temple', 'school', 'study', 'coursework', 'gpa', 'graduation', '2027', 'data analytics club', 'research scholars'],
  },
  {
    id: 'skills-prog',
    label: 'Programming',
    summary: 'Python, C, C++, Java, JavaScript, SQL, R, Bash',
    x: -1.5, y: 2.8,
    keywords: ['python', 'java', 'programming', 'language', 'code', 'skill', 'javascript', 'sql', 'c++', 'bash', 'r', 'quantitative research'],
  },
  {
    id: 'skills-ml',
    label: 'AI & ML Stack',
    summary: 'TensorFlow, PyTorch, scikit-learn, Pandas, NumPy, Deep Learning, AI Agents, ML/AI',
    x: -2.3, y: 3.5,
    keywords: ['ai', 'ml', 'machine learning', 'tensorflow', 'deep learning', 'model', 'pytorch', 'neural', 'agent', 'scikit'],
  },
  {
    id: 'skills-tools',
    label: 'Tools & Cloud',
    summary: 'Docker, Git, AWS, Azure, FastAPI, Flask, MongoDB, PostgreSQL, n8n, IoT',
    x: -3.1, y: 1.2,
    keywords: ['docker', 'aws', 'cloud', 'tool', 'git', 'azure', 'flask', 'fastapi', 'deploy', 'n8n', 'iot', 'mongodb'],
  },
  {
    id: 'skills-adobe',
    label: 'Adobe & Data Tools',
    summary: 'Adobe Experience Platform (AEP), Real-Time CDP, Customer Journey Analytics (CJA), Data Visualization, EDA, Quantitative Research',
    x: -1.0, y: 1.5,
    keywords: ['adobe', 'aep', 'cdp', 'customer journey', 'cja', 'visualization', 'eda', 'analytics', 'real-time'],
  },
  {
    id: 'exp-yan',
    label: 'YAN IT Solutions',
    summary: 'Data Analyst Intern (June–Sep 2025) — Implemented Python/MongoDB IoT pipelines, ML predictions (Linear Regression), FastAPI dashboard with Chart.js. 40% accuracy improvement, 35% downtime reduction across 230+ devices. 33% faster decision-making, 45% user interaction boost among 200+ stakeholders. 85% uptime, 55% data output increase. Deployed on Azure App Services.',
    x: 3.2, y: -1.4,
    keywords: ['intern', 'experience', 'work', 'yan', 'iot', 'data analyst', 'job', 'internship', 'recent', 'azure', 'fastapi', 'mongodb'],
  },
  {
    id: 'proj-ssp',
    label: 'SSP Project',
    summary: 'Startup Success Predictor (Spring 2026) — 4 ML models (Random Forest, XGBoost, Gradient Boosting, Logistic Regression), Flask REST API, probability-based predictions across 3 success classes, 69.6% CV score, 70% test accuracy, interactive web dashboard.',
    x: -0.5, y: -3.2,
    keywords: ['project', 'startup', 'prediction', 'ssp', 'flask', 'random forest', 'xgboost', 'gradient boosting'],
  },
  {
    id: 'proj-aroma',
    label: 'AROMA Project',
    summary: 'Agentic Restaurant Order Management Automation (Fall 2025) — n8n agentic workflows, Vapi voice AI agent, WhatsApp order notifications, 40% manual time reduction, 60% fewer follow-up calls, 95% automated response rate.',
    x: 0.8, y: -2.8,
    keywords: ['project', 'aroma', 'restaurant', 'automation', 'agent', 'voice', 'whatsapp', 'n8n', 'vapi'],
  },
  {
    id: 'proj-aura',
    label: 'AURA ATLAS Project',
    summary: 'Agentic Geospatial Wellness Network (Spring 2026) — Mapbox GL JS 3D routing with bounding box constraints, 40% false-positive reduction. Next.js navigation HUD with emotional weather system, 60% faster decisions. 2-step fuzzy proximity search algorithm, 95% success for local landmarks. Optimized React state-management, zero-latency transitions across 11 cities.',
    x: 1.8, y: -2.1,
    keywords: ['project', 'aura', 'atlas', 'geospatial', 'wellness', 'mapbox', 'navigation', 'mental health', 'routing', 'next.js', 'react', 'fuzzy search'],
  },
  {
    id: 'certs',
    label: 'Certifications',
    summary: 'AI: Google AI & Productivity, Outskill GenAI Mastermind, Databricks AI Agent Fundamentals, AWS AI Practitioner (Udacity). Development: Quantitative Research J.P. Morgan (Forage), Software Engineering J.P. Morgan (Forage). Other: Claude Code In Action (Anthropic), SQL Essential Training (LinkedIn), Python (Santander).',
    x: -3.1, y: -0.8,
    keywords: ['certification', 'certificate', 'google', 'databricks', 'course', 'credential', 'santander', 'jpmorgan', 'forage', 'quantitative', 'anthropic', 'claude', 'software engineering', 'aws', 'udacity', 'ai practitioner'],
  },
  {
    id: 'contact',
    label: 'Contact Info',
    summary: 'Philadelphia, PA 19122 — (346) 446-8717 — balajipratik8@gmail.com — LinkedIn, GitHub, Kaggle, Portfolio',
    x: 4.0, y: 1.5,
    keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'location', 'philadelphia', 'reach', 'kaggle', 'portfolio'],
  },
  {
    id: 'linkedin-highlights',
    label: 'LinkedIn Highlights',
    summary: 'Recent LinkedIn posts: (1) Accepted an offer for the 2026 Intern Program at Auxilior Capital Partners as an IT intern, applying data science and machine learning to financial tech solutions. (2) Completed the J.P. Morgan Quantitative Research job simulation on Forage — built Python models for credit risk assessment, used dynamic programming to group FICO scores into risk categories.',
    x: 4.2, y: 2.2,
    keywords: ['linkedin', 'post', 'highlights', 'auxilior', 'capital', 'intern', 'jp morgan', 'forage', 'quantitative', 'credit risk', 'fico', 'update', 'news', 'recent'],
  },
  {
    id: 'about',
    label: 'About Me',
    summary: 'Pratik Balaji is a passionate Data Science student at Temple University specializing in AI, machine learning, and building intelligent applications. Based in Philadelphia, PA. Currently open for opportunities. Fluent in Tamil, English, Hindi; novice in Spanish.',
    x: 1.0, y: 4.5,
    keywords: ['about', 'who', 'bio', 'background', 'introduction', 'myself', 'passionate', 'data science', 'philadelphia'],
  },
  {
    id: 'exp-auxilior',
    label: 'Auxilior Capital Partners',
    summary: 'IT Intern at Auxilior Capital Partners (Starting May 2026) — Applying data science and machine learning to real-world challenges in financial tech. Part of the 2026 Intern Program.',
    x: 3.8, y: -0.5,
    keywords: ['auxilior', 'capital', 'partners', 'intern', 'it', 'financial', 'fintech', 'upcoming', '2026', 'may'],
  },
  {
    id: 'cover-letter',
    label: 'Cover Letter',
    summary: 'Pratik Balaji\'s cover letter highlights his foundation in predictive modeling, statistical analysis, and AI. Covers his work at YAN IT Solutions (40% accuracy improvement, 35% downtime reduction), Startup Success Predictor (70% test accuracy), AROMA project (95% automated response rate), and Natraj Beats LLC (60% time-to-market reduction). Technical stack: Python, TensorFlow, scikit-learn, AWS, AI agent frameworks.',
    x: 3.5, y: 3.0,
    keywords: ['cover letter', 'cover', 'letter', 'hiring', 'application', 'apply', 'motivation', 'introduction'],
  },
];

export function findNearestChunks(query: string, count: number = 3) {
  const q = query.toLowerCase();
  const scored = RESUME_CHUNKS.map(chunk => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (q.includes(kw)) score += 1;
      const words = q.split(/\s+/);
      for (const w of words) {
        if (kw.includes(w) && w.length > 2) score += 0.5;
      }
    }
    const baseScore = Math.min(0.97, 0.78 + score * 0.04);
    const jitter = (Math.sin(chunk.x * 17 + chunk.y * 31 + q.length) * 0.03);
    return { chunk, score: Math.round((baseScore + jitter) * 100) / 100 };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count);
}

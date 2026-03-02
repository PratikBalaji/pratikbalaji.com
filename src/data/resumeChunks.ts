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
    summary: 'Temple University — BS Data Science, Computational Analytics (Expected 2027). Coursework: Calculus I-III, Data Structures & Algorithms, Computer Systems & Low-Level Programming, Principles of Data Science, Linear Algebra, Probability Theory, Database Systems. Extracurriculars: Temple Data Analytics Club, Temple Data Science Community, Research Scholars Club.',
    x: 2.1, y: 4.3,
    keywords: ['education', 'university', 'degree', 'temple', 'school', 'study', 'coursework', 'gpa', 'graduation', '2027', 'data analytics club', 'research scholars'],
  },
  {
    id: 'skills-prog',
    label: 'Programming',
    summary: 'Python, C, C++, Java, JavaScript, SQL, R, Bash',
    x: -1.5, y: 2.8,
    keywords: ['python', 'java', 'programming', 'language', 'code', 'skill', 'javascript', 'sql', 'c++', 'bash', 'r'],
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
    summary: 'Adobe Experience Platform (AEP), Real-Time CDP, Customer Journey Analytics (CJA), Data Visualization, EDA',
    x: -1.0, y: 1.5,
    keywords: ['adobe', 'aep', 'cdp', 'customer journey', 'cja', 'visualization', 'eda', 'analytics', 'real-time'],
  },
  {
    id: 'exp-yan',
    label: 'YAN IT Solutions',
    summary: 'Data Analyst Intern (June–Sep 2025) — Python/MongoDB IoT pipelines, ML predictions (Linear Regression), FastAPI dashboard with Chart.js. 40% accuracy improvement, 35% downtime reduction across 230+ devices. 85% uptime, 55% data output increase, 45% user interaction boost for 200+ stakeholders. Deployed on Azure App Services.',
    x: 3.2, y: -1.4,
    keywords: ['intern', 'experience', 'work', 'yan', 'iot', 'data analyst', 'job', 'internship', 'recent', 'azure', 'fastapi', 'mongodb'],
  },
  {
    id: 'exp-natraj',
    label: 'Natraj Beats',
    summary: 'Web Developer & Consultant (Feb 2025–Jan 2026) — Lovable AI framework, 60% faster time-to-market, telemetry & data-tracking, automated booking pipeline, 30% inbound lead boost, UI/UX & SEO optimization.',
    x: 1.8, y: -2.1,
    keywords: ['natraj', 'web', 'developer', 'consultant', 'experience', 'work', 'client', 'seo', 'booking', 'telemetry'],
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
    id: 'certs',
    label: 'Certifications',
    summary: 'AI: Google AI & Productivity, Outskill GenAI Mastermind, Databricks AI Agent Fundamentals. Development: Python (Santander), Quantitative Research J.P. Morgan (Forage), SQL Essential Training (LinkedIn).',
    x: -3.1, y: -0.8,
    keywords: ['certification', 'certificate', 'google', 'databricks', 'course', 'credential', 'santander', 'jpmorgan', 'forage', 'quantitative'],
  },
  {
    id: 'contact',
    label: 'Contact Info',
    summary: 'Philadelphia, PA 19122 — (346) 446-8717 — balajipratik8@gmail.com — LinkedIn, GitHub, Kaggle, Portfolio',
    x: 4.0, y: 1.5,
    keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'location', 'philadelphia', 'reach', 'kaggle', 'portfolio'],
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

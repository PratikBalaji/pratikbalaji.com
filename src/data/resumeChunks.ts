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
    summary: 'Temple University — BS Data Science, Calculus I-III, Data Structures, Linear Algebra',
    x: 2.1, y: 4.3,
    keywords: ['education', 'university', 'degree', 'temple', 'school', 'study', 'coursework', 'gpa'],
  },
  {
    id: 'skills-prog',
    label: 'Programming',
    summary: 'Python, C, C++, Java, JavaScript, SQL, R, Bash, TypeScript',
    x: -1.5, y: 2.8,
    keywords: ['python', 'java', 'programming', 'language', 'code', 'skill', 'javascript', 'sql', 'c++'],
  },
  {
    id: 'skills-ml',
    label: 'AI & ML Stack',
    summary: 'TensorFlow, PyTorch, scikit-learn, Pandas, NumPy, Deep Learning',
    x: -2.3, y: 3.5,
    keywords: ['ai', 'ml', 'machine learning', 'tensorflow', 'deep learning', 'model', 'pytorch', 'neural'],
  },
  {
    id: 'skills-tools',
    label: 'Tools & Cloud',
    summary: 'Docker, Git, AWS, Azure, FastAPI, Flask, MongoDB, PostgreSQL',
    x: -3.1, y: 1.2,
    keywords: ['docker', 'aws', 'cloud', 'tool', 'git', 'azure', 'flask', 'fastapi', 'deploy'],
  },
  {
    id: 'exp-yan',
    label: 'YAN IT Solutions',
    summary: 'Data Analyst Intern — IoT pipelines, ML predictions, 40% accuracy improvement',
    x: 3.2, y: -1.4,
    keywords: ['intern', 'experience', 'work', 'yan', 'iot', 'data analyst', 'job', 'internship', 'recent'],
  },
  {
    id: 'exp-natraj',
    label: 'Natraj Beats',
    summary: 'Web Developer & Consultant — Lovable AI framework, 60% faster time-to-market',
    x: 1.8, y: -2.1,
    keywords: ['natraj', 'web', 'developer', 'consultant', 'experience', 'work', 'client', 'seo'],
  },
  {
    id: 'proj-ssp',
    label: 'SSP Project',
    summary: 'Startup Success Predictor — 4 ML models, Flask API, 70% test accuracy',
    x: -0.5, y: -3.2,
    keywords: ['project', 'startup', 'prediction', 'ssp', 'flask', 'random forest', 'xgboost'],
  },
  {
    id: 'proj-aroma',
    label: 'AROMA Project',
    summary: 'Agentic Restaurant Order Automation — n8n workflows, Vapi voice AI, WhatsApp',
    x: 0.8, y: -2.8,
    keywords: ['project', 'aroma', 'restaurant', 'automation', 'agent', 'voice', 'whatsapp', 'n8n'],
  },
  {
    id: 'certs',
    label: 'Certifications',
    summary: 'Google AI, Outskill GenAI Mastermind, Databricks AI Agent Fundamentals',
    x: -3.1, y: -0.8,
    keywords: ['certification', 'certificate', 'google', 'databricks', 'course', 'credential'],
  },
  {
    id: 'contact',
    label: 'Contact Info',
    summary: 'Philadelphia, PA — balajipratik8@gmail.com — LinkedIn, GitHub, Kaggle',
    x: 4.0, y: 1.5,
    keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'location', 'philadelphia', 'reach'],
  },
];

export function findNearestChunks(query: string, count: number = 3) {
  const q = query.toLowerCase();
  const scored = RESUME_CHUNKS.map(chunk => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (q.includes(kw)) score += 1;
      // Partial word matches
      const words = q.split(/\s+/);
      for (const w of words) {
        if (kw.includes(w) && w.length > 2) score += 0.5;
      }
    }
    // Add small random variation for realism
    const baseScore = Math.min(0.97, 0.78 + score * 0.04);
    const jitter = (Math.sin(chunk.x * 17 + chunk.y * 31 + q.length) * 0.03);
    return { chunk, score: Math.round((baseScore + jitter) * 100) / 100 };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count);
}

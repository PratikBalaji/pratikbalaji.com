import { motion, useInView, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { ExternalLink, GitFork, Star, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWebGL } from '@/hooks/useWebGL';

const ContributionCity = lazy(() => import('@/components/3d/ContributionCity'));
const GITHUB_USERNAME = 'PratikBalaji';
const REFRESH_INTERVAL = 5 * 60 * 1000;

interface DBProject {
  id: string; name: string; description: string; url: string | null;
  homepage: string | null; language: string | null; topics: string[];
  stargazers_count: number; forks_count: number; sort_order: number;
}

function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

interface Repository {
  id: number; name: string; description: string | null; html_url: string;
  stargazers_count: number; forks_count: number; language: string | null;
  updated_at: string; topics: string[]; readme: string | null;
}

interface ContributionDay {
  date: string; count: number; level: 0 | 1 | 2 | 3 | 4;
}

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500', JavaScript: 'bg-yellow-400', Python: 'bg-green-500',
  Java: 'bg-orange-500', HTML: 'bg-red-500', CSS: 'bg-purple-500',
  Jupyter: 'bg-orange-400', 'Jupyter Notebook': 'bg-orange-400',
};

function ContributionCalendar({ contributions }: { contributions: ContributionDay[] }) {
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push(currentWeek); currentWeek = [];
    }
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-secondary hover:bg-muted';
      case 1: return 'bg-accent/20 hover:bg-accent/30';
      case 2: return 'bg-accent/40 hover:bg-accent/50';
      case 3: return 'bg-accent/60 hover:bg-accent/70';
      case 4: return 'bg-accent hover:bg-accent/90';
      default: return 'bg-secondary';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthLabels = () => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const date = parseDateString(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) { labels.push({ month: months[month], index: weekIndex }); lastMonth = month; }
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full pb-2">
      <div className="w-full">
        <div className="flex gap-px sm:gap-[2px] ml-5 sm:ml-6 mb-1">
          {weeks.map((week, weekIndex) => {
            const firstDay = week[0];
            const date = parseDateString(firstDay.date);
            return (
              <div key={weekIndex} className="flex-1 text-center">
                {date.getDate() <= 7 ? (
                  <span className="text-[7px] sm:text-[9px] text-muted-foreground">{months[date.getMonth()]}</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="flex gap-px sm:gap-[2px]">
          <div className="flex flex-col gap-px sm:gap-[2px] mr-0.5 shrink-0">
            {days.map((day, i) => (
              <div key={day} className="h-[8px] sm:h-[10px] text-[7px] sm:text-[9px] text-muted-foreground leading-[8px] sm:leading-[10px] w-4 sm:w-5">
                {i % 2 === 1 ? day.slice(0, 2) : ''}
              </div>
            ))}
          </div>
          <div className="flex gap-px sm:gap-[2px] flex-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-px sm:gap-[2px] flex-1">
                {week.map((day) => (
                  <div key={day.date} className={`aspect-square w-full rounded-[1px] sm:rounded-sm ${getLevelColor(day.level)} transition-colors cursor-pointer`}
                    title={`${day.date}: ${day.count} contributions`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 mt-3 text-[9px] sm:text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] sm:rounded-sm ${getLevelColor(level)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo, index }: { repo: Repository; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 }}
      className="group block"
    >
      <TiltCard className="relative rounded-xl">
        <div className="h-full rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate pr-2">
              {repo.name}
            </h3>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          {repo.readme ? (
            <div className="text-sm text-muted-foreground mb-4 max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
              {repo.readme}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">{repo.description || 'No description available'}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                <span>{repo.language}</span>
              </div>
            )}
            {repo.stargazers_count > 0 && (
              <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{repo.stargazers_count}</span></div>
            )}
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1"><GitFork className="w-4 h-4" /><span>{repo.forks_count}</span></div>
            )}
          </div>
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {repo.topics.slice(0, 3).map((topic) => (
                <span key={topic} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </TiltCard>
    </motion.a>
  );
}

export default function GitHub() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [dbProjects, setDbProjects] = useState<DBProject[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isWebGL = useWebGL();
  const [mode, setMode] = useState<'3d' | '2d'>(isWebGL ? '3d' : '2d');

  // Fetch projects from DB
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order');
      if (!error && data) setDbProjects(data as DBProject[]);
      setProjectsLoading(false);
    }
    fetchProjects();
  }, []);

  const fetchGitHubData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const { data, error } = await supabase.functions.invoke('github-contributions', {
        body: { username: GITHUB_USERNAME, from: '2026-01-01T00:00:00Z', to: '2026-12-31T23:59:59Z' },
      });
      if (!error && data?.contributions) {
        // Pad contributions to cover the full year (Jan 1 – Dec 31)
        const contribMap = new Map<string, ContributionDay>();
        for (const c of data.contributions) {
          contribMap.set(c.date, c);
        }
        const fullYear: ContributionDay[] = [];
        const start = new Date(2026, 0, 1);
        const end = new Date(2026, 11, 31);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          fullYear.push(contribMap.get(key) || { date: key, count: 0, level: 0 });
        }
        setContributions(fullYear);
        setTotalContributions(data.totalContributions || 0);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubData();
    const intervalId = setInterval(() => fetchGitHubData(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchGitHubData]);

  return (
    <section id="github" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <ScrollReveal className="text-center mb-10">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">Open Source</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">GitHub Activity</h2>
        </ScrollReveal>

        {/* Mode Toggle - 3D City vs 2D Calendar */}
        {isWebGL && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm font-medium transition-colors ${mode === '3d' ? 'text-accent' : 'text-muted-foreground'}`}>
              3D City
            </span>
            <button
              onClick={() => setMode(mode === '3d' ? '2d' : '3d')}
              className="relative w-14 h-7 rounded-full bg-secondary transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle between 3D city and 2D calendar view"
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-accent shadow-md"
                animate={{ left: mode === '3d' ? '2px' : '26px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${mode === '2d' ? 'text-accent' : 'text-muted-foreground'}`}>
              2D Calendar
            </span>
          </div>
        )}

        {/* Contribution Activity */}
        <div className="rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-lg text-foreground">Contribution Activity</h3>
            <div className="ml-auto flex items-center gap-3">
              {totalContributions > 0 && (
                <span className="text-sm text-muted-foreground">{totalContributions} contributions in the last year</span>
              )}
              {lastUpdated && (
                <span className="text-xs text-muted-foreground hidden sm:inline">Updated {lastUpdated.toLocaleTimeString()}</span>
              )}
              <button onClick={() => fetchGitHubData(true)} disabled={refreshing}
                className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="w-full h-[400px] rounded-xl bg-muted/20 animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground text-sm font-mono">Loading contribution data...</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {mode === '3d' && isWebGL ? (
                <motion.div key="3d" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <Suspense fallback={
                    <div className="w-full h-[400px] rounded-xl bg-background flex items-center justify-center">
                      <div className="text-accent/60 text-sm font-mono animate-pulse">Initializing 3D city...</div>
                    </div>
                  }>
                    <ContributionCity contributions={contributions} />
                  </Suspense>
                </motion.div>
              ) : (
                <motion.div key="2d" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <ContributionCalendar contributions={contributions} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Repositories - always visible */}
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-foreground">
          <svg className="w-5 h-5 text-accent" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
          Highlighted Projects
        </h3>
        {projectsLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl p-5 animate-pulse">
                <div className="h-5 w-40 bg-muted rounded mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-6 w-16 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {dbProjects.map((project, index) => (
              <RepoCard
                key={project.id}
                repo={{
                  id: index,
                  name: project.name,
                  description: project.description,
                  html_url: project.url || '#',
                  stargazers_count: project.stargazers_count,
                  forks_count: project.forks_count,
                  language: project.language,
                  updated_at: '',
                  topics: project.topics || [],
                  readme: null,
                }}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a href="https://github.com/PratikBalaji?tab=repositories" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
            View all repositories on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

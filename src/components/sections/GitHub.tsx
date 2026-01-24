import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ExternalLink, GitFork, Star, Calendar } from 'lucide-react';

const GITHUB_USERNAME = 'PratikBalaji';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-500',
  Java: 'bg-orange-500',
  HTML: 'bg-red-500',
  CSS: 'bg-purple-500',
  Jupyter: 'bg-orange-400',
  'Jupyter Notebook': 'bg-orange-400',
  Go: 'bg-cyan-500',
  Rust: 'bg-amber-600',
  C: 'bg-gray-500',
  'C++': 'bg-pink-500',
  Ruby: 'bg-red-600',
  PHP: 'bg-indigo-400',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-purple-400',
  Dart: 'bg-blue-400',
  Shell: 'bg-green-400',
};

function ContributionCalendar({ contributions }: { contributions: ContributionDay[] }) {
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted hover:bg-muted/80';
      case 1: return 'bg-primary/30 hover:bg-primary/40';
      case 2: return 'bg-primary/50 hover:bg-primary/60';
      case 3: return 'bg-primary/70 hover:bg-primary/80';
      case 4: return 'bg-primary hover:bg-primary/90';
      default: return 'bg-muted';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get month labels for the calendar
  const getMonthLabels = () => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], index: weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[750px]">
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {monthLabels.map(({ month, index }) => (
            <div
              key={`${month}-${index}`}
              className="text-xs text-muted-foreground"
              style={{ marginLeft: index === 0 ? 0 : `${(index - (monthLabels[monthLabels.indexOf({ month, index }) - 1]?.index || 0)) * 14 - 20}px` }}
            >
              {month}
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {days.map((day, i) => (
              <div key={day} className="h-[12px] text-[10px] text-muted-foreground leading-[12px]">
                {i % 2 === 1 ? day.slice(0, 3) : ''}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(day.level)} transition-colors cursor-pointer`}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(level)}`}
            />
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group block"
    >
      <div className="h-full bg-background rounded-xl p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
            {repo.name}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
          {repo.description || 'No description available'}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
              <span>{repo.language}</span>
            </div>
          )}
          
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{repo.stargazers_count}</span>
            </div>
          )}
          
          {repo.forks_count > 0 && (
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
}

export default function GitHub() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [repos, setRepos] = useState<Repository[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );
        const reposData = await reposResponse.json();
        setRepos(reposData.filter((repo: Repository) => !repo.name.includes('.github')));

        // Fetch contribution events and generate calendar data
        const eventsResponse = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`
        );
        const eventsData = await eventsResponse.json();

        // Generate contribution calendar from events
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Create a map of dates to contribution counts
        const contributionMap = new Map<string, number>();
        
        if (Array.isArray(eventsData)) {
          eventsData.forEach((event: { type: string; created_at: string }) => {
            if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
              const date = new Date(event.created_at).toISOString().split('T')[0];
              contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
            }
          });
        }

        // Generate all days in the past year
        const days: ContributionDay[] = [];
        const currentDate = new Date(oneYearAgo);
        
        // Start from the beginning of the week
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
        
        while (currentDate <= today) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const count = contributionMap.get(dateStr) || 0;
          let level: 0 | 1 | 2 | 3 | 4 = 0;
          
          if (count > 0) level = 1;
          if (count > 2) level = 2;
          if (count > 5) level = 3;
          if (count > 10) level = 4;
          
          days.push({ date: dateStr, count, level });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setContributions(days);
        setTotalContributions(Array.from(contributionMap.values()).reduce((a, b) => a + b, 0));
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <section id="github" className="section-padding" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Open Source
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            GitHub Activity
          </h2>
        </motion.div>

        {/* Contribution Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background rounded-2xl p-6 border border-border shadow-soft mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Contribution Activity</h3>
            {totalContributions > 0 && (
              <span className="text-sm text-muted-foreground ml-auto">
                {totalContributions} contributions in the last year
              </span>
            )}
          </div>
          
          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ContributionCalendar contributions={contributions} />
          )}
        </motion.div>

        {/* Recent Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
            </svg>
            Recent Repositories
          </h3>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.slice(0, 6).map((repo, index) => (
                <RepoCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* View More Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View all repositories on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

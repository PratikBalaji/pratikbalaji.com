import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RotateCcw, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ScrollReveal from '@/components/ScrollReveal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Fintech', 'E-Commerce', 'EdTech',
  'AI / Machine Learning', 'SaaS', 'Clean Energy', 'Biotech', 'Gaming',
];

type PredictionResult = {
  outcome: 'IPO' | 'Acquired' | 'Private';
  confidence: { IPO: number; Acquired: number; Private: number };
};

const OUTCOME_COLORS: Record<string, string> = {
  IPO: 'hsl(142 71% 45%)',
  Acquired: 'hsl(270 100% 64%)',
  Private: 'hsl(38 92% 50%)',
};

function simulatePrediction(funding: number, industry: string, employees: number, revenue: number): PredictionResult {
  // Deterministic-ish simulation based on inputs
  const seed = (funding * 0.3 + employees * 0.2 + revenue * 0.4 + industry.length * 2) % 100;
  let ipo = 15 + (funding > 50 ? 25 : 0) + (revenue > 5 ? 15 : 0) + (seed % 10);
  let acquired = 30 + (employees > 200 ? 10 : 0) + (funding > 20 ? 10 : 0) + ((seed * 3) % 12);
  let priv = 100 - ipo - acquired;
  if (priv < 5) { priv = 5; ipo -= 3; acquired -= 2; }
  const total = ipo + acquired + priv;
  ipo = Math.round((ipo / total) * 100);
  acquired = Math.round((acquired / total) * 100);
  priv = 100 - ipo - acquired;

  const outcome = ipo >= acquired && ipo >= priv ? 'IPO' : acquired >= priv ? 'Acquired' : 'Private';
  return { outcome, confidence: { IPO: ipo, Acquired: acquired, Private: priv } };
}

export default function AIPlayground() {
  const [funding, setFunding] = useState(25);
  const [industry, setIndustry] = useState('Technology');
  const [employees, setEmployees] = useState(100);
  const [revenue, setRevenue] = useState(2);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const predict = async () => {
    setIsLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800 + Math.random() * 1200));
    setResult(simulatePrediction(funding, industry, employees, revenue));
    setIsLoading(false);
  };

  const reset = () => { setResult(null); setFunding(25); setIndustry('Technology'); setEmployees(100); setRevenue(2); };

  const chartData = result ? [
    { name: 'IPO', value: result.confidence.IPO },
    { name: 'Acquired', value: result.confidence.Acquired },
    { name: 'Private', value: result.confidence.Private },
  ] : [];

  return (
    <section id="playground" className="section-padding bg-background">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-16">
          <p className="section-label">Live Demo</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI Playground
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Try my Startup Success Predictor — adjust parameters and see a simulated ML inference in action.
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <ScrollReveal direction="left">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
                <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Model Parameters
                </h3>

                {/* Funding */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Funding Amount</span>
                    <span className="font-mono font-semibold text-foreground">${funding}M</span>
                  </div>
                  <Slider value={[funding]} onValueChange={v => setFunding(v[0])} min={1} max={200} step={1} className="w-full" />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Employees */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="font-mono font-semibold text-foreground">{employees}</span>
                  </div>
                  <Slider value={[employees]} onValueChange={v => setEmployees(v[0])} min={1} max={1000} step={5} className="w-full" />
                </div>

                {/* Revenue */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Revenue</span>
                    <span className="font-mono font-semibold text-foreground">${revenue}M</span>
                  </div>
                  <Slider value={[revenue]} onValueChange={v => setRevenue(v[0])} min={0} max={50} step={0.5} className="w-full" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={predict}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-accent text-accent-foreground shadow-[0_0_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.6)] transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isLoading ? 'Running Inference...' : 'Predict Success'}
                  </motion.button>
                  {result && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={reset}
                      className="w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Results Panel */}
            <ScrollReveal direction="right">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[420px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-6"
                    >
                      <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-border" />
                        <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                        <div className="absolute inset-3 rounded-full border-4 border-accent/30 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                      </div>
                      <div>
                        <p className="font-display font-bold text-foreground">Running Model...</p>
                        <p className="text-sm text-muted-foreground mt-1">Analyzing {employees} employees, ${funding}M funding</p>
                      </div>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="w-full space-y-6"
                    >
                      {/* Outcome Badge */}
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold"
                          style={{
                            backgroundColor: `${OUTCOME_COLORS[result.outcome]}20`,
                            color: OUTCOME_COLORS[result.outcome],
                            border: `2px solid ${OUTCOME_COLORS[result.outcome]}40`,
                            boxShadow: `0 0 25px ${OUTCOME_COLORS[result.outcome]}30`,
                          }}
                        >
                          <Sparkles className="w-5 h-5" />
                          Predicted: {result.outcome}
                        </motion.div>
                      </div>

                      {/* Chart */}
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                              animationBegin={300}
                              animationDuration={800}
                            >
                              {chartData.map((entry) => (
                                <Cell key={entry.name} fill={OUTCOME_COLORS[entry.name]} strokeWidth={0} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => `${value}%`}
                              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Breakdown */}
                      <div className="grid grid-cols-3 gap-3">
                        {chartData.map((item, i) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="text-center p-3 rounded-xl bg-secondary/50 border border-border"
                          >
                            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: OUTCOME_COLORS[item.name] }} />
                            <p className="text-xs text-muted-foreground">{item.name}</p>
                            <p className="font-mono font-bold text-foreground">{item.value}%</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-3"
                    >
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-accent" />
                      </div>
                      <p className="font-display font-bold text-foreground">Ready to Predict</p>
                      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                        Adjust parameters and hit predict to see simulated ML results
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

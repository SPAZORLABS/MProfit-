'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatPercent, formatCurrency } from '@Aurapex/shared';
import { MomentumScore } from '@Aurapex/shared';
import {
  mockPerformanceMetrics,
  mockPerformanceData,
  mockSectorAttribution,
  mockAIInsights,
} from '@/lib/mock-data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  ChevronDown,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TIME_PERIODS = ['1Y', '3Y', '5Y', 'MAX'] as const;

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('3Y');
  const metrics = mockPerformanceMetrics;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-blue" />
            Portfolio Analytics
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Detailed performance mapping and institutional-grade attribution.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Period Tabs */}
          <div className="flex items-center bg-surface-muted/30 rounded-xl border border-border p-1 shadow-inner">
            {TIME_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all',
                  selectedPeriod === period
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-surface/50'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {/* Asset Filter */}
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border bg-surface shadow-sm rounded-xl text-text-secondary hover:text-text-primary hover:border-brand-blue/30 transition-all">
            All Assets
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
        {/* XIRR */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl group-hover:bg-brand-green/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Extended Internal Rate of Return</span>
              <TrendingUp className="w-4 h-4 text-brand-green" />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black tracking-tight text-brand-green">{metrics.xirr}%</span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-surface-muted/50 p-2 rounded-lg border border-border/50 inline-flex">
              <span className="text-gain px-1.5 py-0.5 bg-gain/10 rounded">+{Math.max(0, metrics.xirr - metrics.benchmarkXirr).toFixed(1)}%</span>
              <span className="text-text-tertiary">vs Benchmark</span>
            </div>
          </div>
        </AnimatedCard>

        {/* 3Y CAGR */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">3Y Compounded Annual Growth</span>
              <Activity className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black tracking-tight text-text-primary">{metrics.cagr3Y}%</span>
            </div>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-5">Last Updated: <span className="text-text-primary">Today</span></p>
          </div>
        </AnimatedCard>

        {/* Absolute Return */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-muted rounded-full blur-2xl group-hover:bg-border/30 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Absolute Wealth Creation</span>
              <span className="text-xs font-bold text-text-secondary bg-surface-muted/50 px-2 py-1 rounded-md border border-border/50">INR</span>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-black tracking-tight text-text-primary">
                {formatCompactINR(metrics.absoluteReturnValue)}
              </span>
            </div>
            <p className="text-xs font-semibold text-text-secondary mt-4 flex items-center gap-1.5">
              <span className="text-text-tertiary">≈</span> {formatCompactINR(metrics.absoluteReturnValue / 10)} USD
            </p>
          </div>
        </AnimatedCard>
      </div>

      {/* ─── Performance Chart + AI Insights ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart (2 cols) */}
        <AnimatedCard className="lg:col-span-2 p-8 border border-border shadow-sm rounded-2xl bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold text-text-primary">Performance Trajectory</h2>
            <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2 bg-surface-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                <div className="w-3 h-3 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(10,132,255,0.5)]" />
                <span className="text-text-primary">Aurapex Portfolio</span>
              </div>
              <div className="flex items-center gap-2 px-2">
                <div className="w-3 h-0.5 bg-text-tertiary rounded-full" />
                <span className="text-text-secondary">Nifty 50</span>
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).toUpperCase();
                  }}
                  interval={8}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                  domain={['auto', 'auto']}
                  dx={-10}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl p-4 shadow-xl text-sm min-w-[200px]">
                          <p className="font-bold text-text-tertiary uppercase tracking-widest text-[10px] mb-3 border-b border-border/50 pb-2">
                            {new Date(label).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          {payload.map((p, i) => (
                            <div key={i} className="flex items-center justify-between mb-1.5 last:mb-0">
                               <span className="text-text-secondary font-semibold text-xs">{p.name}</span>
                               <span className="font-black text-text-primary">₹{Number(p.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  name="Portfolio"
                  stroke="#0a84ff"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#0a84ff', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  name="Nifty 50"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4, fill: '#9ca3af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* AI Insights Sidebar */}
        <div className="space-y-4">
          {/* Allocation Drift */}
          <AnimatedCard className="p-5 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-amber group-hover:w-2 transition-all" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-amber/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              </div>
              <span className="text-[10px] font-bold text-brand-amber uppercase tracking-widest">Aurapex Intelligence</span>
            </div>
            <h4 className="text-base font-bold text-text-primary mb-2">Allocation Drift Detected</h4>
            <p className="text-sm font-medium text-text-secondary leading-relaxed mb-4">
              Your <span className="text-text-primary font-bold">International Equity</span> is <span className="text-brand-amber font-bold">8% overweight</span> compared to your target asset model.
            </p>
            <button className="text-[10px] font-bold text-brand-amber uppercase tracking-widest hover:text-brand-amber-dark transition-colors flex items-center gap-1.5 bg-brand-amber/5 px-3 py-2 rounded-lg border border-brand-amber/20 w-max">
              Rebalance Portfolio <ArrowRight className="w-3 h-3" />
            </button>
          </AnimatedCard>

          {/* Fund Overlap */}
          <AnimatedCard className="p-5 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-purple group-hover:w-2 transition-all" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-purple/10 flex items-center justify-center">
                 <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              </div>
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Aurapex Intelligence</span>
            </div>
            <h4 className="text-base font-bold text-text-primary mb-2">Fund Overlap Warning</h4>
            <p className="text-sm font-medium text-text-secondary leading-relaxed mb-4">
              HDFC Top 100 and ICICI Bluechip share <span className="text-brand-purple font-bold">42% common holdings</span> (Reliance, HDFC Bank).
            </p>
            <button className="text-[10px] font-bold text-brand-purple uppercase tracking-widest hover:text-brand-purple-dark transition-colors flex items-center gap-1.5 bg-brand-purple/5 px-3 py-2 rounded-lg border border-brand-purple/20 w-max">
              View Detailed Map <ArrowRight className="w-3 h-3" />
            </button>
          </AnimatedCard>
        </div>
      </div>

      {/* ─── Sector Attribution Table ──────────────────────────── */}
      <AnimatedCard className="overflow-hidden border border-border shadow-sm rounded-2xl bg-surface">
        <div className="px-8 py-6 border-b border-border/50 bg-surface-muted/30">
          <h2 className="text-xl font-bold text-text-primary">Sectoral Attribution</h2>
          <p className="text-sm font-medium text-text-secondary mt-1">Breakdown of wealth creation by industrial segments.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-surface-muted/10">
                <th className="text-left px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Sector</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Allocation Weight</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Absolute Contribution</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">1Y Performance</th>
                <th className="text-right px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Momentum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockSectorAttribution.map((sector, index) => (
                <tr key={sector.sector} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center text-xl">
                        {sector.icon}
                      </div>
                      <span className="text-sm font-bold text-text-primary">{sector.sector}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-surface-muted rounded-full overflow-hidden border border-border/50 shadow-inner">
                        <div
                          className="h-full bg-brand-blue rounded-full"
                          style={{ width: `${(sector.weightage / 40) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-secondary">{sector.weightage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-text-primary">{formatCompactINR(sector.contribution)}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={cn('text-sm font-black', sector.performance1Y >= 0 ? 'text-gain' : 'text-loss')}>
                      {formatPercent(sector.performance1Y)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={cn(
                        'inline-flex text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm',
                        sector.momentumScore === MomentumScore.HIGH && 'bg-brand-green/10 text-brand-green border-brand-green/20',
                        sector.momentumScore === MomentumScore.NEUTRAL && 'bg-brand-amber/10 text-brand-amber border-brand-amber/20',
                        sector.momentumScore === MomentumScore.LOW && 'bg-brand-red/10 text-brand-red border-brand-red/20',
                      )}
                    >
                      {sector.momentumScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      {/* ─── Export Analysis Section ───────────────────────────── */}
      <AnimatedCard className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-border shadow-md">
        {/* Report Preview */}
        <div className="lg:col-span-2 relative bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center p-8 flex flex-col justify-end min-h-[250px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#091020] via-[#091020]/80 to-[#091020]/40 backdrop-blur-[2px]" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-brand-blue/20 rounded-xl border border-brand-blue/30 flex items-center justify-center mb-4 backdrop-blur-md">
               <BarChart3 className="w-6 h-6 text-brand-blue" />
            </div>
            <h3 className="text-white text-2xl font-black tracking-tight mb-2">Investment Strategy Report</h3>
            <p className="text-text-secondary font-medium text-sm">Q1 2024 Market Outlook and Rebalancing Guide</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="lg:col-span-3 bg-surface p-8 sm:p-10 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-text-primary mb-3">Export Intelligence</h3>
          <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed max-w-xl">
            Download a comprehensive PDF report including tax-loss harvesting recommendations, attribution modeling, and AI-generated insights for your next advisor meeting.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button className="flex items-center gap-2 h-12 px-6 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
              <Download className="w-4 h-4" />
              Download Full PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12 px-6 text-xs font-bold uppercase tracking-widest rounded-xl border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all">
              <Share2 className="w-4 h-4" />
              Secure Share
            </Button>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

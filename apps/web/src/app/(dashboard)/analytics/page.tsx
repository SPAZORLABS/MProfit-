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
} from 'lucide-react';

const TIME_PERIODS = ['1Y', '3Y', '5Y', 'MAX'] as const;

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('3Y');
  const metrics = mockPerformanceMetrics;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Portfolio Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">
            Detailed performance mapping and institutional-grade attribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Period Tabs */}
          <div className="flex items-center bg-surface rounded-lg border border-border p-0.5">
            {TIME_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all',
                  selectedPeriod === period
                    ? 'bg-sidebar text-white'
                    : 'text-text-tertiary hover:text-text-primary'
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {/* Asset Filter */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
            All Assets
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        {/* XIRR */}
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">XIRR</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-gain">{metrics.xirr}%</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
            <span className="text-gain">+{(metrics.xirr - metrics.benchmarkXirr).toFixed(1)}%</span>
            <span className="text-text-tertiary">vs</span>
            <span>Benchmark</span>
          </div>
        </div>

        {/* 3Y CAGR */}
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">3Y CAGR</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-text-primary">{metrics.cagr3Y}%</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">Last Updated: Today</p>
        </div>

        {/* Absolute Return */}
        <div className="kpi-card">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Absolute Return</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-text-primary">
              {formatCompactINR(metrics.absoluteReturnValue)}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            ~ {formatCompactINR(metrics.absoluteReturnValue / 10)}
          </p>
        </div>
      </div>

      {/* ─── Performance Chart + AI Insights ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart (2 cols) */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Performance Growth</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-sidebar rounded-full" />
                <span className="text-text-secondary">Aurapex Portfolio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-text-tertiary rounded-full" />
                <span className="text-text-secondary">Nifty 50</span>
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }}
                  interval={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-dropdown text-xs">
                          <p className="font-medium text-text-primary mb-1">
                            {new Date(label).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          {payload.map((p, i) => (
                            <p key={i} className="text-text-secondary">
                              {p.name}: <span className="font-semibold text-text-primary">{Number(p.value).toFixed(1)}</span>
                            </p>
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
                  stroke="#1a1f2e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#1a1f2e' }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmarkValue"
                  name="Nifty 50"
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 3, fill: '#9ca3af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-4">
          {/* Allocation Drift */}
          <div className="card p-4 border-l-4 border-l-brand-amber">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">AI Insight</span>
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">Allocation Drift</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              Your &quot;International Equity&quot; is 8% overweight compared to your target asset model.
            </p>
            <button className="text-xs font-semibold text-text-primary hover:text-brand-green transition-colors flex items-center gap-1">
              Rebalance Portfolio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fund Overlap */}
          <div className="card p-4 border-l-4 border-l-brand-purple">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">AI Insight</span>
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">Fund Overlap</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              HDFC Top 100 and ICICI Bluechip share 42% common holdings (Reliance, HDFC Bank).
            </p>
            <button className="text-xs font-semibold text-text-primary hover:text-brand-green transition-colors flex items-center gap-1">
              View Detailed Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Sector Attribution Table ──────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-text-primary">Performance Attribution (Sectoral)</h2>
          <p className="text-sm text-text-secondary mt-0.5">Breakdown of wealth creation by industrial segments.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-6">Sector</th>
                <th>Weightage</th>
                <th className="text-right">Contribution (₹)</th>
                <th className="text-right">1Y Performance</th>
                <th className="text-right pr-6">Momentum Score</th>
              </tr>
            </thead>
            <tbody>
              {mockSectorAttribution.map((sector, index) => (
                <tr key={sector.sector}>
                  <td className="pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{sector.icon}</span>
                      <span className="text-sm font-semibold text-text-primary">{sector.sector}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-bg-alt rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sidebar rounded-full"
                          style={{ width: `${(sector.weightage / 40) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-text-secondary">{sector.weightage}%</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-sm text-text-primary">{formatCompactINR(sector.contribution)}</span>
                  </td>
                  <td className="text-right">
                    <span className={cn('text-sm font-semibold', sector.performance1Y >= 0 ? 'text-gain' : 'text-loss')}>
                      {formatPercent(sector.performance1Y)}
                    </span>
                  </td>
                  <td className="text-right pr-6">
                    <span
                      className={cn(
                        'inline-block text-xs font-bold uppercase tracking-wider',
                        sector.momentumScore === MomentumScore.HIGH && 'text-gain',
                        sector.momentumScore === MomentumScore.NEUTRAL && 'text-brand-amber',
                        sector.momentumScore === MomentumScore.LOW && 'text-loss',
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
      </div>

      {/* ─── Export Analysis Section ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden card">
        {/* Report Preview */}
        <div className="relative bg-gradient-to-br from-sidebar to-[#0f172a] p-8 flex flex-col justify-end min-h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-white text-lg font-bold">Investment Strategy Report</h3>
            <p className="text-gray-400 text-sm mt-1">Q1 2024 Market Outlook and Rebalancing Guide</p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-brand-green p-8 flex flex-col justify-center">
          <h3 className="text-white text-lg font-bold mb-2">Export Analysis</h3>
          <p className="text-green-100 text-sm mb-6 leading-relaxed">
            Download a comprehensive PDF report including tax-loss harvesting recommendations and attribution modeling.
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-sidebar rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors border border-white/20">
              <Share2 className="w-4 h-4" />
              Share with Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactINR, formatPercent } from '@Aurapex/shared';
import { TaxType } from '@Aurapex/shared';
import { useAuth } from '@/hooks/useAuth';
import { ApiClient } from '@/lib/api-client';
import { mockTaxOptimizationInsight } from '@/lib/mock-data'; // Keep insight mock for now since it requires AI triggering
import {
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Scale,
  TrendingUp,
  Receipt,
  FileText
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TaxPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [tax, setTax] = React.useState<any>(null);
  const [taxLots, setTaxLots] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const insight = mockTaxOptimizationInsight;

  const fetchTaxData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Determine the financial year (e.g. 2024-04-01 to 2025-03-31)
      const startDate = '2024-04-01T00:00:00.000Z';
      const endDate = '2025-03-31T23:59:59.999Z';

      const portfolios = await ApiClient.getPortfolios() as any[];
      if (portfolios && portfolios.length > 0) {
        const primaryPortfolioId = portfolios[0].id;

        // Fetch Summary
        const summaryResponse = await ApiClient.getCapitalGains(startDate, endDate, primaryPortfolioId);
        setTax(summaryResponse);

        // Fetch Lots (we mock fetching lots for a specific holding, or we can use the records returned by summary)
        // Since getCapitalGains returns `records`, we can use that for the table if we want.
        // For demonstration, we'll map the `records` to the table format.
        if ((summaryResponse as any).records) {
          setTaxLots((summaryResponse as any).records);
        }
      } else {
        setError('No portfolios found.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load tax data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTaxData();
    }
  }, [authLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-blue mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase text-brand-blue">Analyzing Tax Ledgers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 flex flex-col items-center justify-center h-[calc(100vh-100px)] text-brand-red">
        <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-brand-red" />
        </div>
        <p className="text-xl font-bold mb-6 tracking-tight text-text-primary">{error}</p>
        <Button onClick={fetchTaxData} className="px-6 h-12 bg-brand-primary text-white font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
          Retry Analysis
        </Button>
      </div>
    );
  }

  if (!tax) return null;

  // Use the records for the table, mapping them appropriately
  const displayRecords = taxLots.length > 0 ? taxLots : [];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <Scale className="w-8 h-8 text-brand-blue" />
            Tax Intelligence & Harvesting
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            FY {tax.fiscalYear} Portfolio Compliance and Optimization Engine
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border bg-surface shadow-sm rounded-xl text-text-secondary hover:text-text-primary hover:border-brand-blue/30 transition-all">
            FY {tax.fiscalYear}
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button className="flex items-center gap-2 h-12 px-6 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
            <RefreshCw className="w-4 h-4 mr-1" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* ─── Tax KPI Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {/* STCG */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-amber/5 rounded-full blur-2xl group-hover:bg-brand-amber/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Short Term Gain (STCG)
              </span>
              <TrendingUp className="w-4 h-4 text-brand-amber" />
            </div>
            <p className="text-4xl font-black tracking-tight text-text-primary mt-4">
              {formatCompactINR(tax.summary?.totalSTCG || 0)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gain mt-4 flex items-center gap-1 bg-gain/10 px-2 py-1 rounded-md w-max border border-gain/20 shadow-sm">
              ↑ +12.4% vs LY
            </p>
          </div>
        </AnimatedCard>

        {/* LTCG */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Long Term Gain (LTCG)
              </span>
              <TrendingUp className="w-4 h-4 text-brand-purple" />
            </div>
            <p className="text-4xl font-black tracking-tight text-text-primary mt-4">
              {formatCompactINR(tax.summary?.totalLTCG || 0)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-4 flex items-center gap-1 bg-surface-muted/50 px-2 py-1 rounded-md w-max border border-border/50">
              ₹1L Exemption Applied
            </p>
          </div>
        </AnimatedCard>

        {/* Estimated Liability */}
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl group-hover:bg-brand-red/10 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Estimated Liability
              </span>
              <Receipt className="w-4 h-4 text-brand-red" />
            </div>
            <p className="text-4xl font-black tracking-tight text-brand-red mt-4">
              {formatCompactINR(tax.summary?.taxableLTCG || 0)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red mt-4 flex items-center gap-1.5 bg-brand-red/10 px-2 py-1 rounded-md w-max border border-brand-red/20 shadow-sm">
              <AlertTriangle className="w-3 h-3" />
              Due by March 31
            </p>
          </div>
        </AnimatedCard>

        {/* Harvesting Savings */}
        <AnimatedCard className="p-6 border border-brand-green/30 shadow-md rounded-2xl bg-brand-green/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-colors" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">
                Harvesting Savings Potential
              </span>
              <Sparkles className="w-4 h-4 text-brand-green" />
            </div>
            <p className="text-4xl font-black tracking-tight text-brand-green mt-4 drop-shadow-sm">
              {formatCompactINR(150000)} {/* Static fallback for harvesting potential */}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-green/80 mt-4 bg-brand-green/10 px-2 py-1 rounded-md w-max border border-brand-green/20 shadow-sm">
              Across active positions
            </p>
          </div>
        </AnimatedCard>
      </div>

      {/* ─── AI Optimization Insight ──────────────────────────── */}
      <AnimatedCard className="p-8 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-brand-blue to-brand-purple" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 flex items-center justify-center border border-brand-blue/30 shadow-inner backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-brand-blue drop-shadow-sm" />
          </div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Aurapex Tax Intelligence</h2>
        </div>

        <p className="text-sm font-medium text-text-secondary leading-relaxed mb-8 max-w-4xl">
          {insight.description.split('**').map((part, i) =>
            i % 2 === 1 ? (
              <span key={i} className="font-bold text-text-primary mx-1 px-1 bg-surface-muted rounded border border-border/50">{part}</span>
            ) : (
              <React.Fragment key={i}>{part}</React.Fragment>
            )
          )}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button className="flex items-center gap-2 h-12 px-6 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
            Execute Trade Suggestion <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-12 px-6 text-xs font-bold uppercase tracking-widest rounded-xl border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all">
            View Detailed Analysis
          </Button>
        </div>
      </AnimatedCard>

      {/* ─── Tax Lot Accounting Table ─────────────────────────── */}
      <AnimatedCard className="overflow-hidden border border-border shadow-sm rounded-2xl bg-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 border-b border-border/50 bg-surface-muted/30 gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Tax Lot Accounting</h2>
            <p className="text-sm font-medium text-text-secondary mt-1">Detailed breakdown of acquisitions and tax liabilities.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-border bg-surface shadow-sm hover:border-brand-blue/30 transition-all text-text-secondary hover:text-text-primary">
              <Filter className="w-4 h-4" />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search lots..." className="pl-9 h-10 w-48 text-sm bg-surface border border-border rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all shadow-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-surface-muted/10">
                <th className="text-left px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Holding Name</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Acquisition Date</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Qty</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Cost Basis</th>
                <th className="text-center px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Grandfathered</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Unrealized P&L</th>
                <th className="text-center px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {displayRecords.map((record: any, idx: number) => (
                <tr key={record.transactionId || idx} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-text-primary tracking-tight">
                      {record.assetName || 'Unknown Asset'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-text-secondary">
                      {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-text-primary">
                      {Number(record.quantitySold || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-text-primary">
                      {formatCurrency(record.costBasis || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border shadow-sm',
                        record.method === 'FIFO_LOT_MATCHING' 
                          ? 'bg-brand-green/10 text-brand-green border-brand-green/20' 
                          : 'bg-brand-amber/10 text-brand-amber border-brand-amber/20'
                      )}
                    >
                      {record.method === 'FIFO_LOT_MATCHING' ? 'MATCHED' : 'ESTIMATED'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span
                      className={cn(
                        'text-sm font-black',
                        (record.gain || 0) >= 0 ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {(record.gain || 0) >= 0 ? '+ ' : '- '}
                      {formatCurrency(Math.abs(record.gain || 0))}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border shadow-sm', 
                      record.type === 'LTCG' 
                        ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' 
                        : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                      )}>
                      {record.type}
                    </span>
                  </td>
                </tr>
              ))}
              {displayRecords.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-8 py-12 text-center text-text-tertiary">
                     <p className="text-sm font-bold uppercase tracking-widest">No tax lots found</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 border-t border-border/50 bg-surface-muted/10 gap-4">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
            Showing <span className="text-text-primary">4</span> of <span className="text-text-primary">48</span> tax lots across 12 instruments
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border bg-surface shadow-sm rounded-lg text-text-secondary hover:text-text-primary hover:border-brand-blue/30 transition-all">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            <button className="flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-widest border border-border bg-surface shadow-sm rounded-lg text-text-secondary hover:text-text-primary hover:border-brand-blue/30 transition-all">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* ─── Bottom Action Bar ────────────────────────────────── */}
      <AnimatedCard className="flex flex-col sm:flex-row items-center justify-between p-6 border border-border shadow-md rounded-2xl bg-surface gap-4">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-muted/50 rounded-md border border-border/50">
            <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(48,209,88,0.5)] animate-pulse" />
            <span>Last Sync: 2 mins ago</span>
          </div>
          <span className="hidden sm:inline">|</span>
          <button className="hover:text-text-primary transition-colors underline decoration-border underline-offset-4">Compliance Disclaimers</button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 h-11 px-5 text-xs font-bold uppercase tracking-widest rounded-xl border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all">
            <FileSpreadsheet className="w-4 h-4" />
            Excel Export
          </Button>
          <Button className="flex items-center gap-2 h-11 px-5 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
            <FileText className="w-4 h-4" />
            ITR-Ready PDF
          </Button>
        </div>
      </AnimatedCard>
    </div>
  );
}

'use client';

import React from 'react';
import { usePortfolio } from '@/context/portfolio-context';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { formatCompactINR } from '@Aurapex/shared';
import {
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Scale,
  RefreshCw,
  Search,
  ArrowRight,
  DatabaseZap,
  Building2,
  Database
} from 'lucide-react';
import { Card, AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Conflict {
  id: string;
  type: string;
  field: string;
  sourceA: string;
  sourceB: string;
  valueA: string;
  valueB: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
  resolution: string;
  createdAt: string;
  holding: {
    asset: {
      name: string;
      symbol: string;
      assetType: string;
    };
  };
}

export default function ReconciliationPage() {
  const { activePortfolio } = usePortfolio();
  const [conflicts, setConflicts] = React.useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEngineRunning, setIsEngineRunning] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'ALL' | 'PENDING' | 'RESOLVED'>('PENDING');

  const fetchConflicts = React.useCallback(async () => {
    if (!activePortfolio) return;
    try {
      setIsLoading(true);
      const data = (await ApiClient.getReconciliationConflicts(activePortfolio.id)) as Conflict[];
      setConflicts(data);
    } catch (error) {
      console.error('Failed to fetch conflicts', error);
    } finally {
      setIsLoading(false);
    }
  }, [activePortfolio]);

  React.useEffect(() => {
    fetchConflicts();
  }, [fetchConflicts]);

  const handleRunEngine = async () => {
    if (!activePortfolio) return;
    setIsEngineRunning(true);
    try {
      await ApiClient.runReconciliationEngine(activePortfolio.id);
      await fetchConflicts();
    } catch (error) {
      console.error('Failed to run engine', error);
    } finally {
      setIsEngineRunning(false);
    }
  };

  const handleResolve = async (conflictId: string, resolvedValue: string) => {
    try {
      await ApiClient.resolveReconciliationConflict(conflictId, resolvedValue, 'Manually resolved by user via UI');
      await fetchConflicts();
    } catch (error) {
      console.error('Failed to resolve', error);
    }
  };

  const handleDismiss = async (conflictId: string) => {
    try {
      await ApiClient.dismissReconciliationConflict(conflictId);
      await fetchConflicts();
    } catch (error) {
      console.error('Failed to dismiss', error);
    }
  };

  const getSeverityBadge = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-brand-red/10 text-brand-red border border-brand-red/20 uppercase tracking-widest shadow-sm">Critical</span>;
      case 'HIGH': return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-brand-amber/10 text-brand-amber border border-brand-amber/20 uppercase tracking-widest shadow-sm">High</span>;
      case 'MEDIUM': return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-widest shadow-sm">Medium</span>;
      default: return <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-brand-blue/10 text-brand-blue border border-brand-blue/20 uppercase tracking-widest shadow-sm">Low</span>;
    }
  };

  const filteredConflicts = conflicts.filter(c => {
    if (activeFilter === 'PENDING' && c.resolution !== 'PENDING') return false;
    if (activeFilter === 'RESOLVED' && c.resolution === 'PENDING') return false;
    if (searchQuery) {
      return c.holding.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <Scale className="w-8 h-8 text-brand-blue" />
            Reconciliation Engine
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Detect and resolve data conflicts across different imported sources.
          </p>
        </div>
        <Button
          onClick={handleRunEngine}
          disabled={isEngineRunning || !activePortfolio}
          isLoading={isEngineRunning}
          className="flex items-center gap-2 h-12 px-8 text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {!isEngineRunning && <DatabaseZap className="w-4 h-4 mr-2" />}
          Run Analysis
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Pending Conflicts</p>
          <p className="text-4xl font-black text-loss mt-2 tracking-tight">{conflicts.filter(c => c.resolution === 'PENDING').length}</p>
        </AnimatedCard>
        <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Resolved Conflicts</p>
          <p className="text-4xl font-black text-gain mt-2 tracking-tight">{conflicts.filter(c => c.resolution !== 'PENDING').length}</p>
        </AnimatedCard>
        <AnimatedCard className="p-6 md:col-span-2 flex items-center justify-between border border-border shadow-sm rounded-2xl bg-surface">
          <div>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Engine Status</p>
            <p className="text-sm font-black text-brand-green mt-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Active & Monitoring
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20 shadow-sm">
            <GitMerge className="w-8 h-8 text-brand-green" />
          </div>
        </AnimatedCard>
      </div>

      {/* Main Content */}
      <AnimatedCard className="overflow-hidden border border-border shadow-sm rounded-2xl bg-surface">
        <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-muted/30 gap-4">
          <div className="flex gap-2 p-1 bg-surface-muted/50 rounded-lg border border-border">
            {(['PENDING', 'RESOLVED', 'ALL'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all',
                  activeFilter === filter
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search assets or issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-sm bg-surface border-border rounded-xl focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {isLoading ? (
            <div className="p-16 text-center text-text-tertiary flex flex-col items-center">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 text-brand-blue" />
              <p className="text-sm font-bold tracking-widest uppercase text-brand-blue">Analyzing ledgers...</p>
            </div>
          ) : filteredConflicts.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mb-6 border border-brand-green/20 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-xl font-black text-text-primary tracking-tight">Zero Conflicts Found</h3>
              <p className="text-sm font-medium text-text-secondary mt-2">Your portfolio data is fully reconciled and accurate.</p>
            </div>
          ) : (
            filteredConflicts.map(conflict => (
              <div key={conflict.id} className="p-6 bg-surface hover:bg-surface-hover/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {getSeverityBadge(conflict.severity)}
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest px-2.5 py-1 bg-brand-blue/5 border border-brand-blue/10 rounded-md shadow-sm">
                        {conflict.type}
                      </span>
                      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                        {new Date(conflict.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {conflict.holding.asset.name}
                    </h3>
                    <p className="text-xs font-semibold text-text-secondary flex items-start gap-2 max-w-2xl mt-2">
                      <AlertTriangle className="w-4 h-4 text-brand-amber shrink-0" />
                      <span className="leading-relaxed">{conflict.notes || 'Discrepancy detected in values.'}</span>
                    </p>
                  </div>

                  {conflict.resolution === 'PENDING' ? (
                    <div className="flex gap-2 shrink-0 md:ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleDismiss(conflict.id)} className="h-9 px-4 text-xs font-bold uppercase tracking-widest rounded-lg border-border/50 text-text-secondary hover:text-text-primary">
                        Dismiss
                      </Button>
                    </div>
                  ) : (
                    <div className="shrink-0 md:ml-4 px-3 py-1.5 text-[10px] font-bold text-gain bg-gain/10 border border-gain/20 rounded-md flex items-center gap-1.5 uppercase tracking-widest shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </div>
                  )}
                </div>

                {/* Resolution Panel */}
                {conflict.resolution === 'PENDING' && (
                  <div className="mt-6 p-5 rounded-xl bg-surface-muted/30 border border-border/50 flex flex-col md:flex-row items-stretch gap-4">
                    {/* Source A */}
                    <div className="flex-1 border border-border rounded-xl p-4 bg-surface shadow-sm hover:border-brand-blue/30 transition-colors group">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-muted/50 border border-border flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-text-tertiary group-hover:text-brand-blue transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{conflict.sourceA}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{conflict.field}</p>
                          <p className="text-xl font-black text-text-primary mt-1 tracking-tight">{conflict.valueA}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResolve(conflict.id, conflict.valueA)}
                          className="text-brand-blue hover:text-white hover:bg-brand-blue font-bold h-9 px-4 text-xs uppercase tracking-widest rounded-lg transition-all"
                        >
                          Keep This
                        </Button>
                      </div>
                    </div>

                    {/* Source B */}
                    <div className="flex-1 border border-border rounded-xl p-4 bg-surface shadow-sm hover:border-brand-blue/30 transition-colors group">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-muted/50 border border-border flex items-center justify-center">
                           <Database className="w-4 h-4 text-text-tertiary group-hover:text-brand-blue transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{conflict.sourceB}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{conflict.field}</p>
                          <p className="text-xl font-black text-text-primary mt-1 tracking-tight">{conflict.valueB}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResolve(conflict.id, conflict.valueB)}
                          className="text-brand-blue hover:text-white hover:bg-brand-blue font-bold h-9 px-4 text-xs uppercase tracking-widest rounded-lg transition-all"
                        >
                          Keep This
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </AnimatedCard>
    </div>
  );
}

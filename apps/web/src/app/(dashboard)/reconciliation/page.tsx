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
import { Card } from '@/components/ui/card';
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
      case 'CRITICAL': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-loss/10 text-loss border border-loss/20 uppercase tracking-wider">Critical</span>;
      case 'HIGH': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase tracking-wider">High</span>;
      case 'MEDIUM': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 uppercase tracking-wider">Medium</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 uppercase tracking-wider">Low</span>;
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
    <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Scale className="w-6 h-6 text-brand-blue" />
            Data Reconciliation Engine
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Detect and resolve data conflicts across different imported sources.
          </p>
        </div>
        <Button
          onClick={handleRunEngine}
          disabled={isEngineRunning || !activePortfolio}
          isLoading={isEngineRunning}
          className="flex items-center gap-2 h-11 px-6 text-sm"
        >
          {!isEngineRunning && <DatabaseZap className="w-4 h-4 mr-1" />}
          Run Reconciliation Engine
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-5">
          <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Pending Conflicts</p>
          <p className="text-3xl font-black text-loss mt-2">{conflicts.filter(c => c.resolution === 'PENDING').length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Resolved Conflicts</p>
          <p className="text-3xl font-black text-gain mt-2">{conflicts.filter(c => c.resolution !== 'PENDING').length}</p>
        </Card>
        <Card className="p-5 col-span-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Engine Status</p>
            <p className="text-sm font-bold text-brand-green mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> Active & Monitoring
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <GitMerge className="w-6 h-6 text-brand-green" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden p-0">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-muted/30 gap-4">
          <div className="flex gap-2">
            {(['PENDING', 'RESOLVED', 'ALL'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-colors',
                  activeFilter === filter
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-border'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search assets or issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-text-tertiary flex flex-col items-center">
              <RefreshCw className="w-6 h-6 animate-spin mb-2 text-brand-blue" />
              <p className="text-sm">Loading conflicts...</p>
            </div>
          ) : filteredConflicts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gain/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-gain" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No Conflicts Found</h3>
              <p className="text-sm text-text-secondary mt-1">Your portfolio data is fully reconciled and accurate.</p>
            </div>
          ) : (
            filteredConflicts.map(conflict => (
              <div key={conflict.id} className="p-6 bg-bg hover:bg-surface-hover/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityBadge(conflict.severity)}
                      <span className="text-xs font-mono text-text-tertiary px-2 py-0.5 bg-surface rounded">
                        {conflict.type}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {new Date(conflict.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary mb-1">
                      {conflict.holding.asset.name}
                    </h3>
                    <p className="text-sm text-text-secondary flex items-start gap-2 max-w-2xl">
                      <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      {conflict.notes || 'Discrepancy detected in values.'}
                    </p>
                  </div>

                  {conflict.resolution === 'PENDING' ? (
                    <div className="flex gap-2 shrink-0 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleDismiss(conflict.id)}>
                        Dismiss
                      </Button>
                    </div>
                  ) : (
                    <div className="shrink-0 ml-4 px-3 py-1.5 text-xs font-bold text-gain bg-gain/10 border border-gain/20 rounded-md flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </div>
                  )}
                </div>

                {/* Resolution Panel */}
                {conflict.resolution === 'PENDING' && (
                  <div className="mt-5 p-4 rounded-xl bg-surface border border-border flex items-stretch gap-4">
                    {/* Source A */}
                    <div className="flex-1 border border-border rounded-lg p-3 bg-bg">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-text-tertiary" />
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{conflict.sourceA}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-text-tertiary uppercase tracking-wider">{conflict.field}</p>
                          <p className="text-lg font-bold text-text-primary">{conflict.valueA}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResolve(conflict.id, conflict.valueA)}
                          className="text-brand-blue hover:text-white hover:bg-brand-blue font-bold h-8"
                        >
                          Keep {conflict.sourceA}
                        </Button>
                      </div>
                    </div>

                    {/* Source B */}
                    <div className="flex-1 border border-border rounded-lg p-3 bg-bg relative">
                      <div className="flex items-center gap-2 mb-3">
                        <Database className="w-4 h-4 text-text-tertiary" />
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{conflict.sourceB}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-text-tertiary uppercase tracking-wider">{conflict.field}</p>
                          <p className="text-lg font-bold text-text-primary">{conflict.valueB}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResolve(conflict.id, conflict.valueB)}
                          className="text-brand-blue hover:text-white hover:bg-brand-blue font-bold h-8"
                        >
                          Keep {conflict.sourceB}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

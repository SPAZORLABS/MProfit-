'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { validatePAN } from '@Aurapex/shared';
import { ApiClient } from '@/lib/api-client';
import { usePortfolio } from '@/context/portfolio-context';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  ShieldCheck,
  Clock,
  FileText,
  Building2,
  Landmark,
  PieChart,
  AlertTriangle,
  RefreshCw,
  Download,
  ArrowLeft,
  UploadCloud,
  Link,
  Search,
  Check,
  Globe,
} from 'lucide-react';
import { Card, AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Types ────────────────────────────────────────────────────────

interface SourceStatus {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  status: 'QUEUED' | 'CONNECTING' | 'FETCHING' | 'RECONCILING' | 'COMPLETED' | 'FAILED';
  recordsFound: number;
  errorMessage?: string;
  completedAt?: string;
}

interface AggregationResult {
  jobId: string;
  overallStatus: string;
  sources: SourceStatus[];
  totalRecordsFound: number;
  successfulSources: number;
  failedSources: number;
  message: string;
}

// ─── Mock Data (client-side simulation when backend unavailable) ──

const MOCK_SOURCES: SourceStatus[] = [
  { sourceId: 'mf-cas', sourceName: 'MF Consolidated Account Statement', sourceType: 'CAS_STATEMENT', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'mf-central', sourceName: 'MF Central', sourceType: 'MF_CENTRAL', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'cams', sourceName: 'CAMS (Computer Age Mgmt Services)', sourceType: 'CAMS', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'kfintech', sourceName: 'KFintech', sourceType: 'KFINTECH', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'nsdl', sourceName: 'NSDL Demat Holdings', sourceType: 'NSDL', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'cdsl', sourceName: 'CDSL Demat Holdings', sourceType: 'CDSL', status: 'QUEUED', recordsFound: 0 },
  { sourceId: 'broker-api', sourceName: 'Broker-Linked Holdings', sourceType: 'BROKER_API', status: 'QUEUED', recordsFound: 0 },
];

const IMPORT_PERIODS = [
  { id: 'last_1y', label: 'Last 1 Year', desc: 'Since May 2025' },
  { id: 'last_3y', label: 'Last 3 Years', desc: 'Since May 2023' },
  { id: 'last_5y', label: 'Last 5 Years', desc: 'Since May 2021' },
  { id: 'all_time', label: 'All Time', desc: 'Complete history' },
];

// ─── Page Component ───────────────────────────────────────────────

export default function ImportPage() {
  const { activePortfolio } = usePortfolio();

  // Tab state
  const [activeTab, setActiveTab] = React.useState<'pan' | 'platform' | 'document' | 'connectors'>('pan');

  // PAN Step state
  const [currentStep, setCurrentStep] = React.useState<'configure' | 'aggregating' | 'complete'>('configure');

  // Config state
  const [pan, setPan] = React.useState('');
  const [selectedPeriod, setSelectedPeriod] = React.useState('all_time');
  const [panError, setPanError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Document state
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Registry state
  const [connectors, setConnectors] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Aggregation state
  const [sources, setSources] = React.useState<SourceStatus[]>([]);
  const [overallStatus, setOverallStatus] = React.useState('');
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [successCount, setSuccessCount] = React.useState(0);
  const [failCount, setFailCount] = React.useState(0);

  // ─── PAN validation ──────────────────────────────────────────
  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(value);
    if (panError) setPanError('');
  };

  // ─── Start Aggregation ───────────────────────────────────────
  const handleStartAggregation = async () => {
    if (!validatePAN(pan)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }

    setIsSubmitting(true);
    setCurrentStep('aggregating');

    // Initialize sources in UI immediately
    setSources(MOCK_SOURCES.map(s => ({ ...s, status: 'QUEUED' as const })));

    // Try calling the real API; fall back to client-side simulation
    try {
      const result: any = await ApiClient.startPanAggregation({
        pan,
        portfolioId: activePortfolio?.id || 'p1',
        importPeriod: selectedPeriod,
      });

      if (result?.jobId) {
        // API available: poll for real status
        pollAggregationStatus(result.jobId);
        return;
      }
    } catch {
      // API unavailable: run client-side simulation
    }

    // Client-side simulation (FR-4.4: partial-success demo)
    simulateAggregation();
  };

  // ─── API Polling ─────────────────────────────────────────────
  const pollAggregationStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const result = (await ApiClient.getAggregationStatus(jobId)) as AggregationResult;
        setSources(result.sources);
        setOverallStatus(result.overallStatus);
        setTotalRecords(result.totalRecordsFound);
        setSuccessCount(result.successfulSources);
        setFailCount(result.failedSources);

        if (result.overallStatus !== 'PROCESSING') {
          clearInterval(interval);
          setIsSubmitting(false);
          setCurrentStep('complete');
        }
      } catch {
        clearInterval(interval);
      }
    }, 800);
  };

  // ─── Client-side simulation ──────────────────────────────────
  const simulateAggregation = () => {
    const mockRecords = [8, 6, 5, 0, 12, 9, 3];
    const mockDelays = [1200, 1800, 2400, 2000, 3000, 3500, 1500];
    const failIdx = 3; // KFintech fails (FR-4.4)

    let completedCount = 0;

    MOCK_SOURCES.forEach((source, i) => {
      setTimeout(() => {
        setSources(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(s => s.sourceId === source.sourceId);
          if (idx === -1) return prev;

          if (i === failIdx) {
            updated[idx] = {
              ...updated[idx],
              status: 'FAILED',
              errorMessage: 'Authentication timeout — please re-authorize KFintech',
              completedAt: new Date().toISOString(),
            };
          } else {
            updated[idx] = {
              ...updated[idx],
              status: 'COMPLETED',
              recordsFound: mockRecords[i],
              completedAt: new Date().toISOString(),
            };
          }

          // Check completion
          completedCount++;
          const done = updated.filter(s => s.status === 'COMPLETED' || s.status === 'FAILED');
          const success = updated.filter(s => s.status === 'COMPLETED');
          const failed = updated.filter(s => s.status === 'FAILED');

          setTotalRecords(success.reduce((sum, s) => sum + s.recordsFound, 0));
          setSuccessCount(success.length);
          setFailCount(failed.length);

          if (done.length === MOCK_SOURCES.length) {
            setOverallStatus(failed.length > 0 ? 'PARTIAL_SUCCESS' : 'COMPLETED');
            setIsSubmitting(false);
            setTimeout(() => setCurrentStep('complete'), 600);
          } else {
            setOverallStatus('PROCESSING');
          }

          return updated;
        });
      }, mockDelays[i]);
    });
  };

  // ─── Source icon helper ──────────────────────────────────────
  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'CAS_STATEMENT': return <FileText className="w-4 h-4" />;
      case 'MF_CENTRAL': return <PieChart className="w-4 h-4" />;
      case 'CAMS':
      case 'KFINTECH': return <Building2 className="w-4 h-4" />;
      case 'NSDL':
      case 'CDSL': return <Landmark className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: SourceStatus['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="flex items-center gap-1.5 text-xs font-bold text-gain"><CheckCircle2 className="w-3.5 h-3.5" /> Synced</span>;
      case 'FAILED':
        return <span className="flex items-center gap-1.5 text-xs font-bold text-loss"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
      case 'QUEUED':
        return <span className="flex items-center gap-1.5 text-xs font-bold text-text-tertiary"><Clock className="w-3.5 h-3.5" /> Queued</span>;
      default:
        return <span className="flex items-center gap-1.5 text-xs font-bold text-brand-blue"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching</span>;
    }
  };

  // ─── Document Upload logic (FR-6) ────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  const validateAndSetFile = (file: File) => {
    // 25MB limit FR-6.4
    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds 25MB limit.');
      return;
    }
    setSelectedFile(file);
    setUploadStatus('idle');
  };
  const handleUpload = () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    // Simulate upload delay
    setTimeout(() => setUploadStatus('success'), 2000);
  };

  // ─── Connectors logic (FR-7) ─────────────────────────────────
  React.useEffect(() => {
    if (activeTab === 'connectors' && connectors.length === 0) {
      // Mock fetch
      ApiClient.getConnectors().then((res: any) => setConnectors(res.data || res)).catch(() => {
        // Fallback mock
        setConnectors([
          { id: 'cams', name: 'CAMS', category: 'RTA', status: 'active', authType: 'OTP', popularity: 98 },
          { id: 'kfintech', name: 'KFintech', category: 'RTA', status: 'active', authType: 'OTP', popularity: 95 },
          { id: 'zerodha', name: 'Zerodha', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 92 },
          { id: 'upstox', name: 'Upstox', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 88 },
        ]);
      });
    }
  }, [activeTab]);

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">Data Intelligence Hub</h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Connect your accounts and aggregate your financial data via secure APIs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-surface-muted/30 rounded-xl border border-border overflow-x-auto hide-scrollbar shadow-inner">
        {[
          { id: 'pan', label: 'PAN Aggregation', icon: ShieldCheck },
          { id: 'platform', label: 'Broker Platforms', icon: Link },
          { id: 'document', label: 'Document Upload', icon: UploadCloud },
          { id: 'connectors', label: 'Connector Registry', icon: Globe },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ───── TAB: PAN Aggregation ───── */}
      {activeTab === 'pan' && (
        <div className="space-y-6">
          {currentStep !== 'configure' && (
            <div className="flex justify-end">
              <button
                onClick={() => { setCurrentStep('configure'); setSources([]); setIsSubmitting(false); }}
                className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface hover:text-text-primary transition-colors bg-surface-muted/30"
              >
                <ArrowLeft className="w-4 h-4" />
                New Import
              </button>
            </div>
          )}

          {/* ───── Step 1: Configure ───── */}
          {currentStep === 'configure' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* PAN Input Card */}
              <AnimatedCard className="p-8 border border-border shadow-sm rounded-2xl bg-surface">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Verify Identity</h2>
                    <p className="text-xs font-medium text-text-secondary mt-1">We use your PAN to fetch verified records directly from the registry.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold tracking-widest uppercase text-text-tertiary mb-3">
                    Permanent Account Number
                  </label>
                  <Input
                    type="text"
                    value={pan}
                    onChange={handlePanChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    error={!!panError}
                    className="font-mono tracking-widest uppercase h-14 text-lg bg-surface-muted/30 border-border focus-visible:ring-brand-blue rounded-xl"
                  />
                  {panError && (
                    <p className="text-xs font-bold text-loss mt-2 animate-slide-down">{panError}</p>
                  )}
                </div>

                {/* FR-4.2: Import Period Selection */}
                <div className="mb-8">
                  <label className="block text-xs font-bold tracking-widest uppercase text-text-tertiary mb-3">
                    Historical Data Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {IMPORT_PERIODS.map(period => (
                      <button
                        key={period.id}
                        onClick={() => setSelectedPeriod(period.id)}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md',
                          selectedPeriod === period.id
                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_15px_rgba(10,132,255,0.1)]'
                            : 'border-border hover:border-brand-blue/30 bg-surface'
                        )}
                      >
                        <p className={cn(
                          'text-sm font-bold',
                          selectedPeriod === period.id ? 'text-brand-blue' : 'text-text-primary'
                        )}>
                          {period.label}
                        </p>
                        <p className="text-xs font-medium text-text-tertiary mt-1">{period.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sources Preview */}
                <div className="mb-8">
                  <label className="block text-xs font-bold tracking-widest uppercase text-text-tertiary mb-3">
                    Verified Data Sources
                  </label>
                  <div className="space-y-3">
                    {MOCK_SOURCES.map(source => (
                      <div
                        key={source.sourceId}
                        className="flex items-center gap-4 p-4 bg-surface-muted/30 rounded-xl border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-surface border border-border shadow-sm flex items-center justify-center text-text-secondary">
                          {getSourceIcon(source.sourceType)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-text-primary">{source.sourceName}</p>
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-0.5">{source.sourceType}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-brand-green" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStartAggregation}
                  disabled={pan.length !== 10}
                  isLoading={isSubmitting}
                  className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
                >
                  {!isSubmitting && <Database className="w-5 h-5 mr-3" />}
                  Initiate Secure Sync
                </Button>
              </AnimatedCard>
            </div>
          )}

          {/* ───── Step 2: Aggregating ───── */}
          {currentStep === 'aggregating' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <AnimatedCard className="p-8 border border-border shadow-sm rounded-2xl bg-surface">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
                    <RefreshCw className="w-6 h-6 text-brand-blue animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Syncing Intelligence...</h2>
                    <p className="text-xs font-medium text-text-secondary mt-1">
                      Querying {MOCK_SOURCES.length} sources for PAN {pan.substring(0, 5)}****{pan.substring(9)}
                    </p>
                  </div>
                </div>

                {/* Per-source status list */}
                <div className="space-y-4">
                  {sources.map((source, i) => (
                    <div
                      key={source.sourceId}
                      className={cn(
                        'flex items-center gap-5 p-5 rounded-xl border transition-all duration-500 shadow-sm',
                        source.status === 'COMPLETED' ? 'border-brand-green/30 bg-brand-green/5' :
                          source.status === 'FAILED' ? 'border-brand-red/30 bg-brand-red/5' :
                            'border-border bg-surface-muted/30'
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm',
                        source.status === 'COMPLETED' ? 'bg-surface border-brand-green/20 text-brand-green' :
                          source.status === 'FAILED' ? 'bg-surface border-brand-red/20 text-brand-red' :
                            'bg-surface border-border text-text-tertiary'
                      )}>
                        {getSourceIcon(source.sourceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{source.sourceName}</p>
                        {source.status === 'COMPLETED' && (
                          <p className="text-xs font-semibold text-gain mt-1">{source.recordsFound} records imported</p>
                        )}
                        {source.status === 'FAILED' && source.errorMessage && (
                          <p className="text-xs font-semibold text-loss mt-1">{source.errorMessage}</p>
                        )}
                        {source.status === 'QUEUED' && (
                          <p className="text-xs font-medium text-text-tertiary mt-1">Waiting in queue...</p>
                        )}
                      </div>
                      <div className="shrink-0 bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
                        {getStatusBadge(source.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>
          )}

          {/* ───── Step 3: Complete ───── */}
          {currentStep === 'complete' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              {/* Summary Card */}
              <AnimatedCard className="p-8 text-center border border-border shadow-sm rounded-2xl bg-gradient-to-br from-surface to-surface-muted">
                <div className={cn(
                  'w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border',
                  overallStatus === 'COMPLETED' ? 'bg-brand-green/10 border-brand-green/20' : 'bg-brand-amber/10 border-brand-amber/20'
                )}>
                  {overallStatus === 'COMPLETED' ? (
                    <CheckCircle2 className="w-10 h-10 text-brand-green animate-scale-in" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-brand-amber animate-scale-in" />
                  )}
                </div>

                <h2 className="text-2xl font-black text-text-primary tracking-tight mb-2">
                  {overallStatus === 'COMPLETED' ? 'Sync Successful' : 'Sync Partially Completed'}
                </h2>
                <p className="text-sm font-medium text-text-secondary mb-8">
                  {overallStatus === 'COMPLETED'
                    ? `Successfully synchronized all ${successCount} intelligence sources.`
                    : `Synchronized ${successCount} of ${MOCK_SOURCES.length} sources. ${failCount} source(s) require attention.`}
                </p>

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-5 bg-surface rounded-xl border border-border shadow-sm">
                    <p className="text-3xl font-black text-text-primary tracking-tight">{totalRecords}</p>
                    <p className="text-[10px] font-bold text-text-tertiary mt-2 uppercase tracking-widest">Records Found</p>
                  </div>
                  <div className="p-5 bg-surface rounded-xl border border-border shadow-sm">
                    <p className="text-3xl font-black text-brand-green tracking-tight">{successCount}</p>
                    <p className="text-[10px] font-bold text-text-tertiary mt-2 uppercase tracking-widest">Sources Linked</p>
                  </div>
                  <div className="p-5 bg-surface rounded-xl border border-border shadow-sm">
                    <p className={cn('text-3xl font-black tracking-tight', failCount > 0 ? 'text-loss' : 'text-text-secondary')}>{failCount}</p>
                    <p className="text-[10px] font-bold text-text-tertiary mt-2 uppercase tracking-widest">Failures</p>
                  </div>
                </div>
              </AnimatedCard>

              {/* FR-4.3: Source Attribution Table */}
              <AnimatedCard className="overflow-hidden border border-border shadow-sm rounded-2xl bg-surface">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-muted/30">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">Attribution Log</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-border/50 bg-surface rounded-lg text-xs font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors shadow-sm">
                    <Download className="w-3.5 h-3.5" />
                    Export Log
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-surface-muted/10">
                        <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Source Entity</th>
                        <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Integration Type</th>
                        <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Records</th>
                        <th className="text-right px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {sources.map((source) => (
                        <tr key={source.sourceId} className="hover:bg-surface-hover/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-tertiary border border-border shadow-sm">
                                {getSourceIcon(source.sourceType)}
                              </div>
                              <span className="text-sm font-bold text-text-primary">{source.sourceName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[11px] font-bold text-text-tertiary bg-surface-muted/50 px-2 py-1 rounded-md border border-border/50">{source.sourceType}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={cn('text-sm font-black', source.status === 'COMPLETED' ? 'text-text-primary' : 'text-text-muted')}>
                              {source.status === 'COMPLETED' ? source.recordsFound : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex bg-surface px-2.5 py-1 rounded-lg border border-border shadow-sm">
                               {getStatusBadge(source.status)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AnimatedCard>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => { setCurrentStep('configure'); setSources([]); }}
                  className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-xs font-bold uppercase tracking-widest text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors bg-surface-muted/30 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync Again
                </button>
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── TAB: Document Upload (FR-6) ───── */}
      {activeTab === 'document' && (
        <AnimatedCard className="p-8 border border-border shadow-sm rounded-2xl bg-surface">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text-primary">Intelligent Parsing</h2>
            <p className="text-sm font-medium text-text-secondary mt-1">
              Upload CAS PDFs, contract notes, or Excel statements for AI-driven extraction. Max size: 25MB.
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300',
              isDragging ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(10,132,255,0.15)]' : 'border-border/60 hover:border-brand-blue/50 bg-surface-muted/30 hover:bg-surface-hover'
            )}
          >
            <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center border border-border shadow-sm mb-6">
              <UploadCloud className="w-10 h-10 text-brand-blue" />
            </div>
            <p className="text-base font-bold text-text-primary mb-2">
              Drag & drop files here, or <label className="text-brand-blue hover:underline cursor-pointer">browse<input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.csv,.xlsx" /></label>
            </p>
            <p className="text-xs font-medium text-text-tertiary">
              Supported formats: PDF, CSV, XLSX
            </p>
          </div>

          {selectedFile && (
            <div className="mt-8 p-5 border border-border rounded-xl flex items-center justify-between bg-surface shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{selectedFile.name}</p>
                  <p className="text-xs font-semibold text-text-tertiary mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {uploadStatus === 'idle' && (
                <button onClick={handleUpload} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all">
                  Upload & Parse
                </button>
              )}
              {uploadStatus === 'uploading' && (
                <div className="flex items-center gap-2 text-brand-blue text-sm font-bold bg-brand-blue/10 px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting Data...
                </div>
              )}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 text-gain text-sm font-bold bg-gain/10 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> Verification Complete
                </div>
              )}
            </div>
          )}
        </AnimatedCard>
      )}

      {/* ───── TAB: Connector Registry (FR-7) ───── */}
      {activeTab === 'connectors' && (
        <div className="space-y-6 animate-fade-in">
          <AnimatedCard className="p-8 border border-border shadow-sm rounded-2xl bg-surface">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Institutional Directory</h2>
                <p className="text-sm font-medium text-text-secondary mt-1">Explore 700+ supported financial data connectors</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search connectors..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 text-sm font-medium bg-surface-muted/50 border border-border rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectors.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(connector => (
                <div key={connector.id} className="p-5 rounded-2xl border border-border bg-surface flex flex-col hover:border-brand-blue/40 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-muted/50 border border-border/50 flex items-center justify-center shadow-sm">
                        <Building2 className="w-5 h-5 text-text-secondary group-hover:text-brand-blue transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors">{connector.name}</p>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5">{connector.category}</p>
                      </div>
                    </div>
                    {connector.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-gain bg-gain/10 px-2 py-1 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span> Active</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-amber bg-brand-amber/10 px-2 py-1 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span> Beta</span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs border-t border-border/50 pt-4">
                    <span className="text-text-tertiary font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> {connector.authType}
                    </span>
                    <button className="text-brand-primary font-bold hover:underline">Link Account</button>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      )}

      {/* ───── TAB: Platform Integrations (FR-5) ───── */}
      {activeTab === 'platform' && (
        <AnimatedCard className="p-12 text-center border border-border shadow-sm rounded-2xl bg-surface">
          <div className="w-20 h-20 rounded-2xl bg-brand-blue/10 mx-auto flex items-center justify-center border border-brand-blue/20 mb-6 shadow-sm">
            <Link className="w-10 h-10 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-text-primary mb-3">Direct Platform Intelligence</h2>
          <p className="text-sm font-medium text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            Connect directly to your broker, AMC, or custodian using a secure credential vault. Supports seamless re-authentication and real-time syncing.
          </p>
          <Button className="h-12 px-8 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all rounded-xl text-sm font-bold uppercase tracking-widest">
            Establish Connection
          </Button>
        </AnimatedCard>
      )}
    </div>
  );
}

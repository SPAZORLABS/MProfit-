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
import { Card } from '@/components/ui/card';
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
        return <span className="flex items-center gap-1.5 text-xs font-semibold text-gain"><CheckCircle2 className="w-3.5 h-3.5" /> Synced</span>;
      case 'FAILED':
        return <span className="flex items-center gap-1.5 text-xs font-semibold text-loss"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
      case 'QUEUED':
        return <span className="flex items-center gap-1.5 text-xs font-semibold text-text-tertiary"><Clock className="w-3.5 h-3.5" /> Queued</span>;
      default:
        return <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching</span>;
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
    <div className="p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Data Import Hub</h1>
          <p className="text-sm text-text-secondary mt-1">
            Aggregate your financial data using PAN, direct broker links, or document uploads.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border overflow-x-auto hide-scrollbar">
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
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-bg text-brand-green shadow-sm ring-1 ring-border'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg/50'
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
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
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
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">PAN Verification</h2>
                    <p className="text-xs text-text-secondary">Your PAN is used to fetch data from government-linked repositories</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Permanent Account Number (PAN)
                  </label>
                  <Input
                    type="text"
                    value={pan}
                    onChange={handlePanChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    error={!!panError}
                    className="font-mono tracking-widest uppercase h-12 text-base"
                  />
                  {panError && (
                    <p className="text-xs text-loss mt-1.5 animate-slide-down">{panError}</p>
                  )}
                </div>

                {/* FR-4.2: Import Period Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Import Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {IMPORT_PERIODS.map(period => (
                      <button
                        key={period.id}
                        onClick={() => setSelectedPeriod(period.id)}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all duration-200',
                          selectedPeriod === period.id
                            ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green/20'
                            : 'border-border hover:border-border-focus bg-bg'
                        )}
                      >
                        <p className={cn(
                          'text-sm font-semibold',
                          selectedPeriod === period.id ? 'text-brand-green' : 'text-text-primary'
                        )}>
                          {period.label}
                        </p>
                        <p className="text-xs text-text-tertiary mt-0.5">{period.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sources Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Data Sources to Aggregate
                  </label>
                  <div className="space-y-2">
                    {MOCK_SOURCES.map(source => (
                      <div
                        key={source.sourceId}
                        className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border"
                      >
                        <div className="w-8 h-8 rounded-md bg-surface flex items-center justify-center text-text-tertiary">
                          {getSourceIcon(source.sourceType)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{source.sourceName}</p>
                          <p className="text-[10px] text-text-tertiary uppercase tracking-wider">{source.sourceType}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStartAggregation}
                  disabled={pan.length !== 10}
                  isLoading={isSubmitting}
                  className="w-full h-12"
                >
                  {!isSubmitting && <Database className="w-4 h-4 mr-2" />}
                  Start PAN Aggregation
                </Button>
              </Card>
            </div>
          )}

          {/* ───── Step 2: Aggregating ───── */}
          {currentStep === 'aggregating' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-brand-blue animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">Aggregating Data</h2>
                    <p className="text-xs text-text-secondary">
                      Fetching records from {MOCK_SOURCES.length} sources for PAN {pan.substring(0, 5)}****{pan.substring(9)}
                    </p>
                  </div>
                </div>

                {/* Per-source status list */}
                <div className="space-y-3">
                  {sources.map((source, i) => (
                    <div
                      key={source.sourceId}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border transition-all duration-500',
                        source.status === 'COMPLETED' ? 'border-gain/20 bg-gain/5' :
                          source.status === 'FAILED' ? 'border-loss/20 bg-loss/5' :
                            'border-border bg-bg'
                      )}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        source.status === 'COMPLETED' ? 'bg-gain/10 text-gain' :
                          source.status === 'FAILED' ? 'bg-loss/10 text-loss' :
                            'bg-surface text-text-tertiary'
                      )}>
                        {getSourceIcon(source.sourceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{source.sourceName}</p>
                        {source.status === 'COMPLETED' && (
                          <p className="text-xs text-gain mt-0.5">{source.recordsFound} records imported</p>
                        )}
                        {source.status === 'FAILED' && source.errorMessage && (
                          <p className="text-xs text-loss mt-0.5">{source.errorMessage}</p>
                        )}
                        {source.status === 'QUEUED' && (
                          <p className="text-xs text-text-tertiary mt-0.5">Waiting in queue...</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(source.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ───── Step 3: Complete ───── */}
          {currentStep === 'complete' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              {/* Summary Card */}
              <Card className="p-8 text-center">
                <div className={cn(
                  'w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center',
                  overallStatus === 'COMPLETED' ? 'bg-gain/10' : 'bg-orange-500/10'
                )}>
                  {overallStatus === 'COMPLETED' ? (
                    <CheckCircle2 className="w-8 h-8 text-gain animate-scale-in" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-orange-400 animate-scale-in" />
                  )}
                </div>

                <h2 className="text-xl font-bold text-text-primary mb-2">
                  {overallStatus === 'COMPLETED' ? 'Aggregation Complete' : 'Aggregation Completed with Warnings'}
                </h2>
                <p className="text-sm text-text-secondary mb-8">
                  {overallStatus === 'COMPLETED'
                    ? `All ${successCount} sources synced successfully.`
                    : `${successCount} of ${MOCK_SOURCES.length} sources synced. ${failCount} source(s) failed.`}
                </p>

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-bg rounded-xl border border-border">
                    <p className="text-2xl font-bold text-text-primary">{totalRecords}</p>
                    <p className="text-xs text-text-tertiary mt-1 uppercase tracking-wider">Records Found</p>
                  </div>
                  <div className="p-4 bg-bg rounded-xl border border-border">
                    <p className="text-2xl font-bold text-gain">{successCount}</p>
                    <p className="text-xs text-text-tertiary mt-1 uppercase tracking-wider">Sources OK</p>
                  </div>
                  <div className="p-4 bg-bg rounded-xl border border-border">
                    <p className={cn('text-2xl font-bold', failCount > 0 ? 'text-loss' : 'text-gain')}>{failCount}</p>
                    <p className="text-xs text-text-tertiary mt-1 uppercase tracking-wider">Sources Failed</p>
                  </div>
                </div>
              </Card>

              {/* FR-4.3: Source Attribution Table */}
              <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Source Attribution</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-hover transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-bg">
                      <th className="text-left px-6 py-3 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Source</th>
                      <th className="text-left px-6 py-3 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Type</th>
                      <th className="text-right px-6 py-3 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Records</th>
                      <th className="text-right px-6 py-3 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((source) => (
                      <tr key={source.sourceId} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-bg flex items-center justify-center text-text-tertiary border border-border">
                              {getSourceIcon(source.sourceType)}
                            </div>
                            <span className="text-sm font-medium text-text-primary">{source.sourceName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-xs font-mono text-text-tertiary">{source.sourceType}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={cn('text-sm font-semibold', source.status === 'COMPLETED' ? 'text-text-primary' : 'text-text-muted')}>
                            {source.status === 'COMPLETED' ? source.recordsFound : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          {getStatusBadge(source.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { setCurrentStep('configure'); setSources([]); }}
                  className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-hover transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Re-Import
                </button>
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg text-sm font-semibold hover:bg-brand-green-dark transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── TAB: Document Upload (FR-6) ───── */}
      {activeTab === 'document' && (
        <Card className="p-8 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-text-primary">Upload Documents</h2>
            <p className="text-sm text-text-secondary">
              Upload CAS PDFs, contract notes, or Excel statements. Max size: 25MB.
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200',
              isDragging ? 'border-brand-green bg-brand-green/5' : 'border-border hover:border-border-focus bg-surface/50'
            )}
          >
            <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center border border-border mb-4">
              <UploadCloud className="w-8 h-8 text-brand-green" />
            </div>
            <p className="text-sm font-semibold text-text-primary mb-1">
              Drag & drop files here, or <label className="text-brand-green hover:underline cursor-pointer">browse<input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.csv,.xlsx" /></label>
            </p>
            <p className="text-xs text-text-tertiary">
              Supported formats: PDF, CSV, XLSX
            </p>
          </div>

          {selectedFile && (
            <div className="mt-6 p-4 border border-border rounded-lg flex items-center justify-between bg-bg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-blue" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{selectedFile.name}</p>
                  <p className="text-xs text-text-tertiary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {uploadStatus === 'idle' && (
                <button onClick={handleUpload} className="px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg">
                  Upload & Parse
                </button>
              )}
              {uploadStatus === 'uploading' && (
                <div className="flex items-center gap-2 text-brand-blue text-sm font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" /> Parsing...
                </div>
              )}
              {uploadStatus === 'success' && (
                <div className="flex items-center gap-2 text-gain text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Processed
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ───── TAB: Connector Registry (FR-7) ───── */}
      {activeTab === 'connectors' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Institutional Connectivity Registry</h2>
                <p className="text-sm text-text-secondary">Explore 700+ available data connectors</p>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search connectors..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectors.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(connector => (
                <div key={connector.id} className="p-4 rounded-xl border border-border bg-bg flex flex-col hover:border-brand-green/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-surface flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-text-tertiary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{connector.name}</p>
                        <p className="text-xs text-text-tertiary uppercase tracking-wider">{connector.category}</p>
                      </div>
                    </div>
                    {connector.status === 'active' ? (
                      <span className="w-2 h-2 rounded-full bg-gain"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs border-t border-border pt-3">
                    <span className="text-text-secondary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {connector.authType}
                    </span>
                    <button className="text-brand-green font-semibold hover:underline">Connect</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ───── TAB: Platform Integrations (FR-5) ───── */}
      {activeTab === 'platform' && (
        <Card className="p-8 text-center py-20 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center border border-border mb-4">
            <Link className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Direct Platform Links</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
            Connect directly to your broker or AMC using a secure credential vault. Supports re-auth and automatic scheduled syncs.
          </p>
          <Button className="h-11 px-6 bg-brand-blue text-white hover:bg-brand-blue-dark">
            Setup New Connection
          </Button>
        </Card>
      )}
    </div>
  );
}

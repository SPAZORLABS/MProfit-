'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Clock,
  ChevronDown,
  FileSpreadsheet,
  FilePlus,
  CheckCircle2,
  Loader2,
  FolderLock
} from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const REPORT_TYPES = [
  { id: 'holdings', label: 'Holdings Report', description: 'Current portfolio positions across all assets', icon: FileText, color: 'brand-blue' },
  { id: 'transactions', label: 'Transaction History', description: 'Complete buy/sell/SIP/dividend history', icon: FileSpreadsheet, color: 'brand-purple' },
  { id: 'income', label: 'Income Report', description: 'Dividends, interest, and other income', icon: FilePlus, color: 'brand-green' },
  { id: 'tax', label: 'STCG/LTCG Report', description: 'Capital gains computation for tax filing', icon: FileText, color: 'brand-amber' },
  { id: 'performance', label: 'Performance Report', description: 'XIRR, CAGR, and benchmark comparison', icon: FileSpreadsheet, color: 'brand-blue' },
  { id: 'itr', label: 'ITR-Ready Report', description: 'Ready-to-file tax computation document', icon: FolderLock, color: 'brand-red' },
];

const RECENT_REPORTS = [
  { id: 'r1', type: 'Holdings Report', format: 'PDF', date: '2024-03-15', status: 'completed' },
  { id: 'r2', type: 'STCG/LTCG Report', format: 'Excel', date: '2024-03-10', status: 'completed' },
  { id: 'r3', type: 'ITR-Ready Report', format: 'PDF', date: '2024-03-01', status: 'completed' },
  { id: 'r4', type: 'Performance Report', format: 'PDF', date: '2024-02-28', status: 'completed' },
];

export default function ReportsPage() {
  const [generatingReport, setGeneratingReport] = React.useState<string | null>(null);

  const handleGenerate = (reportId: string) => {
    setGeneratingReport(reportId);
    setTimeout(() => setGeneratingReport(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <FolderLock className="w-8 h-8 text-brand-blue" />
            Intelligence Reports
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Generate institutional-grade reports for compliance, tax filing, and analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2 h-12 px-6 bg-surface border border-border shadow-sm text-text-primary text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-md hover:border-brand-blue/30 transition-all">
            <Calendar className="w-4 h-4 mr-1 text-brand-blue" />
            Schedule Delivery
          </Button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-6 px-2">Report Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_TYPES.map((report, index) => {
            const Icon = report.icon;
            const isGenerating = generatingReport === report.id;

            return (
              <AnimatedCard
                key={report.id}
                className="p-6 border border-border shadow-sm rounded-2xl bg-surface relative overflow-hidden group hover:border-border-hover transition-all"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${report.color}/5 rounded-full blur-2xl group-hover:bg-${report.color}/10 transition-colors`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-${report.color}/10 border border-${report.color}/20 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${report.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 tracking-tight">{report.label}</h3>
                  <p className="text-xs font-medium text-text-secondary mb-6 leading-relaxed flex-grow">{report.description}</p>
                  
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                    <Button
                      onClick={() => handleGenerate(report.id)}
                      disabled={isGenerating}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm',
                        isGenerating
                          ? 'bg-surface-hover text-text-tertiary cursor-wait border border-border'
                          : 'bg-brand-primary text-white hover:bg-brand-primary-hover hover:shadow-md'
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          PDF
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold uppercase tracking-widest border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-sm transition-all">
                      <FileSpreadsheet className="w-4 h-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <AnimatedCard className="mt-8 overflow-hidden border border-border shadow-sm rounded-2xl bg-surface">
        <div className="px-8 py-6 border-b border-border/50 bg-surface-muted/30 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Recent Exports</h2>
            <p className="text-sm font-medium text-text-secondary mt-1">History of generated reports and documents.</p>
          </div>
          <button className="text-xs font-bold text-brand-blue uppercase tracking-widest hover:text-brand-blue-hover transition-colors">
            View All History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-surface-muted/10">
                <th className="text-left px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Document</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Format</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Generated On</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                <th className="text-right px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {RECENT_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-surface-hover/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-brand-blue/30 transition-colors">
                        {report.format === 'PDF' ? <FileText className="w-4 h-4 text-brand-red" /> : <FileSpreadsheet className="w-4 h-4 text-brand-green" />}
                      </div>
                      <span className="text-sm font-bold text-text-primary tracking-tight">{report.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border shadow-sm',
                      report.format === 'PDF' ? 'bg-brand-red/10 text-brand-red border-brand-red/20' : 'bg-brand-green/10 text-brand-green border-brand-green/20'
                    )}>
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                      {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 bg-gain/5 w-max px-2.5 py-1 rounded-md border border-gain/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gain" />
                      <span className="text-[10px] font-bold text-gain uppercase tracking-widest">{report.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Button variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg border-border/50 text-brand-blue hover:text-white hover:bg-brand-blue hover:border-brand-blue transition-all ml-auto">
                      <Download className="w-3.5 h-3.5 mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
}

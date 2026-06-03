'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR } from '@Aurapex/shared';
import type { AssetAllocation } from '@Aurapex/shared';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AnimatedCard } from '@/components/ui/card';
import { PieChart as PieChartIcon, List as ListIcon } from 'lucide-react';

interface AssetAllocationSectionProps {
  allocations: AssetAllocation[];
}

export function AssetAllocationSection({ allocations }: AssetAllocationSectionProps) {
  const [view, setView] = React.useState<'chart' | 'list'>('chart');

  return (
    <AnimatedCard className="p-8 h-full flex flex-col shadow-sm rounded-2xl border border-border bg-surface relative overflow-hidden group">
      <div className="absolute -left-12 -top-12 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between mb-10 shrink-0 relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-tight text-text-primary">Asset Allocation</h2>
          <p className="text-sm font-medium text-text-secondary mt-1.5">Portfolio distribution by asset class</p>
        </div>
        <div className="flex items-center bg-surface-muted/50 rounded-xl p-1.5 border border-border shadow-inner">
          <button
            onClick={() => setView('chart')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300',
              view === 'chart'
                ? 'bg-surface text-brand-blue shadow-sm border border-brand-blue/20'
                : 'text-text-tertiary hover:text-text-primary hover:bg-surface-hover/50 border border-transparent'
            )}
          >
            <PieChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">CHART</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300',
              view === 'list'
                ? 'bg-surface text-brand-blue shadow-sm border border-brand-blue/20'
                : 'text-text-tertiary hover:text-text-primary hover:bg-surface-hover/50 border border-transparent'
            )}
          >
            <ListIcon className="w-4 h-4" />
            <span className="hidden sm:inline">LIST</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {view === 'chart' ? (
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Donut Chart */}
            <div className="relative w-[280px] h-[280px] flex-shrink-0">
              {/* Outer glow for chart */}
              <div className="absolute inset-4 bg-brand-blue/5 rounded-full blur-2xl z-0" />
              <ResponsiveContainer width="100%" height="100%" className="relative z-10 drop-shadow-xl">
                <PieChart>
                  <Pie
                    data={allocations}
                    cx="50%"
                    cy="50%"
                    innerRadius={95}
                    outerRadius={125}
                    paddingAngle={3}
                    dataKey="percentage"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {allocations.map((entry, index) => (
                      <Cell key={index} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 6px ${entry.color}40)` }} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        const data = payload[0].payload as AssetAllocation;
                        return (
                          <div className="bg-surface/95 border border-border rounded-xl px-5 py-4 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: data.color }} />
                              <p className="text-sm font-bold text-text-primary tracking-tight">{data.label}</p>
                            </div>
                            <p className="text-sm font-medium text-text-secondary">{formatCompactINR(data.value)} <span className="font-black ml-1 text-text-primary">({data.percentage}%)</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total</span>
                <span className="text-4xl font-black tracking-tight text-text-primary mt-1">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3 w-full">
              {allocations.filter(a => a.percentage > 0).map((alloc) => (
                <div
                  key={alloc.category}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-hover/50 transition-all cursor-pointer group border border-transparent hover:border-border/50 hover:shadow-sm"
                >
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-y-110"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary tracking-tight transition-colors flex items-center gap-2">
                      {alloc.label}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary truncate mt-1">{alloc.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black tracking-tight text-text-primary">{alloc.percentage}%</p>
                    <p className="text-xs font-bold text-text-secondary mt-0.5">{formatCompactINR(alloc.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {allocations.filter(a => a.percentage > 0).map((alloc) => (
              <div
                key={alloc.category}
                className="flex items-center gap-6 p-5 rounded-2xl hover:bg-surface-hover/50 transition-all border border-border/50 hover:border-border hover:shadow-sm bg-surface-muted/10 group"
              >
                <div
                  className="w-1.5 h-12 rounded-full shadow-sm transition-transform group-hover:scale-y-110"
                  style={{ backgroundColor: alloc.color }}
                />
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center shadow-sm border border-border shrink-0 transition-transform group-hover:scale-105">
                  <span className="text-2xl drop-shadow-sm">{alloc.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-text-primary tracking-tight">{alloc.label}</p>
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mt-1">{alloc.description}</p>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-xl font-black tracking-tight text-text-primary">{alloc.percentage}%</p>
                  <p className="text-sm font-bold text-text-secondary mt-0.5">{formatCompactINR(alloc.value)}</p>
                </div>
                <div className="hidden sm:block w-56 h-2.5 bg-surface rounded-full overflow-hidden border border-border/50 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                  >
                     <div className="absolute inset-0 bg-white/20 w-full h-full rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}

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
import { Card } from '@/components/ui/card';

interface AssetAllocationSectionProps {
  allocations: AssetAllocation[];
}

export function AssetAllocationSection({ allocations }: AssetAllocationSectionProps) {
  const [view, setView] = React.useState<'chart' | 'list'>('chart');

  return (
    <Card className="p-6 h-full flex flex-col shadow-sm rounded-2xl border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-text-primary">Asset Allocation</h2>
          <p className="text-xs text-text-tertiary mt-1">Portfolio distribution by asset class</p>
        </div>
        <div className="flex items-center bg-surface-muted rounded-lg p-1 border border-border">
          <button
            onClick={() => setView('chart')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200',
              view === 'chart'
                ? 'bg-surface text-brand-primary shadow-sm border border-border/50'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            CHART
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200',
              view === 'list'
                ? 'bg-surface text-brand-primary shadow-sm border border-border/50'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            LIST
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {view === 'chart' ? (
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Donut Chart */}
            <div className="relative w-[240px] h-[240px] flex-shrink-0 drop-shadow-md">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocations}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={4}
                    dataKey="percentage"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {allocations.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        const data = payload[0].payload as AssetAllocation;
                        return (
                          <div className="bg-surface border border-border rounded-xl px-4 py-3 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                              <p className="text-sm font-bold text-text-primary">{data.label}</p>
                            </div>
                            <p className="text-xs text-text-secondary font-medium">{formatCompactINR(data.value)} <span className="text-text-tertiary">({data.percentage}%)</span></p>
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
                <span className="text-xs text-text-tertiary font-bold uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-brand-primary">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-4 w-full">
              {allocations.filter(a => a.percentage > 0).map((alloc) => (
                <div
                  key={alloc.category}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group border border-transparent hover:border-border"
                >
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors flex items-center gap-2">
                      {alloc.label}
                    </p>
                    <p className="text-xs text-text-tertiary truncate mt-0.5">{alloc.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-text-primary">{alloc.percentage}%</p>
                    <p className="text-xs font-medium text-text-secondary mt-0.5">{formatCompactINR(alloc.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {allocations.filter(a => a.percentage > 0).map((alloc) => (
              <div
                key={alloc.category}
                className="flex items-center gap-5 p-4 rounded-xl hover:bg-surface-hover transition-colors border border-border/50 hover:border-border bg-surface-muted/30"
              >
                <div
                  className="w-2 h-10 rounded-full shadow-sm"
                  style={{ backgroundColor: alloc.color }}
                />
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shadow-sm border border-border shrink-0">
                  <span className="text-xl opacity-80">{alloc.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-primary">{alloc.label}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{alloc.description}</p>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-base font-bold text-brand-primary">{alloc.percentage}%</p>
                  <p className="text-xs font-medium text-text-secondary mt-0.5">{formatCompactINR(alloc.value)}</p>
                </div>
                <div className="hidden sm:block w-48 h-2.5 bg-surface rounded-full overflow-hidden border border-border shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

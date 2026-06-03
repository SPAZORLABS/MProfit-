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
    <Card className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-sm font-bold tracking-widest uppercase text-text-tertiary">Asset Allocation</h2>
        <div className="flex items-center bg-surface-hover rounded-lg p-1">
          <button
            onClick={() => setView('chart')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200',
              view === 'chart'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            CHART
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200',
              view === 'list'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            LIST
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {view === 'chart' ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Donut Chart */}
            <div className="relative w-[220px] h-[220px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocations}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="percentage"
                    stroke="none"
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
                          <div className="bg-brand-primary text-white border-none rounded-xl px-4 py-3 shadow-xl">
                            <p className="text-sm font-bold mb-1">{data.label}</p>
                            <p className="text-xs text-text-muted">{formatCompactINR(data.value)} ({data.percentage}%)</p>
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
                <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-text-primary">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3 w-full">
              {allocations.filter(a => a.percentage > 0).map((alloc) => (
                <div
                  key={alloc.category}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer group"
                >
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors">{alloc.label}</p>
                    <p className="text-xs text-text-tertiary truncate">{alloc.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">{alloc.percentage}%</p>
                    <p className="text-xs text-text-secondary">{formatCompactINR(alloc.value)}</p>
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
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-hover transition-colors border border-transparent hover:border-border"
              >
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ backgroundColor: alloc.color }}
                />
                <span className="text-2xl opacity-80">{alloc.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-primary">{alloc.label}</p>
                  <p className="text-xs text-text-tertiary">{alloc.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{alloc.percentage}%</p>
                  <p className="text-xs text-text-secondary">{formatCompactINR(alloc.value)}</p>
                </div>
                <div className="hidden sm:block w-32 h-2 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
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

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getInitials } from '@Aurapex/shared';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HoldingsTableProps {
  holdings: any[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <AnimatedCard className="overflow-hidden p-0 border border-border shadow-md rounded-2xl bg-surface relative group">
      {/* Glow effect */}
      <div className="absolute -left-12 -top-12 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-surface-muted/30 relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-tight text-text-primary">Top Holdings</h2>
          <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mt-1.5">Your largest positions across all accounts</p>
        </div>
        <Button variant="outline" size="sm" className="h-10 px-4 text-xs font-bold uppercase tracking-widest border border-border bg-surface text-brand-blue hover:text-brand-blue-hover hover:bg-brand-blue/5 shadow-sm transition-all rounded-xl">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto hide-scrollbar relative z-10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/50 bg-surface/50">
              <th className="pl-8 py-5 text-[10px] font-bold text-text-tertiary tracking-widest uppercase w-[30%]">Instrument</th>
              <th className="py-5 text-[10px] font-bold text-text-tertiary tracking-widest uppercase text-right">Quantity</th>
              <th className="py-5 text-[10px] font-bold text-text-tertiary tracking-widest uppercase text-right">Avg. Price</th>
              <th className="py-5 text-[10px] font-bold text-text-tertiary tracking-widest uppercase text-right">Live Price</th>
              <th className="py-5 text-[10px] font-bold text-text-tertiary tracking-widest uppercase text-right pr-8">Total Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {holdings.map((holding, index) => {
              // Handle both new mapped format and original Holding interface
              const name = holding.assetName || holding.asset?.name || 'Unknown';
              const ticker = holding.ticker || holding.asset?.symbol || holding.asset?.ticker || 'UNK';
              const initials = getInitials(name);

              const dayChangePct = holding.dayChangePercent ?? holding.dayChange?.percentage ?? 0;
              const isGain = dayChangePct >= 0;

              const avgPrice = holding.avgCost ?? holding.averageCost ?? 0;
              const currentPrice = holding.currentPrice ?? holding.asset?.currentPrice ?? 0;

              const totalGain = holding.totalReturn ?? holding.unrealizedGain ?? ((currentPrice - avgPrice) * holding.quantity);

              return (
                <tr
                  key={holding.id}
                  className="group/row hover:bg-surface-hover/80 transition-colors cursor-pointer"
                >
                  {/* Instrument */}
                  <td className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md border border-white/10 group-hover/row:scale-105 transition-transform"
                        style={{ backgroundColor: `hsl(${(index * 67 + 220) % 360}, 65%, 50%)` }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-text-primary truncate group-hover/row:text-brand-blue transition-colors tracking-tight">{name}</p>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">{ticker}</p>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-5 text-right">
                    <span className="text-sm font-black tracking-tight text-text-primary">
                      {holding.quantity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Avg Price */}
                  <td className="py-5 text-right">
                    <span className="text-sm font-bold text-text-secondary tracking-tight">
                      {formatCurrency(avgPrice)}
                    </span>
                  </td>

                  {/* Live Price + Change */}
                  <td className="py-5 text-right">
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-sm font-black text-text-primary tracking-tight">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 shadow-sm uppercase tracking-widest border',
                          isGain ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-brand-red/10 text-brand-red border-brand-red/20'
                        )}
                      >
                        {isGain ? '+' : ''}{formatPercent(dayChangePct)}
                      </span>
                    </div>
                  </td>

                  {/* Total Gain */}
                  <td className="py-5 text-right pr-8">
                    <span
                      className={cn(
                        'text-base font-black tracking-tight',
                        totalGain >= 0 ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {totalGain >= 0 ? '+' : ''}
                      {formatCurrency(totalGain)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  );
}

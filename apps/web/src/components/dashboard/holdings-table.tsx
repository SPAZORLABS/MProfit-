'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getInitials } from '@Aurapex/shared';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HoldingsTableProps {
  holdings: any[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <Card className="overflow-hidden p-0 border-none shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <h2 className="text-base font-bold text-text-primary tracking-tight">Top Holdings</h2>
        <Button variant="ghost" size="sm" className="text-brand-blue font-semibold hover:bg-brand-blue/5 h-8 px-3 text-xs">
          View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50">
              <th className="pl-6 py-3 text-xs font-bold text-text-tertiary tracking-widest uppercase w-[30%]">Instrument</th>
              <th className="py-3 text-xs font-bold text-text-tertiary tracking-widest uppercase text-right">Quantity</th>
              <th className="py-3 text-xs font-bold text-text-tertiary tracking-widest uppercase text-right">Avg. Price</th>
              <th className="py-3 text-xs font-bold text-text-tertiary tracking-widest uppercase text-right">Live Price</th>
              <th className="py-3 text-xs font-bold text-text-tertiary tracking-widest uppercase text-right pr-6">Total Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
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
                  className="group hover:bg-surface-hover/80 transition-colors cursor-pointer"
                >
                  {/* Instrument */}
                  <td className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: `hsl(${(index * 67 + 200) % 360}, 60%, 45%)` }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{name}</p>
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{ticker}</p>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 text-right">
                    <span className="text-sm font-semibold text-text-primary">
                      {holding.quantity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Avg Price */}
                  <td className="py-4 text-right">
                    <span className="text-sm font-medium text-text-secondary">
                      {formatCurrency(avgPrice)}
                    </span>
                  </td>

                  {/* Live Price + Change */}
                  <td className="py-4 text-right">
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1',
                          isGain ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                        )}
                      >
                        {isGain ? '+' : ''}{formatPercent(dayChangePct)}
                      </span>
                    </div>
                  </td>

                  {/* Total Gain */}
                  <td className="py-4 text-right pr-6">
                    <span
                      className={cn(
                        'text-sm font-bold',
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
    </Card>
  );
}

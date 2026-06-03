'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatCurrency, formatPercent } from '@Aurapex/shared';
import { TrendingUp, Wallet, Zap, Activity } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';

interface KPICardsProps {
  summary: any;
}

export function KPICards({ summary }: KPICardsProps) {
  // Graceful fallbacks for missing data
  const totalValue = summary?.totalValue || summary?.netWorth || 0;
  const invested = summary?.investedAmount || 0;

  // Extract daily and total gains based on the structure sent by page.tsx
  const dailyGainValue = summary?.dayGain?.value !== undefined ? summary.dayGain.value : summary?.todaysGain || 0;
  const dailyGainPct = summary?.dayGain?.percentage !== undefined ? summary.dayGain.percentage : 0;

  const totalGainValue = summary?.totalGain?.value !== undefined ? summary.totalGain.value : summary?.unrealizedGain || 0;
  const totalGainPct = summary?.totalGain?.percentage !== undefined ? summary.totalGain.percentage : summary?.unrealizedGainPercent || 0;

  const cards = [
    {
      id: 'net-worth',
      label: 'NET WORTH',
      value: formatCompactINR(totalValue),
      subtitle: `${formatPercent(dailyGainPct)} today`,
      subtitleColor: dailyGainPct >= 0 ? 'text-gain' : 'text-loss',
      icon: TrendingUp,
      iconBg: 'bg-brand-blue/10 text-brand-blue',
      containerClass: 'bg-gradient-to-br from-surface to-surface-muted border-border',
    },
    {
      id: 'invested',
      label: 'INVESTED',
      value: formatCompactINR(invested),
      subtitle: summary?.cashDragPercent ? `Cash Drag: ${summary.cashDragPercent}%` : 'Total Capital',
      subtitleColor: 'text-text-secondary',
      icon: Wallet,
      iconBg: 'bg-brand-purple/10 text-brand-purple',
      containerClass: 'bg-surface border-border',
    },
    {
      id: 'todays-gain',
      label: "TODAY'S GAIN",
      value: formatCurrency(dailyGainValue, { showSign: true }),
      subtitle: null,
      subtitleColor: dailyGainValue >= 0 ? 'text-gain' : 'text-loss',
      icon: Zap,
      iconBg: dailyGainValue >= 0 ? 'bg-brand-green-bg text-brand-green' : 'bg-brand-red-bg text-brand-red',
      valueColor: dailyGainValue >= 0 ? 'text-gain' : 'text-loss',
      containerClass: 'bg-surface border-border',
    },
    {
      id: 'unrealized-gain',
      label: summary?.xirr !== undefined ? 'XIRR (ANNUALIZED)' : 'UNREALIZED GAIN',
      value: summary?.xirr !== undefined ? `${summary.xirr.toFixed(2)}%` : formatCompactINR(totalGainValue),
      subtitle: summary?.xirr !== undefined ? `Abs Return: ${formatPercent(totalGainPct)}` : `Return: ${formatPercent(totalGainPct)}`,
      subtitleColor: 'text-text-secondary',
      icon: Activity,
      iconBg: 'bg-brand-amber-bg text-brand-amber',
      valuePrefix: '+',
      containerClass: 'bg-surface border-border',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <AnimatedCard
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={cn("p-6 flex flex-col justify-between h-[150px] shadow-sm hover:shadow-md transition-shadow rounded-2xl", card.containerClass)}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
                {card.label}
              </span>
              <div className={cn('p-2 rounded-xl shadow-sm bg-surface', card.iconBg)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className={cn(
                'text-3xl font-black tracking-tight mb-1.5',
                card.valueColor || 'text-text-primary'
              )}>
                {card.value}
              </p>

              {card.subtitle && (
                <p className={cn('text-sm font-semibold flex items-center gap-1.5', card.subtitleColor)}>
                  {card.subtitleColor === 'text-gain' && <TrendingUp className="w-3.5 h-3.5" />}
                  {card.subtitle}
                </p>
              )}
            </div>
          </AnimatedCard>
        );
      })}
    </div>
  );
}

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
      iconBg: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
      containerClass: 'bg-surface border-border group',
      glowClass: 'bg-brand-blue/5 group-hover:bg-brand-blue/10'
    },
    {
      id: 'invested',
      label: 'INVESTED',
      value: formatCompactINR(invested),
      subtitle: summary?.cashDragPercent ? `Cash Drag: ${summary.cashDragPercent}%` : 'Total Capital',
      subtitleColor: 'text-text-secondary',
      icon: Wallet,
      iconBg: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
      containerClass: 'bg-surface border-border group',
      glowClass: 'bg-brand-purple/5 group-hover:bg-brand-purple/10'
    },
    {
      id: 'todays-gain',
      label: "TODAY'S GAIN",
      value: formatCurrency(dailyGainValue, { showSign: true }),
      subtitle: null,
      subtitleColor: dailyGainValue >= 0 ? 'text-gain' : 'text-loss',
      icon: Zap,
      iconBg: dailyGainValue >= 0 ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-brand-red/10 text-brand-red border-brand-red/20',
      valueColor: dailyGainValue >= 0 ? 'text-gain' : 'text-loss',
      containerClass: 'bg-surface border-border group',
      glowClass: dailyGainValue >= 0 ? 'bg-brand-green/5 group-hover:bg-brand-green/10' : 'bg-brand-red/5 group-hover:bg-brand-red/10'
    },
    {
      id: 'unrealized-gain',
      label: summary?.xirr !== undefined ? 'XIRR (ANNUALIZED)' : 'UNREALIZED GAIN',
      value: summary?.xirr !== undefined ? `${summary.xirr.toFixed(2)}%` : formatCompactINR(totalGainValue),
      subtitle: summary?.xirr !== undefined ? `Abs Return: ${formatPercent(totalGainPct)}` : `Return: ${formatPercent(totalGainPct)}`,
      subtitleColor: 'text-text-secondary',
      icon: Activity,
      iconBg: 'bg-brand-amber/10 text-brand-amber border-brand-amber/20',
      valuePrefix: '+',
      containerClass: 'bg-surface border-border group',
      glowClass: 'bg-brand-amber/5 group-hover:bg-brand-amber/10'
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
            className={cn("p-6 flex flex-col justify-between h-[150px] shadow-sm hover:border-border-hover transition-all rounded-2xl relative overflow-hidden", card.containerClass)}
          >
            <div className={cn(`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl transition-colors pointer-events-none`, card.glowClass)} />
            
            <div className="flex items-start justify-between relative z-10">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
                {card.label}
              </span>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border group-hover:scale-110 transition-transform', card.iconBg)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="relative z-10">
              <p className={cn(
                'text-3xl lg:text-4xl font-black tracking-tight mb-1.5',
                card.valueColor || 'text-text-primary'
              )}>
                {card.value}
              </p>

              {card.subtitle && (
                <p className={cn('text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 px-2 py-1 rounded-md w-max border border-transparent shadow-sm', card.subtitleColor === 'text-gain' ? 'text-gain bg-gain/10 border-gain/20' : card.subtitleColor === 'text-loss' ? 'text-loss bg-loss/10 border-loss/20' : 'text-text-secondary bg-surface-muted border-border/50')}>
                  {card.subtitleColor === 'text-gain' && <TrendingUp className="w-3 h-3" />}
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

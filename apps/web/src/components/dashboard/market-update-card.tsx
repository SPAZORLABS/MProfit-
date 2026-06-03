'use client';

import React from 'react';
import type { MarketUpdate } from '@Aurapex/shared';
import { Newspaper } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MarketUpdateCardProps {
  update: MarketUpdate;
}

export function MarketUpdateCard({ update }: MarketUpdateCardProps) {
  return (
    <AnimatedCard className="p-6 border border-border shadow-sm rounded-2xl bg-surface hover:border-brand-blue/30 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col">
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-surface-muted/50 border border-border shadow-sm flex items-center justify-center group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 group-hover:scale-110 transition-all">
          <Newspaper className="w-5 h-5 text-text-tertiary group-hover:text-brand-blue transition-colors" />
        </div>
        <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
          Market Intelligence
        </span>
      </div>

      <div className="flex-1 relative z-10">
        <h4 className="text-base font-black tracking-tight text-text-primary mb-3 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors">
          {update.headline}
        </h4>

        <p className="text-sm font-medium text-text-secondary leading-relaxed line-clamp-3">
          {update.summary}
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between relative z-10 shrink-0">
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-2 py-1 bg-surface-muted rounded-md border border-border/50">Source: Bloomberg</span>
        <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Read Full <span className="text-[8px]">▶</span>
        </span>
      </div>
    </AnimatedCard>
  );
}

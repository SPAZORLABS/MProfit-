'use client';

import React from 'react';
import type { MarketUpdate } from '@Aurapex/shared';
import { Newspaper } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MarketUpdateCardProps {
  update: MarketUpdate;
}

export function MarketUpdateCard({ update }: MarketUpdateCardProps) {
  return (
    <Card className="p-5 border border-border shadow-sm rounded-2xl bg-gradient-to-br from-surface to-surface-muted hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-surface border border-border shadow-sm rounded-lg group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 transition-colors">
          <Newspaper className="w-4 h-4 text-text-tertiary group-hover:text-brand-blue transition-colors" />
        </div>
        <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
          Market Intelligence
        </span>
      </div>

      <h4 className="text-sm font-bold text-text-primary mb-2 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors">
        {update.headline}
      </h4>

      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
        {update.summary}
      </p>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Source: Bloomberg</span>
        <span className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider group-hover:underline">Read Full</span>
      </div>
    </Card>
  );
}

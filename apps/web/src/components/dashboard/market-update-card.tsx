'use client';

import React from 'react';
import type { MarketUpdate } from '@Aurapex/shared';
import { Newspaper } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MarketUpdateCardProps {
  update: MarketUpdate;
}

export function MarketUpdateCard({ update }: MarketUpdateCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-surface-hover rounded-lg">
          <Newspaper className="w-4 h-4 text-text-tertiary" />
        </div>
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
          Market Update
        </span>
      </div>

      <h4 className="text-sm font-bold text-text-primary mb-1.5 line-clamp-2 leading-tight">
        {update.headline}
      </h4>

      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
        {update.summary}
      </p>
    </Card>
  );
}

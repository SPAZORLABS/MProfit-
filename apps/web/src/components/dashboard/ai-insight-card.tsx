'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AIInsight } from '@Aurapex/shared';
import { Sparkles, Info, Shield, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <AnimatedCard
      className="p-8 border border-brand-amber/20 bg-brand-amber/5 rounded-2xl relative overflow-hidden group h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-amber/10 blur-3xl rounded-full group-hover:bg-brand-amber/20 transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
        <div className="w-10 h-10 bg-brand-amber/10 border border-brand-amber/20 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          <Sparkles className="w-5 h-5 text-brand-amber" />
        </div>
        <h3 className="text-xs font-bold text-brand-amber uppercase tracking-widest">
          AI Insight
        </h3>
      </div>

      {/* Title */}
      <h4 className="text-xl font-black text-text-primary mb-3 relative z-10 tracking-tight leading-tight">
        {insight.title}
      </h4>

      {/* Body — render markdown-like bold */}
      <div className="flex-1 relative z-10">
        <p className="text-sm font-medium text-text-secondary leading-relaxed mb-6">
          {insight.body.split('**').map((part, i) =>
            i % 2 === 1 ? (
              <span key={i} className="font-bold text-text-primary bg-brand-amber/10 px-1 rounded">
                {part}
              </span>
            ) : (
              <React.Fragment key={i}>{part}</React.Fragment>
            )
          )}
        </p>
      </div>

      {/* Meta Row & CTA Button*/}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-brand-amber/10 pt-5 mt-auto relative z-10 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 border border-brand-green/20 rounded-lg shadow-sm">
          <Shield className="w-3.5 h-3.5 text-brand-green" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green">{Math.round(insight.confidence * 100)}% Confidence</span>
        </div>
        
        {insight.actionLabel && (
          <Button
            variant="outline"
            className="bg-brand-primary text-white border-none shadow-md hover:shadow-lg text-xs font-bold uppercase tracking-widest px-6 h-10 rounded-xl group/btn transition-all"
          >
            {insight.actionLabel}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </AnimatedCard>
  );
}

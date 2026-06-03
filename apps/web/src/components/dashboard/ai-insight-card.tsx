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
      className="p-6 bg-gradient-to-br from-brand-primary via-brand-primary to-[#2a3040] border-none shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-amber/20 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="p-1.5 bg-brand-amber/10 rounded-lg">
          <Sparkles className="w-4 h-4 text-brand-amber" />
        </div>
        <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">
          AI Insight
        </h3>
      </div>

      {/* Title */}
      <h4 className="text-lg font-bold text-white mb-2 relative z-10 leading-tight">
        {insight.title}
      </h4>

      {/* Body — render markdown-like bold */}
      <p className="text-sm text-white/70 leading-relaxed mb-6 relative z-10">
        {insight.body.split('**').map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="font-semibold text-white">
              {part}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </p>

      {/* Meta Row */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-5 relative z-10 border-t border-white/10 pt-4">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-brand-green" />
          <span>{Math.round(insight.confidence * 100)}% Confidence</span>
        </div>
      </div>

      {/* CTA Button */}
      {insight.actionLabel && (
        <Button
          variant="secondary"
          className="w-full bg-white text-brand-primary hover:bg-white/90 border-none shadow-md relative z-10 group"
        >
          {insight.actionLabel}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
    </AnimatedCard>
  );
}

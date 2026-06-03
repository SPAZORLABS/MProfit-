'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  lastSyncAt?: string;
  className?: string;
}

export function Footer({ lastSyncAt, className }: FooterProps) {
  const syncTime = lastSyncAt
    ? (() => {
      const diff = Date.now() - new Date(lastSyncAt).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return `${Math.floor(minutes / 60)} hours ago`;
    })()
    : '2 minutes ago';

  return (
    <footer
      className={cn(
        'border-t border-border bg-surface px-6 py-3 flex items-center justify-between text-xs',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <div className="w-5 h-5 rounded bg-sidebar flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">M</span>
          </div>
          Aurapex
        </div>
        <span className="text-text-tertiary">
          © 2024 Aurapex Wealth Intelligence. Professional Wealth Management Compliance.
        </span>
      </div>

      <div className="flex items-center gap-4 text-text-tertiary">
        <button className="hover:text-text-secondary transition-colors underline">
          Compliance Disclaimers
        </button>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-glow" />
          <span className="text-text-secondary font-medium">Last Sync: {syncTime}</span>
        </div>
      </div>
    </footer>
  );
}

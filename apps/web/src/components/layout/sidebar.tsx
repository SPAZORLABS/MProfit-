'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PortfolioSwitcher } from './portfolio-switcher';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Receipt,
  FileText,
  Sparkles,
  Settings,
  RefreshCw,
  HelpCircle,
  LogOut,
  Database,
  Scale,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, href: '/portfolio' },
  { id: 'import', label: 'Import', icon: Database, href: '/import' },
  { id: 'reconciliation', label: 'Reconciliation', icon: Scale, href: '/reconciliation' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'tax', label: 'Tax', icon: Receipt, href: '/tax' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles, href: '/ai-copilot' },
  { id: 'tools', label: 'Tools', icon: Settings, href: '/tools' },
  { id: 'preferences', label: 'Preferences', icon: Settings, href: '/preferences' },
];

interface SidebarProps {
  collapsed?: boolean;
  onRefresh?: () => void;
}

export function Sidebar({ collapsed = false, onRefresh }: SidebarProps) {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface border-r border-border transition-all duration-300 shadow-sm',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* ─── Logo ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-6 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-primary text-white shadow-md">
          <span className="font-bold text-sm tracking-tight">M</span>
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <h1 className="text-brand-primary font-bold text-lg leading-none tracking-tight">Aurapex</h1>
            <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1 font-semibold">
              Intelligence
            </p>
          </motion.div>
        )}
      </div>

      {/* ─── Portfolio Switcher ───────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 mb-4">
          <PortfolioSwitcher />
        </div>
      )}

      {/* ─── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group outline-none',
                isActive
                  ? 'text-brand-primary'
                  : 'text-text-secondary hover:text-brand-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-surface-muted border border-border-light rounded-lg z-0"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-brand-blue' : 'text-text-tertiary group-hover:text-text-secondary')} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ─── Refresh Button ───────────────────────────────────── */}
      <div className="px-4 pb-3 shrink-0">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border shadow-sm',
            'bg-surface text-text-primary font-medium text-sm',
            'hover:bg-surface-hover border-border transition-all duration-200',
            'disabled:opacity-70 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('w-4 h-4 text-brand-blue', isRefreshing && 'animate-spin')} />
          {!collapsed && <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>}
        </button>
      </div>

      {/* ─── Bottom Links ─────────────────────────────────────── */}
      <div className="px-3 pb-4 space-y-1 border-t border-border-light pt-3 shrink-0">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors w-full">
          <HelpCircle className="w-4 h-4 text-text-tertiary" />
          {!collapsed && <span>Support</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-brand-red hover:bg-brand-red-bg transition-colors w-full">
          <LogOut className="w-4 h-4 text-text-tertiary" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

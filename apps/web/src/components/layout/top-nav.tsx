'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Briefcase,
  LayoutDashboard,
  BarChart3,
  Receipt,
  FileText,
  Sparkles,
  Settings,
  Database,
  Scale,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { mockPortfolios, mockNotifications } from '@/lib/mock-data';
import { PortfolioSwitcher } from './portfolio-switcher';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, href: '/portfolio' },
  { id: 'import', label: 'Import', icon: Database, href: '/import' },
  { id: 'reconciliation', label: 'Reconciliation', icon: Scale, href: '/reconciliation' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'tax', label: 'Tax', icon: Receipt, href: '/tax' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles, href: '/ai-copilot' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export function TopNav() {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = React.useState(mockPortfolios[0]);
  const [showPortfolioDropdown, setShowPortfolioDropdown] = React.useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-sm">
      {/* ─── Top Utility Row ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 w-64">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-primary text-white shadow-md">
            <span className="font-bold text-sm tracking-tight">M</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-brand-primary font-bold text-base leading-none tracking-tight">Aurapex</h1>
            <p className="text-[9px] text-text-tertiary uppercase tracking-widest mt-0.5 font-semibold">
              Intelligence
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl px-4">
          <div
            className={cn(
              'relative flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all duration-200 shadow-sm',
              searchFocused
                ? 'border-border-focus ring-2 ring-border-focus/20 bg-surface'
                : 'border-border bg-surface-muted hover:bg-surface'
            )}
          >
            <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <input
              type="text"
              placeholder="Search holdings, reports, or ask AI..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none h-6"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-bg rounded border border-border">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-64 justify-end">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-red animate-pulse-glow" />
              )}
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-surface-muted">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'px-4 py-3 border-b border-border-light hover:bg-surface-hover transition-colors cursor-pointer',
                          !notification.read && 'bg-brand-blue-bg/50'
                        )}
                      >
                        <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{notification.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-1"></div>

          {/* User Menu */}
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold">RS</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
          </button>
        </div>
      </div>

      {/* ─── Workspace Tabs Row ───────────────────────────────── */}
      <div className="flex items-center px-6 h-12 bg-surface-muted/30">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 outline-none whitespace-nowrap',
                  isActive
                    ? 'text-brand-primary'
                    : 'text-text-secondary hover:text-brand-primary hover:bg-surface-hover'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="topnav-active-indicator"
                    className="absolute inset-0 bg-surface border border-border rounded-md shadow-sm z-0"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-brand-blue' : 'text-text-tertiary')} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Portfolio Switcher on right of tabs */}
        <div className="pl-4 ml-auto border-l border-border shrink-0">
           <PortfolioSwitcher />
        </div>
      </div>
    </header>
  );
}

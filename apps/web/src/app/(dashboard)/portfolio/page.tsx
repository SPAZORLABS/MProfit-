'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactINR, formatPercent, getInitials } from '@Aurapex/shared';
import { mockHoldings, mockPortfolios } from '@/lib/mock-data';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Download,
  Upload,
  MoreVertical,
  ArrowUpDown,
  Eye,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Briefcase,
  Users,
  Target,
  UserCircle2,
  Settings,
} from 'lucide-react';
import { usePortfolio } from '@/context/portfolio-context';
import { Card, AnimatedCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'value' | 'gain'>('value');
  const [filterType, setFilterType] = React.useState<'all' | 'equity' | 'mf' | 'debt'>('all');

  const { portfolios, activePortfolio, setActivePortfolioId } = usePortfolio();
  const [activeTab, setActiveTab] = React.useState<'holdings' | 'manage'>('holdings');

  const filteredHoldings = mockHoldings.filter(h => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.asset.name.toLowerCase().includes(q) || h.asset.symbol?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalValue = filteredHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = filteredHoldings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalGain = totalValue - totalInvested;

  const getIcon = (type: string) => {
    switch (type) {
      case 'FAMILY': return <Users className="w-5 h-5" />;
      case 'GOAL': return <Target className="w-5 h-5" />;
      case 'CLIENT': return <UserCircle2 className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'FAMILY': return 'bg-brand-blue-bg text-brand-blue';
      case 'GOAL': return 'bg-brand-purple-bg text-brand-purple';
      case 'CLIENT': return 'bg-brand-amber-bg text-brand-amber';
      default: return 'bg-brand-green-bg text-brand-green';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">
            {activeTab === 'holdings' ? (activePortfolio?.name || 'Portfolio') : 'Manage Portfolios'}
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            {activeTab === 'holdings'
              ? 'Complete holdings view across all asset classes'
              : 'Create, share, and manage your wealth structures'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'holdings' ? (
            <>
              <Button variant="outline" className="flex items-center gap-2 h-10 px-4 bg-surface hover:bg-surface-hover border-border shadow-sm text-sm font-semibold">
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button className="flex items-center gap-2 h-10 px-4 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm text-sm font-semibold rounded-lg">
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            </>
          ) : (
            <Button className="flex items-center gap-2 h-10 px-4 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm text-sm font-semibold rounded-lg">
              <Plus className="w-4 h-4" />
              Create Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border/60">
        <button
          onClick={() => setActiveTab('holdings')}
          className={cn(
            'pb-3 text-sm font-bold transition-all relative uppercase tracking-widest',
            activeTab === 'holdings' ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-secondary'
          )}
        >
          Holdings View
          {activeTab === 'holdings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full shadow-[0_-2px_10px_rgba(10,132,255,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={cn(
            'pb-3 text-sm font-bold transition-all relative flex items-center gap-2 uppercase tracking-widest',
            activeTab === 'manage' ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-secondary'
          )}
        >
          <Settings className="w-4 h-4 mb-0.5" />
          Manage & Share
          {activeTab === 'manage' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full shadow-[0_-2px_10px_rgba(10,132,255,0.5)]" />
          )}
        </button>
      </div>

      {activeTab === 'holdings' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col justify-between h-[130px] border border-border shadow-sm rounded-2xl bg-gradient-to-br from-surface to-surface-muted">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Total Value</span>
              <p className="text-3xl font-black text-text-primary tracking-tight">{formatCompactINR(totalValue)}</p>
            </Card>
            <Card className="p-6 flex flex-col justify-between h-[130px] border border-border shadow-sm rounded-2xl bg-surface">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Total Invested</span>
              <p className="text-3xl font-black text-text-primary tracking-tight">{formatCompactINR(totalInvested)}</p>
            </Card>
            <Card className="p-6 flex flex-col justify-between h-[130px] border border-border shadow-sm rounded-2xl bg-surface">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Total Gain</span>
              <p className={cn('text-3xl font-black tracking-tight', totalGain >= 0 ? 'text-gain' : 'text-loss')}>
                {totalGain >= 0 ? '+' : ''}{formatCompactINR(totalGain)}
              </p>
            </Card>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-surface p-2 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search holdings..."
                  className="pl-10 h-10 border-none bg-surface-muted/50 focus-visible:ring-1 focus-visible:ring-brand-blue/30 rounded-xl font-medium"
                />
              </div>
              <div className="hidden md:flex items-center border border-border/50 rounded-xl p-1 bg-surface-muted/30">
                {(['all', 'equity', 'mf', 'debt'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      'px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all',
                      filterType === type
                        ? 'bg-surface text-brand-primary shadow-sm border border-border/50'
                        : 'text-text-tertiary hover:text-text-secondary'
                    )}
                  >
                    {type === 'all' ? 'All' : type === 'mf' ? 'Mutual Funds' : type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end pr-2">
              <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 rounded-xl bg-surface-muted/30 hover:bg-surface-hover">
                <ArrowUpDown className="w-4 h-4 text-text-tertiary" />
              </Button>
              <Button variant="outline" className="h-10 px-4 border-border/50 rounded-xl bg-surface-muted/30 hover:bg-surface-hover text-sm font-semibold text-text-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Holdings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHoldings.map((holding, index) => {
              const initials = getInitials(holding.asset.name);
              const isGain = holding.unrealizedGain >= 0;

              return (
                <AnimatedCard
                  key={holding.id}
                  className="p-6 cursor-pointer group border border-border shadow-sm rounded-2xl bg-surface hover:shadow-md transition-all hover:border-brand-blue/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                        style={{ backgroundColor: `hsl(${(index * 67 + 220) % 360}, 65%, 50%)` }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors line-clamp-1">
                          {holding.asset.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mt-1">
                          {holding.asset.symbol} • {holding.asset.assetType === 'MUTUAL_FUND' ? 'MF' : 'Equity'}
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-surface-muted">
                      <MoreVertical className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mb-1">Qty</p>
                      <p className="text-sm font-bold text-text-primary">{holding.quantity.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mb-1">Avg Cost</p>
                      <p className="text-sm font-semibold text-text-secondary">{formatCurrency(holding.averageCost)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mb-1">Current</p>
                      <p className="text-sm font-semibold text-text-secondary">{formatCurrency(holding.currentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mb-1">Value</p>
                      <p className="text-sm font-bold text-text-primary">{formatCompactINR(holding.currentValue)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md", isGain ? "bg-brand-green-bg" : "bg-brand-red-bg")}>
                         {isGain ? (
                          <TrendingUp className="w-3 h-3 text-gain" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-loss" />
                        )}
                      </div>
                      <span className={cn('text-sm font-bold', isGain ? 'text-gain' : 'text-loss')}>
                        {isGain ? '+' : ''}{formatCompactINR(holding.unrealizedGain)}
                      </span>
                      <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm', 
                         isGain ? 'bg-brand-green-bg text-brand-green border border-brand-green/20' : 'bg-brand-red-bg text-brand-red border border-brand-red/20'
                      )}>
                        {formatPercent(holding.unrealizedGainPercent)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-blue transition-colors" />
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio, index) => (
              <AnimatedCard
                key={portfolio.id}
                className="p-6 cursor-pointer group border border-border shadow-sm rounded-2xl bg-surface hover:shadow-md transition-all hover:border-brand-blue/20"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-sm', getBadgeColor(portfolio.type))}>
                      {getIcon(portfolio.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-blue transition-colors line-clamp-1">
                        {portfolio.name}
                      </h3>
                      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1.5">
                        {portfolio.type} PORTFOLIO
                      </p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-surface-muted">
                    <MoreVertical className="w-4 h-4 text-text-tertiary" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Your Role</span>
                    <span className="text-sm font-bold text-text-primary">
                      {portfolio.isDefault ? 'Owner' : 'Member'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Members</span>
                    <div className="flex items-center gap-2 bg-surface-muted px-2 py-1 rounded-md border border-border/50">
                      <span className="text-xs font-bold text-text-primary">
                        {portfolio.members?.length || 1}
                      </span>
                      <Users className="w-3 h-3 text-text-tertiary" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActivePortfolioId(portfolio.id)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all',
                      activePortfolio?.id === portfolio.id
                        ? 'bg-brand-blue text-white shadow-md'
                        : 'bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border/50'
                    )}
                  >
                    {activePortfolio?.id === portfolio.id ? 'Active' : 'Switch'}
                  </button>
                  <button className="flex-1 py-2.5 bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-border/50">
                    Manage
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

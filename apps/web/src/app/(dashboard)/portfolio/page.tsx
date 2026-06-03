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
      case 'FAMILY': return 'bg-brand-blue/20 text-brand-blue';
      case 'GOAL': return 'bg-brand-purple/20 text-brand-purple';
      case 'CLIENT': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-brand-green/20 text-brand-green';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {activeTab === 'holdings' ? (activePortfolio?.name || 'Portfolio') : 'Manage Portfolios'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {activeTab === 'holdings'
              ? 'Complete holdings view across all asset classes'
              : 'Create, share, and manage your wealth structures'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'holdings' ? (
            <>
              <Button variant="outline" className="flex items-center gap-2 h-10 px-4">
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button className="flex items-center gap-2 h-10 px-4">
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            </>
          ) : (
            <Button className="flex items-center gap-2 h-10 px-4">
              <Plus className="w-4 h-4" />
              Create Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button
          onClick={() => setActiveTab('holdings')}
          className={cn(
            'pb-3 text-sm font-semibold transition-all relative',
            activeTab === 'holdings' ? 'text-brand-green' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Holdings View
          {activeTab === 'holdings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={cn(
            'pb-3 text-sm font-semibold transition-all relative flex items-center gap-2',
            activeTab === 'manage' ? 'text-brand-green' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <Settings className="w-4 h-4" />
          Manage & Share
          {activeTab === 'manage' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'holdings' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-5 flex flex-col justify-between h-[110px]">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Total Value</span>
              <p className="text-3xl font-black text-text-primary">{formatCompactINR(totalValue)}</p>
            </Card>
            <Card className="p-5 flex flex-col justify-between h-[110px]">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Total Invested</span>
              <p className="text-3xl font-black text-text-primary">{formatCompactINR(totalInvested)}</p>
            </Card>
            <Card className="p-5 flex flex-col justify-between h-[110px]">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">Total Gain</span>
              <p className={cn('text-3xl font-black', totalGain >= 0 ? 'text-gain' : 'text-loss')}>
                {totalGain >= 0 ? '+' : ''}{formatCompactINR(totalGain)}
              </p>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="p-4 flex items-center justify-between bg-surface-muted/30">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search holdings..."
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center border border-border rounded-lg p-1 bg-surface">
                {(['all', 'equity', 'mf', 'debt'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      'px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all',
                      filterType === type
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-text-tertiary hover:text-text-primary'
                    )}
                  >
                    {type === 'all' ? 'All' : type === 'mf' ? 'Mutual Funds' : type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowUpDown className="w-4 h-4 text-text-tertiary" />
              </Button>
              <Button variant="outline" className="h-10 px-4">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>

          {/* Holdings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHoldings.map((holding, index) => {
              const initials = getInitials(holding.asset.name);
              const isGain = holding.unrealizedGain >= 0;

              return (
                <AnimatedCard
                  key={holding.id}
                  className="p-5 cursor-pointer group"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: `hsl(${(index * 67 + 200) % 360}, 50%, 40%)` }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-green transition-colors">
                          {holding.asset.name}
                        </h3>
                        <p className="text-xs text-text-tertiary">
                          {holding.asset.symbol} • {holding.asset.assetType === 'MUTUAL_FUND' ? 'MF' : 'Equity'}
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-hover">
                      <MoreVertical className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-medium">Qty</p>
                      <p className="text-sm font-semibold text-text-primary">{holding.quantity.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-medium">Avg Cost</p>
                      <p className="text-sm text-text-primary">{formatCurrency(holding.averageCost)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-medium">Current</p>
                      <p className="text-sm text-text-primary">{formatCurrency(holding.currentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase font-medium">Value</p>
                      <p className="text-sm font-semibold text-text-primary">{formatCompactINR(holding.currentValue)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border-light">
                    <div className="flex items-center gap-1.5">
                      {isGain ? (
                        <TrendingUp className="w-3.5 h-3.5 text-gain" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-loss" />
                      )}
                      <span className={cn('text-sm font-semibold', isGain ? 'text-gain' : 'text-loss')}>
                        {isGain ? '+' : ''}{formatCompactINR(holding.unrealizedGain)}
                      </span>
                      <span className={cn('badge text-[10px]', isGain ? 'badge-green' : 'badge-red')}>
                        {formatPercent(holding.unrealizedGainPercent)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
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
                className="p-6 cursor-pointer group"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getBadgeColor(portfolio.type))}>
                      {getIcon(portfolio.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-green transition-colors">
                        {portfolio.name}
                      </h3>
                      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-1">
                        {portfolio.type} PORTFOLIO
                      </p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-surface-hover">
                    <MoreVertical className="w-4 h-4 text-text-tertiary" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border-light">
                    <span className="text-sm text-text-secondary">Your Role</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {portfolio.isDefault ? 'Owner' : 'Member'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border-light">
                    <span className="text-sm text-text-secondary">Members</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {portfolio.members?.length || 1}
                      </span>
                      <Users className="w-3.5 h-3.5 text-text-tertiary" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setActivePortfolioId(portfolio.id)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                      activePortfolio?.id === portfolio.id
                        ? 'bg-brand-green/10 text-brand-green'
                        : 'bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    )}
                  >
                    {activePortfolio?.id === portfolio.id ? 'Active' : 'Switch To'}
                  </button>
                  <button className="flex-1 py-2 bg-surface-muted text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg text-sm font-semibold transition-all">
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

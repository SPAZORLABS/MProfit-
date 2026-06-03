'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCompactINR, formatCurrency, formatPercent } from '@Aurapex/shared';
import {
  mockDashboardSummary,
  mockMarketUpdates,
} from '@/lib/mock-data';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import {
  TrendingUp,
  Wallet,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Plus,
  Eye,
} from 'lucide-react';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { AssetAllocationSection } from '@/components/dashboard/asset-allocation';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { MarketUpdateCard } from '@/components/dashboard/market-update-card';
import { HoldingsTable } from '@/components/dashboard/holdings-table';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = React.useState<any>(null);
  const [allocations, setAllocations] = React.useState<any[]>([]);
  const [holdings, setHoldings] = React.useState<any[]>([]);
  const [insights, setInsights] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (authLoading) return;

    // If not authenticated, the useAuth hook (or a middleware) should redirect, but we safeguard here
    if (!isAuthenticated) return;

    const fetchDashboard = async () => {
      try {
        const portfolios = await ApiClient.getPortfolios() as any[];
        if (portfolios && portfolios.length > 0) {
          // Fetch summary for the primary portfolio
          const data: any = await ApiClient.getPortfolioSummary(portfolios[0].id);

          // Fetch real AI insights
          try {
            const fetchedInsights: any = await ApiClient.getInsights(portfolios[0].id);
            setInsights(fetchedInsights);
          } catch (insightErr) {
            console.error('Failed to fetch insights', insightErr);
          }

          // Fetch XIRR Performance Metrics
          let xirrData = { xirr: 0, cagr: 0 };
          try {
            xirrData = (await ApiClient.getXIRR(portfolios[0].id)) as any;
          } catch (xirrErr) {
            console.error('Failed to fetch XIRR', xirrErr);
          }

          // Fetch real asset allocation
          try {
            const fetchedAllocations: any = await ApiClient.getAssetAllocation(portfolios[0].id);
            // Format to what UI expects: { category: string, value: number, percentage: number, color: string }
            // The backend returns { category, value, percentage }
            const colorMap: Record<string, string> = {
              'EQUITY': '#10b981',
              'MUTUAL_FUND': '#3b82f6',
              'FIXED_INCOME': '#f59e0b',
              'REAL_ESTATE': '#8b5cf6',
              'CASH': '#64748b',
            };
            const mappedAllocations = fetchedAllocations.map((a: any) => ({
              ...a,
              color: colorMap[a.category] || '#94a3b8'
            }));
            setAllocations(mappedAllocations);
          } catch (allocErr) {
            console.error('Failed to fetch allocations', allocErr);
          }

          // Fetch raw portfolio for holdings
          try {
            const rawPortfolio: any = await ApiClient.getPortfolioById(portfolios[0].id);
            if (rawPortfolio.holdings) {
              // Map backend holdings to UI format
              const mappedHoldings = rawPortfolio.holdings.map((h: any) => ({
                id: h.id,
                assetName: h.asset.name,
                ticker: h.asset.ticker,
                quantity: h.quantity,
                avgCost: h.averageCost,
                currentPrice: h.asset.currentPrice,
                currentValue: h.quantity * h.asset.currentPrice,
                dayChange: h.asset.currentPrice * 0.02, // Mock 2% daily change for demo
                dayChangePercent: 2.0,
                totalReturn: (h.asset.currentPrice - h.averageCost) * h.quantity,
                totalReturnPercent: ((h.asset.currentPrice - h.averageCost) / h.averageCost) * 100,
              }));
              setHoldings(mappedHoldings);
            }
          } catch (holdErr) {
            console.error('Failed to fetch portfolio holdings', holdErr);
          }

          // Map backend response to the shape the UI expects
          // The backend returns: { totalValue, totalInvested, todaysGain, totalGain }
          setSummary({
            totalValue: data.totalValue,
            investedAmount: data.totalInvested,
            dayGain: {
              value: data.todaysGain || 0,
              percentage: data.totalInvested > 0 ? (data.todaysGain / data.totalInvested) * 100 : 0
            },
            totalGain: {
              value: data.totalGain || 0,
              percentage: data.totalInvested > 0 ? (data.totalGain / data.totalInvested) * 100 : 0
            },
            xirr: xirrData.xirr || 0 // Integrated FR-11 XIRR
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ─── KPI Cards Row ─────────────────────────────────────── */}
      <KPICards summary={summary || mockDashboardSummary} />

      {/* ─── Main Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation (2 cols) */}
        <div className="lg:col-span-2">
          {allocations.length > 0 ? (
            <AssetAllocationSection allocations={allocations} />
          ) : (
            <Card className="flex items-center justify-center h-full min-h-[300px]">
              <p className="text-text-secondary text-sm font-medium">No allocation data found</p>
            </Card>
          )}
        </div>

        {/* AI Insights & Market Updates (1 col) */}
        <div className="space-y-4">
          {insights.length > 0 ? (
            <AIInsightCard insight={insights[0]} />
          ) : (
            <Card className="p-6 text-sm text-text-secondary font-medium">
              No new AI Insights available.
            </Card>
          )}
          <MarketUpdateCard update={mockMarketUpdates[0]} />
        </div>
      </div>

      {/* ─── Top Holdings ──────────────────────────────────────── */}
      {holdings.length > 0 ? (
        <HoldingsTable holdings={holdings} />
      ) : (
        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">No holdings found in portfolio.</p>
        </Card>
      )}
    </motion.div>
  );
}

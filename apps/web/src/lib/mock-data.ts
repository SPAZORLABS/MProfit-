// ════════════════════════════════════════════════════════════════
// Aurapex Next — Mock Data (Matches Design Screenshots Exactly)
// ════════════════════════════════════════════════════════════════

import type {
  DashboardSummary,
  AssetAllocation,
  Holding,
  MarketUpdate,
  AIInsight,
  TaxSummary,
  TaxLot,
  TaxOptimizationInsight,
  SectorAttribution,
  PerformanceMetrics,
  PerformanceDataPoint,
  Portfolio,
  AIMessage,
  ScenarioVariable,
  Notification,
} from '@Aurapex/shared';
import {
  AssetCategory,
  AssetType,
  PortfolioType,
  AIInsightType,
  TaxType,
  MomentumScore,
} from '@Aurapex/shared';

// ─── Dashboard Summary (matches Screen 2) ───────────────────────

export const mockDashboardSummary: DashboardSummary = {
  netWorth: 42000000,         // ₹4.2 Cr
  investedAmount: 28000000,   // ₹2.8 Cr
  currentValue: 42000000,
  todaysGain: 45200,          // +₹45,200
  todaysGainPercent: 0.11,
  unrealizedGain: 14000000,   // +₹1.4 Cr
  unrealizedGainPercent: 50.1,
  absoluteReturn: 50.1,
  absoluteReturnPercent: 50.1,
  xirr: 18.4,
  cagr3Y: 15.2,
  cashDragPercent: 12,
  monthlyChange: 504000,
  monthlyChangePercent: 1.2,
  lastSyncAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
};

// ─── Asset Allocation (matches Screen 2 donut chart) ─────────────

export const mockAssetAllocation: AssetAllocation[] = [
  {
    category: AssetCategory.EQUITY,
    label: 'Equity',
    value: 23100000,   // ₹2.31 Cr
    percentage: 55,
    color: '#1a1f2e',
    icon: '📈',
    description: 'High Risk, Growth',
  },
  {
    category: AssetCategory.DEBT,
    label: 'Debt',
    value: 10500000,   // ₹1.05 Cr
    percentage: 25,
    color: '#8b5cf6',
    icon: '🏛️',
    description: 'Stable Returns',
  },
  {
    category: AssetCategory.GOLD,
    label: 'Gold',
    value: 4200000,    // ₹42.0 L
    percentage: 10,
    color: '#f59e0b',
    icon: '💎',
    description: 'Inflation Hedge',
  },
  {
    category: AssetCategory.CASH,
    label: 'Cash',
    value: 2100000,
    percentage: 5,
    color: '#6b7280',
    icon: '💰',
    description: 'Liquidity',
  },
  {
    category: AssetCategory.ALTERNATIVES,
    label: 'Alternatives',
    value: 2100000,
    percentage: 5,
    color: '#3b82f6',
    icon: '🔮',
    description: 'Alternative Investments',
  },
];

// ─── Holdings (matches Screen 2 table) ───────────────────────────

export const mockHoldings: Holding[] = [
  {
    id: 'h1',
    portfolioId: 'p1',
    assetId: 'a1',
    asset: {
      id: 'a1', isin: 'INE002A01018', symbol: 'RELIANCE', name: 'Reliance Industries',
      assetType: AssetType.EQUITY, category: AssetCategory.EQUITY, exchange: 'NSE',
      sector: 'Oil & Gas', industry: 'Conglomerate', currency: 'INR', lotSize: 1, metadata: {},
    },
    quantity: 450,
    averageCost: 2420.00,
    currentPrice: 2985.40,
    currentValue: 1343430,
    investedValue: 1089000,
    unrealizedGain: 254430,
    unrealizedGainPercent: 23.4,
    dayChange: 35.40,
    dayChangePercent: 1.2,
    allocation: 14.2,
    source: 'NSDL',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h2',
    portfolioId: 'p1',
    assetId: 'a2',
    asset: {
      id: 'a2', isin: 'INE040A01034', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd',
      assetType: AssetType.EQUITY, category: AssetCategory.EQUITY, exchange: 'NSE',
      sector: 'Banking', industry: 'Private Banking', currency: 'INR', lotSize: 1, metadata: {},
    },
    quantity: 1200,
    averageCost: 1550.00,
    currentPrice: 1642.15,
    currentValue: 1970580,
    investedValue: 1860000,
    unrealizedGain: 110580,
    unrealizedGainPercent: 5.9,
    dayChange: -6.85,
    dayChangePercent: -0.4,
    allocation: 9.8,
    source: 'CDSL',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h3',
    portfolioId: 'p1',
    assetId: 'a3',
    asset: {
      id: 'a3', isin: 'INE009A01021', symbol: 'INFY', name: 'Infosys Limited',
      assetType: AssetType.EQUITY, category: AssetCategory.EQUITY, exchange: 'NSE',
      sector: 'IT & Technology', industry: 'IT Services', currency: 'INR', lotSize: 1, metadata: {},
    },
    quantity: 800,
    averageCost: 1320.00,
    currentPrice: 1510.45,
    currentValue: 1208360,
    investedValue: 1056000,
    unrealizedGain: 152360,
    unrealizedGainPercent: 14.4,
    dayChange: 41.45,
    dayChangePercent: 2.8,
    allocation: 8.5,
    source: 'NSDL',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h4',
    portfolioId: 'p1',
    assetId: 'a4',
    asset: {
      id: 'a4', isin: 'INE467B01029', symbol: 'TCS', name: 'TCS Ltd',
      assetType: AssetType.EQUITY, category: AssetCategory.EQUITY, exchange: 'NSE',
      sector: 'IT & Technology', industry: 'IT Services', currency: 'INR', lotSize: 1, metadata: {},
    },
    quantity: 320,
    averageCost: 3400.00,
    currentPrice: 4120.30,
    currentValue: 1318496,
    investedValue: 1088000,
    unrealizedGain: 230496,
    unrealizedGainPercent: 21.2,
    dayChange: 32.30,
    dayChangePercent: 0.8,
    allocation: 7.2,
    source: 'NSDL',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h5',
    portfolioId: 'p1',
    assetId: 'a5',
    asset: {
      id: 'a5', isin: 'INF109K01Z48', symbol: 'ICICIPRU', name: 'ICICI Prudential Bluechip',
      assetType: AssetType.MUTUAL_FUND, category: AssetCategory.EQUITY, exchange: 'AMFI',
      sector: 'Large Cap', industry: 'Mutual Fund', currency: 'INR', lotSize: 1, metadata: {},
    },
    quantity: 5420,
    averageCost: 42.10,
    currentPrice: 84.45,
    currentValue: 457719,
    investedValue: 228182,
    unrealizedGain: 229537,
    unrealizedGainPercent: 100.6,
    dayChange: 0.25,
    dayChangePercent: 0.3,
    allocation: 6.5,
    source: 'CAMS',
    lastUpdated: new Date().toISOString(),
  },
];

// ─── Portfolios ──────────────────────────────────────────────────

export const mockPortfolios: Portfolio[] = [
  { id: 'p1', name: 'Family Portfolio', type: PortfolioType.FAMILY, userId: 'u1', tenantId: 't1', isDefault: true, createdAt: '2020-01-15', updatedAt: '2024-03-15' },
  { id: 'p2', name: 'Retirement Fund', type: PortfolioType.GOAL, userId: 'u1', tenantId: 't1', parentId: 'p1', isDefault: false, goalAmount: 50000000, goalDate: '2045-01-01', createdAt: '2021-06-01', updatedAt: '2024-03-15' },
  { id: 'p3', name: "Children's Education", type: PortfolioType.GOAL, userId: 'u1', tenantId: 't1', parentId: 'p1', isDefault: false, goalAmount: 20000000, goalDate: '2035-06-01', createdAt: '2022-01-01', updatedAt: '2024-03-15' },
  { id: 'p4', name: 'Trading Portfolio', type: PortfolioType.INDIVIDUAL, userId: 'u1', tenantId: 't1', isDefault: false, createdAt: '2023-01-01', updatedAt: '2024-03-15' },
];

// ─── AI Insights (matches Screen 2 sidebar + Screen 3) ───────────

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: AIInsightType.CONCENTRATION_RISK,
    title: 'Diversification Alert',
    body: 'High concentration in **Large Cap Tech (32%)**. AI suggests rebalancing to Mid-cap for risk parity.',
    confidence: 0.94,
    whyGenerated: 'Sector concentration exceeded 30% threshold',
    dataTrigger: 'IT sector weight: 32.1%',
    assumptionsUsed: ['Current market conditions', 'Historical sector rotation data', 'Risk parity model'],
    estimatedImpact: 'Potential risk reduction of 15-20% with maintained returns',
    disclaimer: 'This is not financial advice. Consult your advisor before rebalancing.',
    actionLabel: 'Rebalance Portfolio',
    actionUrl: '/portfolio/rebalance',
    portfolioId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai2',
    type: AIInsightType.ALLOCATION_DRIFT,
    title: 'Allocation Drift',
    body: 'Your "International Equity" is **8% overweight** compared to your target asset model.',
    confidence: 0.87,
    whyGenerated: 'Allocation deviation from target model exceeded 5%',
    dataTrigger: 'International equity: 18% vs target 10%',
    assumptionsUsed: ['Target allocation model', 'Current portfolio weights'],
    estimatedImpact: 'Realigning could reduce portfolio volatility by 8%',
    disclaimer: 'This is not financial advice.',
    actionLabel: 'Rebalance Portfolio',
    actionUrl: '/portfolio/rebalance',
    portfolioId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ai3',
    type: AIInsightType.FUND_OVERLAP,
    title: 'Fund Overlap',
    body: 'HDFC Top 100 and ICICI Bluechip share **42% common holdings** (Reliance, HDFC Bank).',
    confidence: 0.91,
    whyGenerated: 'Fund overlap analysis detected >30% common holdings',
    dataTrigger: 'Common holdings: Reliance, HDFC Bank, Infosys',
    assumptionsUsed: ['Latest fund factsheet data', 'Overlap threshold: 30%'],
    estimatedImpact: 'Consolidating could reduce expense ratio by ₹12,400/year',
    disclaimer: 'This is not financial advice.',
    actionLabel: 'View Detailed Map',
    actionUrl: '/analytics/fund-overlap',
    portfolioId: 'p1',
    createdAt: new Date().toISOString(),
  },
];

// ─── Market Updates (matches Screen 2) ───────────────────────────

export const mockMarketUpdates: MarketUpdate[] = [
  {
    id: 'm1',
    headline: 'NIFTY 50 hits record high',
    summary: 'Expect short-term volatility in your Auto-sector holdings.',
    category: 'MARKET',
    impactScore: 7,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    headline: 'RBI keeps repo rate unchanged at 6.5%',
    summary: 'Positive for debt allocation, consider increasing debt exposure.',
    category: 'POLICY',
    impactScore: 6,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ─── Performance Data (matches Screen 3) ─────────────────────────

export const mockPerformanceMetrics: PerformanceMetrics = {
  xirr: 18.4,
  cagr1Y: 22.1,
  cagr3Y: 15.2,
  cagr5Y: 14.8,
  absoluteReturn: 50.1,
  absoluteReturnValue: 12400000,  // ₹1.24 Cr
  benchmarkXirr: 14.2,
  alpha: 4.2,
  sharpeRatio: 1.45,
  sortinoRatio: 1.82,
  maxDrawdown: -12.3,
  volatility: 15.6,
};

export const mockPerformanceData: PerformanceDataPoint[] = (() => {
  const data: PerformanceDataPoint[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-03-01');
  let portfolioValue = 100;
  let benchmarkValue = 100;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    portfolioValue *= 1 + (Math.random() * 0.03 - 0.008);
    benchmarkValue *= 1 + (Math.random() * 0.025 - 0.008);
    data.push({
      date: d.toISOString().split('T')[0],
      portfolioValue: Math.round(portfolioValue * 100) / 100,
      benchmarkValue: Math.round(benchmarkValue * 100) / 100,
    });
  }
  return data;
})();

// ─── Sector Attribution (matches Screen 3 table) ─────────────────

export const mockSectorAttribution: SectorAttribution[] = [
  {
    sector: 'IT & Technology',
    icon: '💻',
    weightage: 28.4,
    contribution: 3240000,
    performance1Y: 22.4,
    momentumScore: MomentumScore.HIGH,
  },
  {
    sector: 'Financials',
    icon: '🏦',
    weightage: 35.1,
    contribution: 4350000,
    performance1Y: 14.2,
    momentumScore: MomentumScore.NEUTRAL,
  },
  {
    sector: 'Healthcare',
    icon: '🏥',
    weightage: 12.2,
    contribution: 1510000,
    performance1Y: -2.4,
    momentumScore: MomentumScore.LOW,
  },
  {
    sector: 'Consumer Goods',
    icon: '🛍️',
    weightage: 10.5,
    contribution: 1280000,
    performance1Y: 8.6,
    momentumScore: MomentumScore.NEUTRAL,
  },
  {
    sector: 'Energy',
    icon: '⚡',
    weightage: 8.2,
    contribution: 980000,
    performance1Y: 18.9,
    momentumScore: MomentumScore.HIGH,
  },
];

// ─── Tax Data (matches Screen 4) ─────────────────────────────────

export const mockTaxSummary: TaxSummary = {
  fiscalYear: '2023-24',
  stcg: 842100,
  ltcg: 1892450,
  estimatedLiability: 315420,
  harvestingSavingsPotential: 242000,
  harvestingPositions: 14,
  indexationBenefit: 0,
  grandfatheredBenefit: 0,
  section111A: 842100,
  section112: 0,
  section112A: 1892450,
};

export const mockTaxLots: TaxLot[] = [
  {
    id: 'tl1',
    holdingId: 'h1',
    holding: mockHoldings[0],
    acquisitionDate: '2017-01-12',
    quantity: 1200,
    costBasis: 942.50,
    currentValue: 2985.40 * 1200,
    isGrandfathered: true,
    grandfatheredValue: 1050.00,
    unrealizedGain: -1422400,
    taxType: TaxType.LTCG,
    holdingPeriodDays: 2653,
  },
  {
    id: 'tl2',
    holdingId: 'h3',
    holding: mockHoldings[2],
    acquisitionDate: '2023-11-22',
    quantity: 850,
    costBasis: 1540.00,
    currentValue: 1510.45 * 850,
    isGrandfathered: false,
    unrealizedGain: -32150,
    taxType: TaxType.STCG,
    holdingPeriodDays: 132,
  },
  {
    id: 'tl3',
    holdingId: 'h2',
    holding: mockHoldings[1],
    acquisitionDate: '2023-08-15',
    quantity: 400,
    costBasis: 1672.20,
    currentValue: 1642.15 * 400,
    isGrandfathered: false,
    unrealizedGain: -42000,
    taxType: TaxType.STCG,
    holdingPeriodDays: 231,
  },
  {
    id: 'tl4',
    holdingId: 'h4',
    holding: mockHoldings[3],
    acquisitionDate: '2018-05-04',
    quantity: 250,
    costBasis: 2840.10,
    currentValue: 4120.30 * 250,
    isGrandfathered: true,
    grandfatheredValue: 3100.00,
    unrealizedGain: 512000,
    taxType: TaxType.LTCG,
    holdingPeriodDays: 2150,
  },
];

export const mockTaxOptimizationInsight: TaxOptimizationInsight = {
  id: 'toi1',
  title: 'Tax Optimization Suggestion',
  description: 'Sell 400 units of **HDFC Bank ADR** to harvest losses and offset gains, saving ₹42,000 in STCG. This trade maintains your sector exposure while effectively reducing your net tax outflow.',
  potentialSaving: 42000,
  tradeDetails: [
    { assetName: 'HDFC Bank ADR', quantity: 400, action: 'SELL', estimatedTaxImpact: -42000 },
  ],
  confidence: 0.89,
  type: AIInsightType.TAX_OPTIMIZATION,
};

// ─── AI Copilot Data (matches Screen 5) ──────────────────────────

export const mockAIConversationMessages: AIMessage[] = [
  {
    id: 'msg1',
    role: 'user',
    content: 'What happens to my portfolio if the Nifty 50 drops 15%?',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'msg2',
    role: 'assistant',
    content: 'Simulating a **15% market crash**... Your portfolio would see an estimated drawdown of **9.2%**. This resilience is primarily due to your **25% debt allocation** which acts as a hedge during equity volatility.',
    metadata: {
      chartData: {
        preCrash: 100,
        marketDrop: -15,
        portfolio: -9.2,
        recoveryEstimate: 6.8,
      },
      insight: {
        id: 'ins1',
        type: AIInsightType.DIVERSIFICATION,
        title: 'AI Insight',
        body: 'The drawdown is manageable, but your exposure to \'Growth\' sector small-caps would account for 60% of the losses. Consider shifting 5% to Gold as an additional buffer.',
        confidence: 0.85,
        whyGenerated: 'Scenario simulation',
        dataTrigger: 'Market drop simulation of 15%',
        assumptionsUsed: ['Historical volatility', 'Current debt ratios'],
        estimatedImpact: '₹12L - ₹18L',
        disclaimer: 'This is a simulation and does not guarantee outcomes.',
        portfolioId: 'p1',
        createdAt: new Date().toISOString(),
      },
      confidence: 'HIGH',
      assumptions: 'HISTORICAL VOLATILITY, CURRENT DEBT RATIOS',
      estimatedImpact: '₹12L - ₹18L',
    },
    createdAt: new Date(Date.now() - 240000).toISOString(),
  },
];

export const mockScenarioVariables: ScenarioVariable[] = [
  { id: 'sv1', label: 'Inflation Shock', value: 2.0, min: -5, max: 15, step: 0.5, unit: '%', suffix: '%' },
  { id: 'sv2', label: 'Interest Rate Hike', value: 50, min: 0, max: 500, step: 25, unit: 'bps', suffix: 'bps' },
  { id: 'sv3', label: 'Sector Collapse (Tech)', value: -22, min: -100, max: 0, step: 1, unit: '%', suffix: '%' },
];

// ─── Notifications ───────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Portfolio synced', body: 'All holdings updated successfully', type: 'SUCCESS', read: false, createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: 'n2', userId: 'u1', title: 'AI Insight', body: 'New diversification recommendation available', type: 'AI_INSIGHT', read: false, actionUrl: '/dashboard', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', userId: 'u1', title: 'Tax Report Ready', body: 'Your FY 2023-24 tax report is ready to download', type: 'INFO', read: true, actionUrl: '/reports', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

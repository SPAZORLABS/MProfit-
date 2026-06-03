// ════════════════════════════════════════════════════════════════
// Aurapex Next — Application Constants
// ════════════════════════════════════════════════════════════════

import { AssetCategory } from '../types';

// ─── Design Tokens ───────────────────────────────────────────────

export const COLORS = {
  // Primary
  sidebarBg: '#1a1f2e',
  sidebarText: '#94a3b8',
  sidebarActiveText: '#ffffff',
  sidebarAccent: '#22c55e',

  // Accent
  primaryGreen: '#22c55e',
  primaryDark: '#1a1f2e',
  primaryBlue: '#3b82f6',

  // Semantic
  gain: '#22c55e',
  loss: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Neutrals
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  bgMain: '#f3f4f6',
  bgCard: '#ffffff',
  bgMuted: '#f9fafb',

  // AI
  aiCardBg: '#1a1f2e',
  aiCardText: '#ffffff',
  aiAccent: '#a855f7',
  insightGold: '#fef3c7',
  insightGoldBorder: '#f59e0b',
} as const;

// ─── Asset Allocation Colors ──────────────────────────────────────

export const ASSET_ALLOCATION_COLORS: Record<AssetCategory, string> = {
  [AssetCategory.EQUITY]: '#1a1f2e',
  [AssetCategory.DEBT]: '#8b5cf6',
  [AssetCategory.GOLD]: '#f59e0b',
  [AssetCategory.CASH]: '#6b7280',
  [AssetCategory.ALTERNATIVES]: '#3b82f6',
  [AssetCategory.REAL_ESTATE]: '#ec4899',
};

export const ASSET_ALLOCATION_LABELS: Record<AssetCategory, { label: string; description: string; icon: string }> = {
  [AssetCategory.EQUITY]: { label: 'Equity', description: 'High Risk, Growth', icon: '📈' },
  [AssetCategory.DEBT]: { label: 'Debt', description: 'Stable Returns', icon: '🏛️' },
  [AssetCategory.GOLD]: { label: 'Gold', description: 'Inflation Hedge', icon: '💎' },
  [AssetCategory.CASH]: { label: 'Cash', description: 'Liquidity', icon: '💰' },
  [AssetCategory.ALTERNATIVES]: { label: 'Alternatives', description: 'Alternative Investments', icon: '🔮' },
  [AssetCategory.REAL_ESTATE]: { label: 'Real Estate', description: 'Property Holdings', icon: '🏠' },
};

// ─── Indian Tax Constants ────────────────────────────────────────

export const TAX_RATES = {
  STCG_EQUITY: 0.15,     // Section 111A
  LTCG_EQUITY: 0.10,     // Section 112A (above ₹1L exemption)
  LTCG_EQUITY_EXEMPTION: 100000, // ₹1,00,000
  STCG_DEBT: 0.30,       // As per slab (max)
  LTCG_DEBT: 0.20,       // Section 112 (with indexation)
  LTCG_DEBT_WITHOUT_INDEXATION: 0.10,
  SURCHARGE_50L_1CR: 0.10,
  SURCHARGE_1CR_2CR: 0.15,
  CESS: 0.04,
} as const;

// Long-term holding periods (in months)
export const LTCG_HOLDING_PERIOD = {
  EQUITY: 12,
  MUTUAL_FUND_EQUITY: 12,
  MUTUAL_FUND_DEBT: 36,
  BOND: 36,
  GOLD: 36,
  REAL_ESTATE: 24,
  DEFAULT: 36,
} as const;

// Grandfathering date for equity (Budget 2018)
export const GRANDFATHERING_DATE = '2018-01-31';
export const GRANDFATHERING_FMV_DATE = '2018-01-31';

// Cost Inflation Index Table
export const CII_TABLE: Record<string, number> = {
  '2001-02': 100,
  '2002-03': 105,
  '2003-04': 109,
  '2004-05': 113,
  '2005-06': 117,
  '2006-07': 122,
  '2007-08': 129,
  '2008-09': 137,
  '2009-10': 148,
  '2010-11': 167,
  '2011-12': 184,
  '2012-13': 200,
  '2013-14': 220,
  '2014-15': 240,
  '2015-16': 254,
  '2016-17': 264,
  '2017-18': 272,
  '2018-19': 280,
  '2019-20': 289,
  '2020-21': 301,
  '2021-22': 317,
  '2022-23': 331,
  '2023-24': 348,
  '2024-25': 363,
};

// ─── Financial Year Helpers ──────────────────────────────────────

export const FISCAL_YEARS = [
  '2024-25', '2023-24', '2022-23', '2021-22', '2020-21',
  '2019-20', '2018-19', '2017-18', '2016-17',
] as const;

// ─── Currency ────────────────────────────────────────────────────

export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
} as const;

// ─── Pagination Defaults ─────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

// ─── AI Guardrails ───────────────────────────────────────────────

export const AI_DISCLAIMER =
  'This analysis is for informational purposes only and does not constitute financial advice. ' +
  'Aurapex does not execute trades or guarantee returns. Consult a registered financial advisor ' +
  'before making investment decisions.';

export const AI_FORBIDDEN_ACTIONS = [
  'execute_trade',
  'place_order',
  'guarantee_return',
  'replace_advisor',
  'transfer_funds',
] as const;

export const AI_CONFIDENCE_LEVELS = {
  HIGH: { min: 0.8, label: 'HIGH', color: '#22c55e' },
  MEDIUM: { min: 0.5, label: 'MEDIUM', color: '#f59e0b' },
  LOW: { min: 0, label: 'LOW', color: '#ef4444' },
} as const;

// ─── Broker Registry ─────────────────────────────────────────────

export const BROKER_CONNECTORS = [
  { id: 'zerodha', name: 'Zerodha', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'groww', name: 'Groww', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'upstox', name: 'Upstox', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'angel', name: 'Angel One', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'icici_direct', name: 'ICICI Direct', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'hdfc_securities', name: 'HDFC Securities', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'kotak_securities', name: 'Kotak Securities', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'axis_direct', name: 'Axis Direct', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'motilal_oswal', name: 'Motilal Oswal', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'sharekhan', name: 'Sharekhan', type: 'BROKER_API', status: 'ACTIVE' },
  { id: 'cams', name: 'CAMS', type: 'PAN_AGGREGATION', status: 'ACTIVE' },
  { id: 'kfintech', name: 'KFintech', type: 'PAN_AGGREGATION', status: 'ACTIVE' },
  { id: 'mf_central', name: 'MF Central', type: 'PAN_AGGREGATION', status: 'ACTIVE' },
  { id: 'nsdl', name: 'NSDL', type: 'PAN_AGGREGATION', status: 'ACTIVE' },
  { id: 'cdsl', name: 'CDSL', type: 'PAN_AGGREGATION', status: 'ACTIVE' },
] as const;

// ─── Navigation ──────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: 'Briefcase', href: '/portfolio' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', href: '/analytics' },
  { id: 'tax', label: 'Tax', icon: 'Receipt', href: '/tax' },
  { id: 'reports', label: 'Reports', icon: 'FileText', href: '/reports' },
  { id: 'ai-copilot', label: 'AI Copilot', icon: 'Sparkles', href: '/ai-copilot' },
  { id: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
] as const;

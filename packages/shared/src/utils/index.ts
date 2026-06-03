// ════════════════════════════════════════════════════════════════
// Aurapex Next — Shared Utilities
// ════════════════════════════════════════════════════════════════

import { CURRENCY, CII_TABLE, LTCG_HOLDING_PERIOD, GRANDFATHERING_DATE, TAX_RATES } from '../constants';
import { AssetType, TaxType } from '../types';

// ─── Currency Formatting ─────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency.
 * Uses Indian number system (lakhs, crores).
 */
export function formatCurrency(amount: number, options?: { compact?: boolean; showSign?: boolean }): string {
  const { compact = false, showSign = false } = options ?? {};

  const sign = showSign && amount > 0 ? '+' : '';

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      return `${sign}${CURRENCY.symbol}${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${sign}${CURRENCY.symbol}${(amount / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${sign}${CURRENCY.symbol}${(amount / 1000).toFixed(1)}K`;
    }
  }

  const formatted = new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSign && amount > 0 ? `+${formatted}` : formatted;
}

/**
 * Format compact Indian number (e.g., 4.2 Cr, 42 L)
 */
export function formatCompactINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}${CURRENCY.symbol}${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
  }
  if (abs >= 100000) {
    const lakh = abs / 100000;
    return `${sign}${CURRENCY.symbol}${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} L`;
  }

  return formatCurrency(amount);
}

// ─── Percentage Formatting ───────────────────────────────────────

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

// ─── Date Formatting ─────────────────────────────────────────────

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── XIRR Calculation (Newton-Raphson) ───────────────────────────

interface CashFlow {
  amount: number;
  date: Date;
}

/**
 * Calculate XIRR using Newton-Raphson method.
 * Cash outflows (investments) should be negative.
 * Cash inflows (current value, dividends) should be positive.
 */
export function calculateXIRR(cashFlows: CashFlow[], guess: number = 0.1): number {
  if (cashFlows.length < 2) return 0;

  const TOLERANCE = 1e-10;
  const MAX_ITERATIONS = 1000;

  // Sort by date
  const sorted = [...cashFlows].sort((a, b) => a.date.getTime() - b.date.getTime());
  const d0 = sorted[0].date.getTime();

  // Days from first cash flow
  const days = sorted.map(cf => (cf.date.getTime() - d0) / 86400000);
  const amounts = sorted.map(cf => cf.amount);

  let rate = guess;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < amounts.length; j++) {
      const t = days[j] / 365;
      const factor = Math.pow(1 + rate, t);
      npv += amounts[j] / factor;
      dnpv -= (t * amounts[j]) / (factor * (1 + rate));
    }

    if (Math.abs(npv) < TOLERANCE) {
      return rate;
    }

    if (Math.abs(dnpv) < TOLERANCE) {
      // Derivative too small, try bracket method
      break;
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < TOLERANCE) {
      return newRate;
    }

    rate = newRate;

    // Clamp to reasonable range
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }

  // Fallback: bisection method
  return bisectionXIRR(amounts, days);
}

function bisectionXIRR(amounts: number[], days: number[]): number {
  let low = -0.99;
  let high = 10;
  const TOLERANCE = 1e-10;
  const MAX_ITERATIONS = 1000;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    let npv = 0;

    for (let j = 0; j < amounts.length; j++) {
      npv += amounts[j] / Math.pow(1 + mid, days[j] / 365);
    }

    if (Math.abs(npv) < TOLERANCE || (high - low) / 2 < TOLERANCE) {
      return mid;
    }

    // Compute NPV at low
    let npvLow = 0;
    for (let j = 0; j < amounts.length; j++) {
      npvLow += amounts[j] / Math.pow(1 + low, days[j] / 365);
    }

    if (npv * npvLow > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export function calculateCAGR(beginValue: number, endValue: number, years: number): number {
  if (beginValue <= 0 || years <= 0) return 0;
  return Math.pow(endValue / beginValue, 1 / years) - 1;
}

/**
 * Calculate absolute return percentage
 */
export function calculateAbsoluteReturn(invested: number, current: number): number {
  if (invested === 0) return 0;
  return ((current - invested) / invested) * 100;
}

// ─── Tax Computation Helpers ─────────────────────────────────────

/**
 * Determine if a holding qualifies as LTCG based on asset type and holding period
 */
export function determineTaxType(assetType: AssetType, acquisitionDate: Date, saleDate: Date): TaxType {
  const holdingMonths = monthsBetween(acquisitionDate, saleDate);

  const requiredMonths = (() => {
    switch (assetType) {
      case AssetType.EQUITY:
      case AssetType.ETF:
        return LTCG_HOLDING_PERIOD.EQUITY;
      case AssetType.MUTUAL_FUND:
        return LTCG_HOLDING_PERIOD.MUTUAL_FUND_EQUITY;
      case AssetType.DEBT_FUND:
        return LTCG_HOLDING_PERIOD.MUTUAL_FUND_DEBT;
      case AssetType.BOND:
      case AssetType.DEBENTURE:
        return LTCG_HOLDING_PERIOD.BOND;
      case AssetType.GOLD:
        return LTCG_HOLDING_PERIOD.GOLD;
      case AssetType.REAL_ESTATE:
        return LTCG_HOLDING_PERIOD.REAL_ESTATE;
      default:
        return LTCG_HOLDING_PERIOD.DEFAULT;
    }
  })();

  return holdingMonths >= requiredMonths ? TaxType.LTCG : TaxType.STCG;
}

/**
 * Calculate indexed cost of acquisition using CII
 */
export function calculateIndexedCost(
  costBasis: number,
  acquisitionFY: string,
  saleFY: string
): number {
  const acquisitionCII = CII_TABLE[acquisitionFY];
  const saleCII = CII_TABLE[saleFY];

  if (!acquisitionCII || !saleCII) return costBasis;

  return (costBasis * saleCII) / acquisitionCII;
}

/**
 * Calculate grandfathered cost for equity (Budget 2018)
 * Fair Market Value (FMV) as of Jan 31, 2018 is used as cost
 * if actual cost is lower than FMV
 */
export function calculateGrandfatheredCost(
  actualCost: number,
  fmvOnGrandfatherDate: number,
  salePrice: number
): number {
  // If sale price < FMV, use sale price as FMV
  const effectiveFMV = Math.min(fmvOnGrandfatherDate, salePrice);

  // Grandfathered cost = max(actual cost, effective FMV)
  return Math.max(actualCost, effectiveFMV);
}

/**
 * Check if a holding is eligible for grandfathering
 */
export function isGrandfathered(acquisitionDate: Date): boolean {
  return acquisitionDate < new Date(GRANDFATHERING_DATE);
}

/**
 * Calculate tax on capital gains
 */
export function calculateTax(
  gain: number,
  taxType: TaxType,
  assetType: AssetType
): number {
  if (gain <= 0) return 0;

  if (taxType === TaxType.STCG) {
    if ([AssetType.EQUITY, AssetType.ETF, AssetType.MUTUAL_FUND].includes(assetType)) {
      return gain * TAX_RATES.STCG_EQUITY;
    }
    return gain * TAX_RATES.STCG_DEBT;
  }

  // LTCG
  if ([AssetType.EQUITY, AssetType.ETF, AssetType.MUTUAL_FUND].includes(assetType)) {
    const taxableGain = Math.max(0, gain - TAX_RATES.LTCG_EQUITY_EXEMPTION);
    return taxableGain * TAX_RATES.LTCG_EQUITY;
  }

  return gain * TAX_RATES.LTCG_DEBT;
}

// ─── Helper Functions ────────────────────────────────────────────

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

/**
 * Get fiscal year for a given date (Indian FY: April to March)
 */
export function getFiscalYear(date: Date): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  if (month >= 3) {
    // April onwards: FY starts
    return `${year}-${String(year + 1).slice(2)}`;
  }
  // Jan-Mar: previous FY
  return `${year - 1}-${String(year).slice(2)}`;
}

/**
 * PAN validation (Indian Permanent Account Number)
 */
export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

/**
 * Generate a deterministic color from a string (for avatars, charts)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 45%)`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string, maxChars: number = 2): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, maxChars)
    .join('')
    .toUpperCase();
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

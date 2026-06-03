// ════════════════════════════════════════════════════════════════
// Aurapex Next — Core Domain Types
// ════════════════════════════════════════════════════════════════

// ─── Enums ───────────────────────────────────────────────────────

export enum UserRole {
  INVESTOR = 'INVESTOR',
  ADVISOR = 'ADVISOR',
  FAMILY_ADMIN = 'FAMILY_ADMIN',
  CA = 'CHARTERED_ACCOUNTANT',
  ADMIN = 'ADMIN',
}

export enum KYCStatus {
  PENDING = 'PENDING',
  PAN_VERIFIED = 'PAN_VERIFIED',
  OTP_VERIFIED = 'OTP_VERIFIED',
  DIGILOCKER_LINKED = 'DIGILOCKER_LINKED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum AssetType {
  EQUITY = 'EQUITY',
  ETF = 'ETF',
  MUTUAL_FUND = 'MUTUAL_FUND',
  DEBT_FUND = 'DEBT_FUND',
  BOND = 'BOND',
  DEBENTURE = 'DEBENTURE',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  AIF = 'AIF',
  PMS = 'PMS',
  PRIVATE_EQUITY = 'PRIVATE_EQUITY',
  STRUCTURED_PRODUCT = 'STRUCTURED_PRODUCT',
  FUTURES = 'FUTURES',
  OPTIONS = 'OPTIONS',
  NPS = 'NPS',
  ULIP = 'ULIP',
  INSURANCE = 'INSURANCE',
  BANKING_DEPOSIT = 'BANKING_DEPOSIT',
  CASH = 'CASH',
  GOLD = 'GOLD',
  REAL_ESTATE = 'REAL_ESTATE',
}

export enum AssetCategory {
  EQUITY = 'EQUITY',
  DEBT = 'DEBT',
  GOLD = 'GOLD',
  CASH = 'CASH',
  ALTERNATIVES = 'ALTERNATIVES',
  REAL_ESTATE = 'REAL_ESTATE',
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  SIP = 'SIP',
  REDEMPTION = 'REDEMPTION',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  DIVIDEND = 'DIVIDEND',
  INTEREST = 'INTEREST',
  BONUS = 'BONUS',
  SPLIT = 'SPLIT',
  RIGHTS = 'RIGHTS',
  MERGER = 'MERGER',
  DEMERGER = 'DEMERGER',
}

export enum PortfolioType {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILY = 'FAMILY',
  GOAL = 'GOAL',
  CLIENT = 'CLIENT',
  MODEL = 'MODEL',
}

export enum ImportSourceType {
  PAN_AGGREGATION = 'PAN_AGGREGATION',
  BROKER_API = 'BROKER_API',
  PDF_UPLOAD = 'PDF_UPLOAD',
  CSV_UPLOAD = 'CSV_UPLOAD',
  EXCEL_UPLOAD = 'EXCEL_UPLOAD',
  CAS_STATEMENT = 'CAS_STATEMENT',
  CONTRACT_NOTE = 'CONTRACT_NOTE',
  MF_CENTRAL = 'MF_CENTRAL',
  CAMS = 'CAMS',
  KFINTECH = 'KFINTECH',
  NSDL = 'NSDL',
  CDSL = 'CDSL',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export enum ImportJobStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REQUIRES_REAUTH = 'REQUIRES_REAUTH',
}

export enum ConflictSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ConflictResolution {
  PENDING = 'PENDING',
  AUTO_RESOLVED = 'AUTO_RESOLVED',
  MANUALLY_RESOLVED = 'MANUALLY_RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum TaxType {
  STCG = 'STCG',
  LTCG = 'LTCG',
}

export enum ReportType {
  HOLDINGS = 'HOLDINGS',
  TRANSACTIONS = 'TRANSACTIONS',
  INCOME = 'INCOME',
  TAX_STCG_LTCG = 'TAX_STCG_LTCG',
  PERFORMANCE = 'PERFORMANCE',
  ITR_READY = 'ITR_READY',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export enum AIInsightType {
  CONCENTRATION_RISK = 'CONCENTRATION_RISK',
  ALLOCATION_DRIFT = 'ALLOCATION_DRIFT',
  FUND_OVERLAP = 'FUND_OVERLAP',
  UNDERPERFORMANCE = 'UNDERPERFORMANCE',
  IDLE_CASH = 'IDLE_CASH',
  TAX_EXPOSURE = 'TAX_EXPOSURE',
  DIVERSIFICATION = 'DIVERSIFICATION',
  BEHAVIORAL = 'BEHAVIORAL',
  SIP_INCONSISTENCY = 'SIP_INCONSISTENCY',
  REBALANCING = 'REBALANCING',
  TAX_OPTIMIZATION = 'TAX_OPTIMIZATION',
}

export enum MomentumScore {
  HIGH = 'HIGH',
  NEUTRAL = 'NEUTRAL',
  LOW = 'LOW',
}

// ─── Core Interfaces ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  kycStatus: KYCStatus;
  tenantId: string;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  type: PortfolioType;
  userId: string;
  tenantId: string;
  parentId?: string;
  description?: string;
  goalAmount?: number;
  goalDate?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  isin?: string;
  symbol?: string;
  name: string;
  assetType: AssetType;
  category: AssetCategory;
  exchange?: string;
  sector?: string;
  industry?: string;
  currency: string;
  lotSize: number;
  metadata: Record<string, unknown>;
}

export interface Holding {
  id: string;
  portfolioId: string;
  assetId: string;
  asset: Asset;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
  source: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  asset: Asset;
  type: TransactionType;
  quantity: number;
  price: number;
  amount: number;
  fees: number;
  stampDuty: number;
  stt: number;
  date: string;
  settlementDate?: string;
  notes?: string;
  importJobId?: string;
  createdAt: string;
}

export interface TaxLot {
  id: string;
  holdingId: string;
  holding: Holding;
  acquisitionDate: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  isGrandfathered: boolean;
  grandfatheredValue?: number;
  ciiYear?: string;
  indexedCost?: number;
  unrealizedGain: number;
  taxType: TaxType;
  holdingPeriodDays: number;
}

export interface ReconciliationConflict {
  id: string;
  holdingId: string;
  sourceA: string;
  sourceB: string;
  field: string;
  valueA: string;
  valueB: string;
  severity: ConflictSeverity;
  resolution: ConflictResolution;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ImportJob {
  id: string;
  sourceType: ImportSourceType;
  userId: string;
  status: ImportJobStatus;
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  failedRecords: number;
  errorLog?: string;
  startedAt: string;
  completedAt?: string;
}

// ─── Dashboard Types ─────────────────────────────────────────────

export interface DashboardSummary {
  netWorth: number;
  investedAmount: number;
  currentValue: number;
  todaysGain: number;
  todaysGainPercent: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  absoluteReturn: number;
  absoluteReturnPercent: number;
  xirr: number;
  cagr3Y: number;
  cashDragPercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  lastSyncAt: string;
}

export interface AssetAllocation {
  category: AssetCategory;
  label: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
  description: string;
}

export interface MarketUpdate {
  id: string;
  headline: string;
  summary: string;
  category: string;
  impactScore: number;
  publishedAt: string;
}

// ─── Analytics Types ─────────────────────────────────────────────

export interface PerformanceDataPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
}

export interface SectorAttribution {
  sector: string;
  icon: string;
  weightage: number;
  contribution: number;
  performance1Y: number;
  momentumScore: MomentumScore;
}

export interface PerformanceMetrics {
  xirr: number;
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  absoluteReturn: number;
  absoluteReturnValue: number;
  benchmarkXirr: number;
  alpha: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  volatility: number;
}

// ─── Tax Types ───────────────────────────────────────────────────

export interface TaxSummary {
  fiscalYear: string;
  stcg: number;
  ltcg: number;
  estimatedLiability: number;
  harvestingSavingsPotential: number;
  harvestingPositions: number;
  indexationBenefit: number;
  grandfatheredBenefit: number;
  section111A: number;
  section112: number;
  section112A: number;
}

export interface TaxOptimizationInsight {
  id: string;
  title: string;
  description: string;
  potentialSaving: number;
  tradeDetails: {
    assetName: string;
    quantity: number;
    action: 'BUY' | 'SELL';
    estimatedTaxImpact: number;
  }[];
  confidence: number;
  type: AIInsightType;
}

// ─── AI Types ────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  body: string;
  confidence: number;
  whyGenerated: string;
  dataTrigger: string;
  assumptionsUsed: string[];
  estimatedImpact: string;
  disclaimer: string;
  actionLabel?: string;
  actionUrl?: string;
  portfolioId: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    chartData?: ScenarioChartData;
    insight?: AIInsight;
    confidence?: string;
    assumptions?: string;
    estimatedImpact?: string;
  };
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  portfolioId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioVariable {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  suffix?: string;
}

export interface ScenarioResult {
  estimatedLoss: number;
  portfolioValueBefore: number;
  portfolioValueAfter: number;
  drawdownPercent: number;
  recoveryEstimate: string;
  historicalCorrelate: string;
  chartData: ScenarioChartData;
}

export interface ScenarioChartData {
  preCrash: number;
  marketDrop: number;
  portfolio: number;
  recoveryEstimate: number;
}

// ─── Advisor Types ───────────────────────────────────────────────

export interface AdvisorClient {
  id: string;
  advisorId: string;
  clientId: string;
  client: User;
  portfolioIds: string[];
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  onboardedAt: string;
}

export interface Recommendation {
  id: string;
  advisorId: string;
  clientId: string;
  portfolioId: string;
  type: 'REBALANCING' | 'ALLOCATION' | 'TAX_OPTIMIZATION' | 'DIVERSIFICATION';
  title: string;
  content: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

// ─── Report Types ────────────────────────────────────────────────

export interface Report {
  id: string;
  userId: string;
  portfolioId: string;
  type: ReportType;
  format: ReportFormat;
  status: 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  fileUrl?: string;
  generatedAt?: string;
  filters: Record<string, unknown>;
}

// ─── Notification Types ──────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'AI_INSIGHT';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── API Response Types ──────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

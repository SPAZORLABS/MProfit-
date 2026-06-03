// ════════════════════════════════════════════════════════════════
// Aurapex Next — Zod Validation Schemas
// ════════════════════════════════════════════════════════════════

import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────────────

export const panSchema = z.string()
  .length(10, 'PAN must be exactly 10 characters')
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format. Expected: ABCDE1234F');

export const otpSchema = z.string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only digits');

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Portfolio Schemas ───────────────────────────────────────────

export const createPortfolioSchema = z.object({
  name: z.string().min(1, 'Portfolio name is required').max(100),
  type: z.enum(['INDIVIDUAL', 'FAMILY', 'GOAL', 'CLIENT', 'MODEL']),
  description: z.string().max(500).optional(),
  goalAmount: z.number().positive().optional(),
  goalDate: z.string().optional(),
  parentId: z.string().uuid().optional(),
});

// ─── Transaction Schemas ─────────────────────────────────────────

export const addTransactionSchema = z.object({
  portfolioId: z.string().uuid(),
  assetId: z.string().uuid(),
  type: z.enum([
    'BUY', 'SELL', 'SIP', 'REDEMPTION', 'TRANSFER_IN', 'TRANSFER_OUT',
    'DIVIDEND', 'INTEREST', 'BONUS', 'SPLIT', 'RIGHTS', 'MERGER', 'DEMERGER',
  ]),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().nonnegative('Price cannot be negative'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date'),
  fees: z.number().nonnegative().default(0),
  stampDuty: z.number().nonnegative().default(0),
  stt: z.number().nonnegative().default(0),
  notes: z.string().max(500).optional(),
});

// ─── Report Schemas ──────────────────────────────────────────────

export const generateReportSchema = z.object({
  portfolioId: z.string().uuid(),
  type: z.enum(['HOLDINGS', 'TRANSACTIONS', 'INCOME', 'TAX_STCG_LTCG', 'PERFORMANCE', 'ITR_READY']),
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
});

// ─── AI Schemas ──────────────────────────────────────────────────

export const aiChatMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  portfolioId: z.string().uuid(),
  message: z.string().min(1).max(2000),
});

export const scenarioVariablesSchema = z.object({
  inflationShock: z.number().min(-10).max(20).default(0),
  interestRateHike: z.number().min(-500).max(500).default(0),
  sectorCollapse: z.number().min(-100).max(0).default(0),
  marketDropPercent: z.number().min(-50).max(0).default(0),
});

// ─── Import Schemas ──────────────────────────────────────────────

export const importUploadSchema = z.object({
  sourceType: z.enum([
    'PDF_UPLOAD', 'CSV_UPLOAD', 'EXCEL_UPLOAD', 'CAS_STATEMENT', 'CONTRACT_NOTE',
  ]),
  portfolioId: z.string().uuid(),
  file: z.any(), // File validation handled by multer
});

export const panAggregationSchema = z.object({
  pan: panSchema,
  sources: z.array(z.enum(['CAMS', 'KFINTECH', 'MF_CENTRAL', 'NSDL', 'CDSL'])),
  consent: z.boolean().refine(val => val === true, 'Consent is required'),
});

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InsightsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const groq_sdk_1 = require("groq-sdk");
let InsightsService = InsightsService_1 = class InsightsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InsightsService_1.name);
        this.groq = null;
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey) {
            this.groq = new groq_sdk_1.default({ apiKey });
        }
        else {
            this.logger.warn('GROQ_API_KEY not found. InsightsService will run in mock mode.');
        }
    }
    async generateInsightsForPortfolio(portfolioId) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: { holdings: { include: { asset: true } } }
        });
        if (!portfolio)
            throw new Error('Portfolio not found');
        let generatedInsights = [];
        if (this.groq) {
            try {
                const systemPrompt = `
You are Aurapex AI, a wealth intelligence system. Analyze the following portfolio holdings and generate actionable insights (e.g., concentration risk, tax harvesting).
Return a JSON object with an "insights" key containing an array of insights matching this schema:
{
  "insights": [
    {
      "type": "CONCENTRATION_RISK" | "TAX_OPTIMIZATION" | "MARKET_OPPORTUNITY",
      "title": "string",
      "body": "string",
      "confidence": number (0 to 1),
      "whyGenerated": "string",
      "dataTrigger": "stringified json object",
      "disclaimer": "string",
      "actionLabel": "string"
    }
  ]
}

Portfolio Data:
${JSON.stringify(portfolio.holdings.map(h => ({ name: h.asset.name, qty: h.quantity, cost: h.averageCost, category: h.asset.category })), null, 2)}
`;
                const completion = await this.groq.chat.completions.create({
                    model: 'llama3-70b-8192',
                    messages: [{ role: 'system', content: systemPrompt }],
                    response_format: { type: 'json_object' }
                });
                const rawContent = completion.choices[0]?.message?.content;
                const parsed = JSON.parse(rawContent || '{"insights":[]}');
                generatedInsights = parsed.insights || [];
            }
            catch (error) {
                this.logger.error(`Failed to generate LLM insights: ${error.message}`);
                generatedInsights = this.getMockInsights(portfolioId);
            }
        }
        else {
            generatedInsights = this.getMockInsights(portfolioId);
        }
        const createdInsights = await Promise.all(generatedInsights.map((insight) => this.prisma.aIInsight.create({
            data: {
                portfolioId,
                type: insight.type || client_1.AIInsightType.CONCENTRATION_RISK,
                title: insight.title,
                body: insight.body,
                confidence: insight.confidence,
                whyGenerated: insight.whyGenerated,
                dataTrigger: typeof insight.dataTrigger === 'string' ? insight.dataTrigger : JSON.stringify(insight.dataTrigger),
                disclaimer: insight.disclaimer || 'This is an AI-generated insight.',
                actionLabel: insight.actionLabel,
            }
        })));
        return createdInsights;
    }
    getMockInsights(portfolioId) {
        return [
            {
                portfolioId,
                type: client_1.AIInsightType.CONCENTRATION_RISK,
                title: 'High Exposure to Financials',
                body: 'Your portfolio has a 42% exposure to the Financial sector. Consider diversifying into IT or Pharma to reduce sector-specific risk.',
                confidence: 0.92,
                whyGenerated: 'Sector allocation exceeded 40% threshold.',
                dataTrigger: '{"sector": "Financials", "allocation": 42.1}',
                disclaimer: 'This is an AI-generated insight based on your current holdings.',
                actionLabel: 'Explore Diversification',
            },
            {
                portfolioId,
                type: client_1.AIInsightType.TAX_OPTIMIZATION,
                title: 'Tax Harvesting Opportunity',
                body: 'You have unrealized short-term losses of ₹45,000 in HDFC Bank. Selling now could offset your recent STCG.',
                confidence: 0.88,
                whyGenerated: 'Identified loss-making asset with offsetting STCG in the current financial year.',
                dataTrigger: '{"asset": "HDFC Bank", "unrealizedLoss": 45000}',
                disclaimer: 'Tax laws are subject to change. Consult a tax advisor before acting.',
                actionLabel: 'View Tax Lots',
            }
        ];
    }
    async getActiveInsights(portfolioId) {
        return this.prisma.aIInsight.findMany({
            where: {
                portfolioId,
                isDismissed: false,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { confidence: 'desc' },
            take: 5
        });
    }
    async dismissInsight(insightId) {
        return this.prisma.aIInsight.update({
            where: { id: insightId },
            data: { isDismissed: true }
        });
    }
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = InsightsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsightsService);
//# sourceMappingURL=insights.service.js.map
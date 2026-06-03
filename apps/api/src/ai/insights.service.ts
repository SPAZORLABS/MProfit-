import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIInsightType } from '@prisma/client';
import Groq from 'groq-sdk';

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);
  private groq: Groq | null = null;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.groq = new Groq({ apiKey });
    } else {
      this.logger.warn('GROQ_API_KEY not found. InsightsService will run in mock mode.');
    }
  }

  async generateInsightsForPortfolio(portfolioId: string) {
    // 1. Fetch live portfolio context
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { holdings: { include: { asset: true } } }
    });

    if (!portfolio) throw new Error('Portfolio not found');

    let generatedInsights = [];

    // 2. Query LLM if API Key exists
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

      } catch (error: any) {
        this.logger.error(`Failed to generate LLM insights: ${error.message}`);
        generatedInsights = this.getMockInsights(portfolioId);
      }
    } else {
      // 3. Fallback mock insights
      generatedInsights = this.getMockInsights(portfolioId);
    }

    // 4. Save to database
    const createdInsights = await Promise.all(
      generatedInsights.map((insight: any) =>
        this.prisma.aIInsight.create({
          data: {
            portfolioId,
            type: insight.type || AIInsightType.CONCENTRATION_RISK,
            title: insight.title,
            body: insight.body,
            confidence: insight.confidence,
            whyGenerated: insight.whyGenerated,
            dataTrigger: typeof insight.dataTrigger === 'string' ? insight.dataTrigger : JSON.stringify(insight.dataTrigger),
            disclaimer: insight.disclaimer || 'This is an AI-generated insight.',
            actionLabel: insight.actionLabel,
          }
        })
      )
    );

    return createdInsights;
  }

  private getMockInsights(portfolioId: string) {
    return [
      {
        portfolioId,
        type: AIInsightType.CONCENTRATION_RISK,
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
        type: AIInsightType.TAX_OPTIMIZATION,
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

  async getActiveInsights(portfolioId: string) {
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

  async dismissInsight(insightId: string) {
    return this.prisma.aIInsight.update({
      where: { id: insightId },
      data: { isDismissed: true }
    });
  }
}

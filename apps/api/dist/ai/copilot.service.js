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
var CopilotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopilotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const groq_sdk_1 = require("groq-sdk");
let CopilotService = CopilotService_1 = class CopilotService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CopilotService_1.name);
        this.groq = null;
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey) {
            this.groq = new groq_sdk_1.default({ apiKey });
        }
        else {
            this.logger.warn('GROQ_API_KEY not found. Copilot will run in mock mode.');
        }
    }
    async startConversation(userId, portfolioId) {
        return this.prisma.aIConversation.create({
            data: {
                userId,
                portfolioId,
                title: 'New Chat',
            }
        });
    }
    async sendMessage(conversationId, content, userId) {
        const conversation = await this.prisma.aIConversation.findFirst({
            where: { id: conversationId, userId }
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        await this.prisma.aIMessage.create({
            data: {
                conversationId,
                role: 'user',
                content,
            }
        });
        let responseContent = "I'm currently running in offline mock mode. Please configure OPENAI_API_KEY in the backend to access live intelligence.";
        let metadata = {};
        if (this.groq) {
            try {
                const portfolio = await this.prisma.portfolio.findUnique({
                    where: { id: conversation.portfolioId },
                    include: { holdings: { include: { asset: true } } }
                });
                const history = await this.prisma.aIMessage.findMany({
                    where: { conversationId },
                    orderBy: { createdAt: 'asc' },
                    take: 10
                });
                const messages = [
                    {
                        role: 'system', content: `You are Aurapex AI Copilot, a professional wealth management advisor. The user has a portfolio with the following holdings: \n\n${JSON.stringify(portfolio?.holdings.map(h => ({ name: h.asset.name, quantity: h.quantity, averageCost: h.averageCost })), null, 2)}\n\nProvide concise, professional, and actionable advice. Never suggest executable actions or guarantee returns. You MUST output a JSON object matching this schema exactly:
{
  "type": "copilot",
  "text": "Your conversational response",
  "why_generated": "Reason narrative",
  "data_trigger": ["holding_id:..."],
  "confidence_level": "high",
  "assumptions_used": ["assumption A"],
  "estimated_impact": "None",
  "advisory_disclaimer": "Not financial advice."
}`
                    },
                    ...history.map(m => ({ role: m.role, content: m.content }))
                ];
                const completion = await this.groq.chat.completions.create({
                    model: 'llama3-70b-8192',
                    messages,
                    response_format: { type: 'json_object' }
                });
                const rawContent = completion.choices[0]?.message?.content;
                const parsed = JSON.parse(rawContent || '{}');
                responseContent = parsed.text || "I'm sorry, I couldn't generate a proper response.";
                metadata = parsed;
            }
            catch (error) {
                this.logger.error(`Groq error: ${error.message}`);
                responseContent = "I'm sorry, I encountered an error connecting to the AI brain.";
            }
        }
        else {
            if (content.toLowerCase().includes('allocate') || content.toLowerCase().includes('equity')) {
                responseContent = "Based on your portfolio's current asset allocation, your equity exposure is slightly above your target of 70%. I recommend reviewing your recent SIPs or considering rebalancing your large-cap holdings.";
            }
            else {
                responseContent = "This is a mocked AI response. In production, this would provide deep context-aware insights regarding your Aurapex portfolio.";
            }
        }
        const aiMessage = await this.prisma.aIMessage.create({
            data: {
                conversationId,
                role: 'assistant',
                content: responseContent,
                metadata: typeof metadata !== 'undefined' ? metadata : {},
            }
        });
        const messageCount = await this.prisma.aIMessage.count({
            where: { conversationId }
        });
        if (messageCount <= 2) {
            await this.prisma.aIConversation.update({
                where: { id: conversationId },
                data: { title: content.substring(0, 30) + '...' }
            });
        }
        return aiMessage;
    }
    async getConversationHistory(conversationId, userId) {
        const conversation = await this.prisma.aIConversation.findFirst({
            where: { id: conversationId, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return conversation;
    }
};
exports.CopilotService = CopilotService;
exports.CopilotService = CopilotService = CopilotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CopilotService);
//# sourceMappingURL=copilot.service.js.map
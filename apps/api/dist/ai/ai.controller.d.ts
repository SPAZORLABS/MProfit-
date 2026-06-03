import { InsightsService } from './insights.service';
import { CopilotService } from './copilot.service';
import { ScenarioService } from './scenario.service';
export declare class AiController {
    private readonly insightsService;
    private readonly copilotService;
    private readonly scenarioService;
    constructor(insightsService: InsightsService, copilotService: CopilotService, scenarioService: ScenarioService);
    getActiveInsights(portfolioId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AIInsightType;
        expiresAt: Date | null;
        portfolioId: string;
        title: string;
        body: string;
        confidence: import("@prisma/client/runtime/library").Decimal;
        whyGenerated: string;
        dataTrigger: string;
        assumptionsUsed: import("@prisma/client/runtime/library").JsonValue;
        estimatedImpact: string | null;
        disclaimer: string;
        actionLabel: string | null;
        actionUrl: string | null;
        isRead: boolean;
        isDismissed: boolean;
    }[]>;
    dismissInsight(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AIInsightType;
        expiresAt: Date | null;
        portfolioId: string;
        title: string;
        body: string;
        confidence: import("@prisma/client/runtime/library").Decimal;
        whyGenerated: string;
        dataTrigger: string;
        assumptionsUsed: import("@prisma/client/runtime/library").JsonValue;
        estimatedImpact: string | null;
        disclaimer: string;
        actionLabel: string | null;
        actionUrl: string | null;
        isRead: boolean;
        isDismissed: boolean;
    }>;
    generateInsights(portfolioId: string): Promise<any[]>;
    startConversation(req: any, portfolioId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        portfolioId: string;
        title: string | null;
    }>;
    sendMessage(req: any, id: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        role: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        content: string;
        tokenCount: number | null;
        conversationId: string;
    }>;
    getConversation(req: any, id: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            role: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            content: string;
            tokenCount: number | null;
            conversationId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        portfolioId: string;
        title: string | null;
    }>;
    runScenario(req: any, conversationId: string, parameters: any): Promise<{
        result: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        conversationId: string;
        variables: import("@prisma/client/runtime/library").JsonValue;
        chartData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}

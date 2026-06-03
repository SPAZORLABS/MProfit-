import { PrismaService } from '../prisma/prisma.service';
export declare class CopilotService {
    private prisma;
    private readonly logger;
    private groq;
    constructor(prisma: PrismaService);
    startConversation(userId: string, portfolioId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        portfolioId: string;
        title: string | null;
    }>;
    sendMessage(conversationId: string, content: string, userId: string): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        content: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        tokenCount: number | null;
        conversationId: string;
    }>;
    getConversationHistory(conversationId: string, userId: string): Promise<{
        messages: {
            id: string;
            role: string;
            createdAt: Date;
            content: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
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
}

import { ReportService } from './report.service';
import { ReportType, ReportFormat } from '@prisma/client';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    generateReport(req: any, body: {
        type: ReportType;
        format: ReportFormat;
        filters: any;
    }): Promise<{
        reportId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        message: string;
    }>;
    listReports(req: any): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        userId: string;
        expiresAt: Date | null;
        portfolioId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileName: string | null;
        fileUrl: string | null;
        fileSize: number | null;
        format: import(".prisma/client").$Enums.ReportFormat;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
    }[]>;
    getReportStatus(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        userId: string;
        expiresAt: Date | null;
        portfolioId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileName: string | null;
        fileUrl: string | null;
        fileSize: number | null;
        format: import(".prisma/client").$Enums.ReportFormat;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
    }>;
}

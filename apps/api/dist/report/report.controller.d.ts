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
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
        portfolioId: string;
    }[]>;
    getReportStatus(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        userId: string;
        expiresAt: Date | null;
        format: import(".prisma/client").$Enums.ReportFormat;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileUrl: string | null;
        fileName: string | null;
        fileSize: number | null;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
        portfolioId: string;
    }>;
}

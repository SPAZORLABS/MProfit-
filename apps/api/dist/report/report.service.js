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
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportService = ReportService_1 = class ReportService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ReportService_1.name);
    }
    async generateReport(userId, type, format, filters) {
        const portfolioId = filters.portfolioId;
        if (portfolioId) {
            const portfolio = await this.prisma.portfolio.findFirst({
                where: { id: portfolioId, userId }
            });
            if (!portfolio) {
                throw new common_1.NotFoundException('Portfolio not found');
            }
        }
        const report = await this.prisma.report.create({
            data: {
                userId,
                portfolioId: portfolioId || "",
                type,
                format,
                status: client_1.ReportStatus.QUEUED,
                filters: filters,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        });
        this.mockAsyncGeneration(report.id);
        return {
            reportId: report.id,
            status: report.status,
            message: 'Report generation started. Check back shortly.',
        };
    }
    async getReportStatus(reportId, userId) {
        const report = await this.prisma.report.findFirst({
            where: { id: reportId, userId }
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async listUserReports(userId) {
        return this.prisma.report.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
    async mockAsyncGeneration(reportId) {
        setTimeout(async () => {
            try {
                await this.prisma.report.update({
                    where: { id: reportId },
                    data: {
                        status: client_1.ReportStatus.COMPLETED,
                        fileUrl: `https://Aurapex-mock-storage.s3.amazonaws.com/reports/${reportId}.pdf`,
                        generatedAt: new Date(),
                    }
                });
                this.logger.log(`Mock report generation completed for ${reportId}`);
            }
            catch (e) {
                this.logger.error(`Mock generation failed for ${reportId}`, e);
            }
        }, 3000);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map
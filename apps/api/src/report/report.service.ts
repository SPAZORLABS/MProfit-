import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType, ReportStatus, ReportFormat } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private prisma: PrismaService) { }

  async generateReport(
    userId: string,
    type: ReportType,
    format: ReportFormat,
    filters: any,
  ) {
    // Determine portfolio scope
    const portfolioId = filters.portfolioId;

    if (portfolioId) {
      const portfolio = await this.prisma.portfolio.findFirst({
        where: { id: portfolioId, userId }
      });
      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }
    }

    // 1. Create a job for report generation
    const report = await this.prisma.report.create({
      data: {
        userId,
        portfolioId: portfolioId || "", // mock fallback
        type,
        format,
        status: ReportStatus.QUEUED,
        filters: filters,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    // 2. Mocking async generation
    // In production this would be sent to a BullMQ worker
    this.mockAsyncGeneration(report.id);

    return {
      reportId: report.id,
      status: report.status,
      message: 'Report generation started. Check back shortly.',
    };
  }

  async getReportStatus(reportId: string, userId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, userId }
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async listUserReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  // Helper to mock background processing
  private async mockAsyncGeneration(reportId: string) {
    setTimeout(async () => {
      try {
        await this.prisma.report.update({
          where: { id: reportId },
          data: {
            status: ReportStatus.COMPLETED,
            fileUrl: `https://Aurapex-mock-storage.s3.amazonaws.com/reports/${reportId}.pdf`,
            generatedAt: new Date(),
          }
        });
        this.logger.log(`Mock report generation completed for ${reportId}`);
      } catch (e) {
        this.logger.error(`Mock generation failed for ${reportId}`, e);
      }
    }, 3000); // 3 seconds fake delay
  }
}

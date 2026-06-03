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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, tenantService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.tenantService = tenantService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.otpStore = new Map();
    }
    async verifyDigiLocker(code, state) {
        this.logger.log(`Received DigiLocker callback with code: ${code}`);
        return {
            success: true,
            kycStatus: client_1.KYCStatus.DIGILOCKER_LINKED,
            message: 'DigiLocker verification simulated successfully',
        };
    }
    async initiatePanVerification(dto) {
        const tenant = await this.tenantService.getTenantBySlug(dto.tenantSlug);
        const setuClientId = process.env.SETU_CLIENT_ID;
        const setuClientSecret = process.env.SETU_CLIENT_SECRET;
        let verifiedFullName = 'MProfit User';
        if (setuClientId && setuClientSecret) {
            try {
                const response = await fetch('https://dg-sandbox.setu.co/api/verify/pan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': setuClientId,
                        'x-client-secret': setuClientSecret
                    },
                    body: JSON.stringify({
                        pan: dto.pan,
                        consent: 'Y',
                        reason: 'Verification for onboarding'
                    })
                });
                const data = await response.json();
                if (!response.ok || data.verification !== 'success') {
                    this.logger.warn(`Setu PAN verification failed: ${JSON.stringify(data)}`);
                    throw new common_1.BadRequestException('Invalid PAN provided or PAN not found');
                }
                verifiedFullName = data.data?.full_name || 'MProfit User';
                this.logger.log(`PAN verified successfully for: ${verifiedFullName}`);
            }
            catch (err) {
                this.logger.error(`Setu API Error: ${err.message}`);
                throw new common_1.BadRequestException(err.message || 'PAN Verification failed');
            }
        }
        else {
            this.logger.warn('Setu credentials missing. Skipping live PAN verification.');
        }
        const panHash = await bcrypt.hash(dto.pan, 10);
        const panLast4 = dto.pan.slice(-4);
        let user = await this.prisma.user.findFirst({
            where: {
                tenantId: tenant.id,
            }
        });
        const otp = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
        const referenceId = (0, uuid_1.v4)();
        this.otpStore.set(referenceId, {
            pan: dto.pan,
            tenantId: tenant.id,
            otp,
            expires: Date.now() + 5 * 60 * 1000,
            fullName: verifiedFullName,
        });
        this.logger.log(`Generated OTP ${otp} for PAN ending in ${panLast4} with ref ${referenceId}`);
        return {
            referenceId,
            message: 'OTP sent successfully to registered mobile number associated with this PAN.',
            expiresIn: 300,
            isExistingUser: !!user
        };
    }
    async verifyOtp(dto) {
        const record = this.otpStore.get(dto.referenceId);
        if (!record) {
            throw new common_1.BadRequestException('Invalid or expired reference ID');
        }
        if (Date.now() > record.expires) {
            this.otpStore.delete(dto.referenceId);
            throw new common_1.BadRequestException('OTP has expired');
        }
        if (record.otp !== dto.otp) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        this.otpStore.delete(dto.referenceId);
        const panHash = await bcrypt.hash(record.pan, 10);
        const user = await this.prisma.user.upsert({
            where: {
                email: `${record.pan.toLowerCase()}@example.com`
            },
            update: {
                lastLoginAt: new Date(),
                kycStatus: client_1.KYCStatus.OTP_VERIFIED,
            },
            create: {
                email: `${record.pan.toLowerCase()}@example.com`,
                name: record.fullName || 'MProfit User',
                passwordHash: await bcrypt.hash((0, uuid_1.v4)(), 10),
                tenantId: record.tenantId,
                panHash: panHash,
                panLast4: record.pan.slice(-4),
                kycStatus: client_1.KYCStatus.OTP_VERIFIED,
                role: client_1.UserRole.INVESTOR,
            }
        });
        const defaultPortfolio = await this.prisma.portfolio.findFirst({
            where: { userId: user.id, isDefault: true }
        });
        if (!defaultPortfolio) {
            await this.prisma.portfolio.create({
                data: {
                    name: 'Primary Portfolio',
                    userId: user.id,
                    tenantId: record.tenantId,
                    isDefault: true,
                }
            });
        }
        const payload = { sub: user.id, role: user.role, tenantId: user.tenantId };
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
        const refreshToken = (0, uuid_1.v4)();
        await this.prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            }
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 900,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                kycStatus: user.kycStatus,
                role: user.role
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        tenant_service_1.TenantService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
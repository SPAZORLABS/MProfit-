import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private tenantService;
    private readonly logger;
    private otpStore;
    constructor(prisma: PrismaService, jwtService: JwtService, tenantService: TenantService);
    verifyDigiLocker(code: string, state: string): Promise<{
        success: boolean;
        kycStatus: "DIGILOCKER_LINKED";
        message: string;
    }>;
    initiatePanVerification(dto: PanVerificationDto): Promise<{
        referenceId: string;
        message: string;
        expiresIn: number;
        isExistingUser: boolean;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            name: string;
            email: string;
            kycStatus: import(".prisma/client").$Enums.KYCStatus;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    getProfile(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        kycStatus: import(".prisma/client").$Enums.KYCStatus;
        panLast4: string | null;
    }>;
}

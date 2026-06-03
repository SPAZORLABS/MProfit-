import { AuthService } from './auth.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
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

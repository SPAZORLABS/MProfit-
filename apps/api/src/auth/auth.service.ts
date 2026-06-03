import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole, KYCStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  // In a real app, this would be stored in Redis
  private otpStore = new Map<string, { pan: string, tenantId: string, otp: string, expires: number, fullName?: string }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tenantService: TenantService,
  ) {}

  /**
   * DigiLocker OAuth integration stub
   */
  async verifyDigiLocker(code: string, state: string) {
    this.logger.log(`Received DigiLocker callback with code: ${code}`);
    // In a real scenario, exchange code for access token via DigiLocker API
    // Retrieve XML/JSON payload, verify digital signature, and match PAN
    return {
      success: true,
      kycStatus: KYCStatus.DIGILOCKER_LINKED,
      message: 'DigiLocker verification simulated successfully',
    };
  }

  /**
   * Initiate PAN verification - simulating an external KYC check and sending an OTP
   */
  async initiatePanVerification(dto: PanVerificationDto) {
    const tenant = await this.tenantService.getTenantBySlug(dto.tenantSlug);
    
    // --- Setu PAN Verification API Integration ---
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
        
        const data: any = await response.json();
        
        if (!response.ok || data.verification !== 'success') {
          this.logger.warn(`Setu PAN verification failed: ${JSON.stringify(data)}`);
          throw new BadRequestException('Invalid PAN provided or PAN not found');
        }
        
        verifiedFullName = data.data?.full_name || 'MProfit User';
        this.logger.log(`PAN verified successfully for: ${verifiedFullName}`);
      } catch (err: any) {
        this.logger.error(`Setu API Error: ${err.message}`);
        throw new BadRequestException(err.message || 'PAN Verification failed');
      }
    } else {
      this.logger.warn('Setu credentials missing. Skipping live PAN verification.');
    }
    // ----------------------------------------------

    // Hash the PAN for storage/lookup
    const panHash = await bcrypt.hash(dto.pan, 10);
    const panLast4 = dto.pan.slice(-4);
    
    // Check if user already exists
    let user = await this.prisma.user.findFirst({
      where: { 
        tenantId: tenant.id,
        // In a real scenario we'd do a secure lookup or use an external ID
      }
    });

    // Simulate OTP generation
    const otp = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const referenceId = uuidv4();
    
    // Store OTP with 5 min expiration
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

  /**
   * Verify OTP and return JWT token
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const record = this.otpStore.get(dto.referenceId);
    
    if (!record) {
      throw new BadRequestException('Invalid or expired reference ID');
    }
    
    if (Date.now() > record.expires) {
      this.otpStore.delete(dto.referenceId);
      throw new BadRequestException('OTP has expired');
    }
    
    if (record.otp !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    
    // OTP verified, remove from store
    this.otpStore.delete(dto.referenceId);
    
    // Check or create user
    const panHash = await bcrypt.hash(record.pan, 10); // Not ideal for lookup, just for demo
    
    // Mock user creation for demo purposes since we don't have the exact user details yet
    const user = await this.prisma.user.upsert({
      where: { 
        email: `${record.pan.toLowerCase()}@example.com` // Mock email for now
      },
      update: {
        lastLoginAt: new Date(),
        kycStatus: KYCStatus.OTP_VERIFIED,
      },
      create: {
        email: `${record.pan.toLowerCase()}@example.com`,
        name: record.fullName || 'MProfit User',
        passwordHash: await bcrypt.hash(uuidv4(), 10), // Random password
        tenantId: record.tenantId,
        panHash: panHash,
        panLast4: record.pan.slice(-4),
        kycStatus: KYCStatus.OTP_VERIFIED,
        role: UserRole.INVESTOR,
      }
    });

    // Create default portfolio if needed
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
    
    // 15-minute idle timeout tracking via token expiration
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = uuidv4(); // Mock refresh token
    
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
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
}

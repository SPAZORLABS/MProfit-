import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('pan/verify')
  @HttpCode(HttpStatus.OK)
  async initiatePanVerification(@Body() dto: PanVerificationDto) {
    return this.authService.initiatePanVerification(dto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }
}

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import type { User } from '../db/schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow - Passport handles the redirect
    // No logic needed here
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(
    @Req() req: Request & { user?: User },
    @Res() res: Response,
  ) {
    try {
      const user = req.user;

      if (!user) {
        this.logger.error('No user found in Google OAuth callback');
        const frontendUrl =
          this.configService.get<string>('FRONTEND_URL') ||
          'http://localhost:5173';
        return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      }

      const accessToken = this.authService.generateJwtToken(user);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:5173';

      this.logger.log(
        `Google OAuth successful for user: ${user.email} (${user.id})`,
      );

      return res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
    } catch (error) {
      this.logger.error('Google OAuth callback error', error);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:5173';
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}

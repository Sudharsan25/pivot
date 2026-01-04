import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { GoogleUserDto } from '../dto/google-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientId = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientId || !clientSecret || !callbackURL) {
      throw new Error(
        'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL must be defined in environment variables!',
      );
    }

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      emails?: Array<{ value: string; verified?: boolean }>;
      displayName?: string;
      photos?: Array<{ value: string }>;
    },
    done: VerifyCallback,
  ): Promise<void> {
    try {
      this.logger.log(`Google OAuth validation for profile ID: ${profile.id}`);

      if (!profile.emails || profile.emails.length === 0) {
        this.logger.error('No email found in Google profile');
        return done(
          new UnauthorizedException('No email found in Google profile'),
          undefined,
        );
      }

      const email = profile.emails[0].value;
      const name = profile.displayName || email;
      const profilePicture = profile.photos?.[0]?.value || null;

      const googleUser: GoogleUserDto = {
        googleId: profile.id,
        email,
        name,
        profilePicture,
      };

      const user = await this.authService.validateGoogleUser(googleUser);
      return done(null, user);
    } catch (error) {
      this.logger.error('Google OAuth validation failed', error);
      return done(
        error instanceof Error
          ? error
          : new UnauthorizedException('Authentication failed'),
        undefined,
      );
    }
  }
}

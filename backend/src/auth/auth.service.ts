import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { users, User } from '../db/schema';
import { JwtPayload } from './jwt.strategy';
import { GoogleUserDto } from './dto/google-user.dto';

// Safe user type without sensitive data
export type SafeUser = Omit<User, 'passwordHash' | 'googleId'>;

// Auth response with user data
export interface AuthResponseWithUser {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Remove sensitive data from user object
   */
  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, googleId, ...safeUser } = user;
    return safeUser;
  }

  async register(
    email: string,
    password: string,
  ): Promise<AuthResponseWithUser> {
    try {
      const existingUser = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new ConflictException('Email already registered');
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const [newUser] = await this.dbService.db
        .insert(users)
        .values({
          email,
          passwordHash,
        })
        .returning();

      const accessToken = this.generateJwtToken(newUser);

      this.logger.log(`User registered: ${email} (${newUser.id})`);
      this.logger.debug(`Generated token for user ${newUser.id}`);

      return { accessToken, user: this.toSafeUser(newUser) };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Registration failed', error);
      throw new Error('Registration failed');
    }
  }

  async login(email: string, password: string): Promise<AuthResponseWithUser> {
    try {
      const [user] = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        this.logger.warn(`Login attempt with non-existent email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.passwordHash) {
        this.logger.warn(`Login attempt for user without password: ${email}`);
        throw new UnauthorizedException(
          'Invalid credentials. Please sign in with Google.',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = this.generateJwtToken(user);

      this.logger.log(`User logged in: ${email} (${user.id})`);
      this.logger.debug(`Token generated for user ${user.id}`);

      return { accessToken, user: this.toSafeUser(user) };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Login failed', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  generateJwtToken(user: User): string {
    const payload: JwtPayload = { userId: user.id };
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(googleUser: GoogleUserDto): Promise<User> {
    try {
      // First, check if user exists by googleId
      const [userByGoogleId] = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.googleId, googleUser.googleId))
        .limit(1);

      if (userByGoogleId) {
        // User exists with this Google ID - return existing user
        this.logger.log(
          `Google OAuth login for existing user: ${userByGoogleId.email} (${userByGoogleId.id})`,
        );
        return userByGoogleId;
      }

      // Check if user exists by email
      const [userByEmail] = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1);

      if (userByEmail) {
        // User exists with this email - link Google account
        const [updatedUser] = await this.dbService.db
          .update(users)
          .set({
            googleId: googleUser.googleId,
            name: googleUser.name,
            profilePicture: googleUser.profilePicture,
            authProvider: 'google',
            updatedAt: new Date(),
          })
          .where(eq(users.id, userByEmail.id))
          .returning();

        this.logger.log(
          `Linked Google account to existing user: ${googleUser.email} (${userByEmail.id})`,
        );

        return updatedUser;
      }

      // User doesn't exist - create new user with Google data
      const [newUser] = await this.dbService.db
        .insert(users)
        .values({
          email: googleUser.email,
          googleId: googleUser.googleId,
          name: googleUser.name,
          profilePicture: googleUser.profilePicture,
          authProvider: 'google',
          passwordHash: null,
        })
        .returning();

      this.logger.log(
        `Created new user with Google OAuth: ${googleUser.email} (${newUser.id})`,
      );

      return newUser;
    } catch (error) {
      this.logger.error('Google user validation failed', error);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    try {
      const [user] = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw new Error('Failed to validate user', error);
    }
  }
}

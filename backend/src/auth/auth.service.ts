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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
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

      const payload: JwtPayload = { userId: newUser.id };
      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`User registered: ${email} (${newUser.id})`);
      this.logger.debug(`Generated token for user ${newUser.id}`);

      return { accessToken };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Registration failed', error);
      throw new Error('Registration failed');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
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

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = { userId: user.id };
      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`User logged in: ${email} (${user.id})`);
      this.logger.debug(`Token payload: ${JSON.stringify(payload)}`);

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Login failed', error);
      throw new UnauthorizedException('Invalid credentials');
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

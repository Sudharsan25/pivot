import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { users, User } from '../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';

// User response type without sensitive data
export type SafeUser = Omit<User, 'passwordHash' | 'googleId'>;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly dbService: DbService) {}

  /**
   * Find a user by ID and return without sensitive data
   */
  async findById(userId: string): Promise<SafeUser> {
    const [user] = await this.dbService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
        authProvider: users.authProvider,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<SafeUser> {
    // Verify user exists
    await this.findById(userId);

    // Update user
    const [updatedUser] = await this.dbService.db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
        authProvider: users.authProvider,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    this.logger.log(`User profile updated: ${userId}`);

    return updatedUser;
  }
}

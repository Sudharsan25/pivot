import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq, and, or, isNull, asc } from 'drizzle-orm';
import { DbService } from '../db/db.service';
import { habits, Habit, NewHabit } from '../db/schema';
import { HabitType } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  private readonly logger = new Logger(HabitsService.name);

  constructor(private readonly dbService: DbService) {}

  /**
   * Create a new habit
   */
  async createHabit(
    userId: string | null,
    name: string,
    type: HabitType,
  ): Promise<Habit> {
    try {
      // Check if habit already exists (for custom habits, check by user; for standard, check globally)
      const existingHabit = await this.dbService.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.name, name),
            type === HabitType.STANDARD
              ? and(eq(habits.type, HabitType.STANDARD), isNull(habits.userId))
              : and(
                  eq(habits.type, HabitType.CUSTOM),
                  userId ? eq(habits.userId, userId) : isNull(habits.userId),
                ),
          ),
        )
        .limit(1);

      if (existingHabit.length > 0) {
        return existingHabit[0];
      }

      const [newHabit] = await this.dbService.db
        .insert(habits)
        .values({
          name,
          type,
          userId: type === HabitType.STANDARD ? null : userId || null,
        } as NewHabit)
        .returning();

      this.logger.log(`Habit created: ${name} (${type})`);
      return newHabit;
    } catch (error) {
      this.logger.error('Failed to create habit', error);
      throw new Error('Failed to create habit');
    }
  }

  /**
   * Get all habits available to a user (standard + user's custom habits)
   */
  async getUserHabits(userId: string): Promise<Habit[]> {
    try {
      const userHabits = await this.dbService.db
        .select()
        .from(habits)
        .where(
          or(
            and(eq(habits.type, HabitType.STANDARD), isNull(habits.userId)),
            and(eq(habits.type, HabitType.CUSTOM), eq(habits.userId, userId)),
          ),
        )
        .orderBy(asc(habits.type), asc(habits.name));

      return userHabits;
    } catch (error) {
      this.logger.error('Failed to get user habits', error);
      throw new Error('Failed to retrieve habits');
    }
  }

  /**
   * Get a habit by ID
   */
  async getHabitById(habitId: string): Promise<Habit> {
    try {
      const [habit] = await this.dbService.db
        .select()
        .from(habits)
        .where(eq(habits.id, habitId))
        .limit(1);

      if (!habit) {
        throw new NotFoundException('Habit not found');
      }

      return habit;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to get habit', error);
      throw new Error('Failed to retrieve habit');
    }
  }

  /**
   * Find or create a habit by name
   * Used when user selects "Custom" and enters a new habit name
   */
  async findOrCreateHabit(
    userId: string,
    name: string,
    type: HabitType = HabitType.CUSTOM,
  ): Promise<Habit> {
    try {
      // First, try to find existing custom habit for this user
      const existing = await this.dbService.db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.name, name),
            eq(habits.type, HabitType.CUSTOM),
            eq(habits.userId, userId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return existing[0];
      }

      // Create new custom habit
      return await this.createHabit(userId, name, type);
    } catch (error) {
      this.logger.error('Failed to find or create habit', error);
      throw new Error('Failed to find or create habit');
    }
  }

  /**
   * Initialize standard habits if they don't exist
   */
  async initializeStandardHabits(): Promise<void> {
    const standardHabitNames = [
      'Junk Food',
      'Alcohol',
      'Social Media',
      'Smoking',
      'Procrastination',
      'Gaming',
    ];

    try {
      for (const name of standardHabitNames) {
        const existing = await this.dbService.db
          .select()
          .from(habits)
          .where(
            and(
              eq(habits.name, name),
              eq(habits.type, HabitType.STANDARD),
              isNull(habits.userId),
            ),
          )
          .limit(1);

        if (existing.length === 0) {
          await this.createHabit(null, name, HabitType.STANDARD);
        }
      }
    } catch (error) {
      this.logger.error('Failed to initialize standard habits', error);
    }
  }
}

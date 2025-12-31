import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

// Enum for urge outcome
export const urgeOutcomeEnum = pgEnum('urge_outcome', [
  'resisted',
  'gave_in',
  'delayed',
]);

// Enum for habit type
export const habitTypeEnum = pgEnum('habit_type', ['standard', 'custom']);

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('users_email_idx').on(table.email)],
);

// Habits table
export const habits = pgTable(
  'habits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    type: habitTypeEnum('type').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // null for standard habits
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('habits_user_id_idx').on(table.userId),
    index('habits_type_idx').on(table.type),
  ],
);

// Urges table
export const urges = pgTable(
  'urges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'restrict' }),
    outcome: urgeOutcomeEnum('outcome').notNull(),
    trigger: varchar('trigger', { length: 255 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('urges_user_id_idx').on(table.userId),
    index('urges_habit_id_idx').on(table.habitId),
    index('urges_created_at_idx').on(table.createdAt),
  ],
);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

export type Urge = typeof urges.$inferSelect;
export type NewUrge = typeof urges.$inferInsert;

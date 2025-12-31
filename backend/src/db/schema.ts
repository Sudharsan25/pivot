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
export const urgeOutcomeEnum = pgEnum('urge_outcome', ['resisted', 'gave_in']);

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

// Urges table
export const urges = pgTable(
  'urges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    outcome: urgeOutcomeEnum('outcome').notNull(),
    urgeType: varchar('urge_type', { length: 255 }).notNull(), // required
    trigger: varchar('trigger', { length: 255 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('urges_user_id_idx').on(table.userId),
    index('urges_created_at_idx').on(table.createdAt),
  ],
);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Urge = typeof urges.$inferSelect;
export type NewUrge = typeof urges.$inferInsert;

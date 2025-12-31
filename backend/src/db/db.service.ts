import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  public readonly client: postgres.Sql;
  public readonly db: PostgresJsDatabase<typeof schema>;

  constructor() {
    const databaseUrl = process.env.XATA_DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('XATA_DATABASE_URL environment variable is not set');
    }

    try {
      // Create postgres client with connection error handling
      this.client = postgres(databaseUrl, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
        onnotice: () => {}, // Suppress notices
      });

      // Create drizzle instance with schema
      this.db = drizzle(this.client, { schema });

      this.logger.log('Database service initialized');
    } catch (error) {
      this.logger.error('Failed to initialize database service', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<void> {
    try {
      await this.client`SELECT 1`;
      this.logger.log('Database connection test successful');
    } catch (error) {
      this.logger.error('Database connection test failed', error);
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Run database migrations
   */
  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Running database migrations...');

      await migrate(this.db, {
        migrationsFolder: './drizzle/migrations',
      });

      this.logger.log('Database migrations completed successfully');
    } catch (error) {
      this.logger.error('Database migration failed', error);
      throw new Error(
        `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Cleanup database connection on module destroy
   */
  async onModuleDestroy() {
    try {
      await this.client.end();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error('Error closing database connection', error);
    }
  }
}

import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule implements OnModuleInit {
  private readonly logger = new Logger(DbModule.name);

  constructor(private readonly dbService: DbService) {}

  async onModuleInit() {
    try {
      // Test database connection
      await this.dbService.testConnection();
      this.logger.log('Database connection established successfully');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to establish database connection: ${errorMessage}`,
        error,
      );
      throw error;
    }
  }
}

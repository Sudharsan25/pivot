import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load environment variables
config({ path: './.env' });

async function runMigrations() {
  const databaseUrl = process.env.XATA_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('XATA_DATABASE_URL environment variable is not set');
  }

  console.log('Connecting to database...');
  const client = postgres(databaseUrl, { max: 1 });

  try {
    const db = drizzle(client);

    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: './drizzle/migrations',
    });

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

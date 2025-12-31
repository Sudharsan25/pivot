CREATE TYPE "public"."habit_type" AS ENUM('standard', 'custom');--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "habit_type" NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habits_user_id_idx" ON "habits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "habits_type_idx" ON "habits" USING btree ("type");--> statement-breakpoint
-- Insert standard habits
INSERT INTO "habits" ("name", "type", "user_id") VALUES
('Junk Food', 'standard', NULL),
('Alcohol', 'standard', NULL),
('Social Media', 'standard', NULL),
('Smoking', 'standard', NULL),
('Procrastination', 'standard', NULL),
('Gaming', 'standard', NULL);--> statement-breakpoint
-- Add new habit_id column as uuid
ALTER TABLE "urges" ADD COLUMN "habit_id" uuid;--> statement-breakpoint
-- Migrate existing urge_type data to habit_id
DO $$
DECLARE
    urge_record RECORD;
    habit_id_val uuid;
BEGIN
    FOR urge_record IN SELECT DISTINCT "urge_type", "user_id" FROM "urges" WHERE "habit_id" IS NULL AND "urge_type" IS NOT NULL
    LOOP
        -- Check if habit already exists (standard)
        SELECT "id" INTO habit_id_val
        FROM "habits"
        WHERE "name" = urge_record.urge_type AND "type" = 'standard' AND "user_id" IS NULL;
        
        -- If not found, check for custom habit for this user
        IF habit_id_val IS NULL THEN
            SELECT "id" INTO habit_id_val
            FROM "habits"
            WHERE "name" = urge_record.urge_type AND "type" = 'custom' AND "user_id" = urge_record.user_id;
        END IF;
        
        -- If still not found, create a new habit
        IF habit_id_val IS NULL THEN
            INSERT INTO "habits" ("name", "type", "user_id")
            VALUES (urge_record.urge_type, 'custom', urge_record.user_id)
            RETURNING "id" INTO habit_id_val;
        END IF;
        
        -- Update all urges with this urge_type to use the habit_id
        UPDATE "urges"
        SET "habit_id" = habit_id_val
        WHERE "urge_type" = urge_record.urge_type 
        AND "user_id" = urge_record.user_id
        AND "habit_id" IS NULL;
    END LOOP;
END $$;--> statement-breakpoint
-- Make habit_id NOT NULL (only if all rows have been migrated)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "urges" WHERE "habit_id" IS NULL) THEN
        ALTER TABLE "urges" ALTER COLUMN "habit_id" SET NOT NULL;
    END IF;
END $$;--> statement-breakpoint
-- Add foreign key constraint
ALTER TABLE "urges" ADD CONSTRAINT "urges_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urges_habit_id_idx" ON "urges" USING btree ("habit_id");--> statement-breakpoint
-- Note: Keep urge_type column for now, can be dropped later after verification
-- ALTER TABLE "urges" DROP COLUMN "urge_type";
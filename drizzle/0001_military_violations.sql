ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'customer' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_account_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_onboarded" boolean DEFAULT false;
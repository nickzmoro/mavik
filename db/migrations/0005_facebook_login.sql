ALTER TABLE "social_account_tokens" ALTER COLUMN "expires_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "provider_user_id" text;
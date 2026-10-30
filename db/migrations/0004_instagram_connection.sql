CREATE TABLE "social_account_tokens" (
	"social_account_id" uuid PRIMARY KEY NOT NULL,
	"access_token_encrypted" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"refreshed_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "social_account_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "account_type" text;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "scopes" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "last_error" text;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "connected_by" uuid;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "social_account_tokens" ADD CONSTRAINT "social_account_tokens_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "social_account_tokens_expires_at_idx" ON "social_account_tokens" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_connected_by_profiles_id_fk" FOREIGN KEY ("connected_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
CREATE TABLE "brand_art_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"rule" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brand_art_rules_rule_check" CHECK (char_length("brand_art_rules"."rule") between 1 and 500)
);
--> statement-breakpoint
ALTER TABLE "brand_art_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "brand_art_rules" ADD CONSTRAINT "brand_art_rules_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brand_art_rules_brand_kit_id_idx" ON "brand_art_rules" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE POLICY "membros leem" ON "brand_art_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_art_rules"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "só o dono altera" ON "brand_art_rules" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_art_rules"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_art_rules"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id")));
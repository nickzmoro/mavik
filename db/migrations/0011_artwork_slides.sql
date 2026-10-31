CREATE TABLE "artwork_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"render_path" text NOT NULL,
	"copy" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artwork_slides_artwork_id_position_unique" UNIQUE("artwork_id","position"),
	CONSTRAINT "artwork_slides_position_check" CHECK ("artwork_slides"."position" between 1 and 10),
	CONSTRAINT "artwork_slides_version_check" CHECK ("artwork_slides"."version" >= 1)
);
--> statement-breakpoint
ALTER TABLE "artwork_slides" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artwork_slides" ADD CONSTRAINT "artwork_slides_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artwork_slides_artwork_id_idx" ON "artwork_slides" USING btree ("artwork_id");--> statement-breakpoint
CREATE POLICY "membros da loja" ON "artwork_slides" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "artworks" where "artworks"."id" = "artwork_slides"."artwork_id" and public.is_store_member("artworks"."store_id"))) WITH CHECK (exists (select 1 from "artworks" where "artworks"."id" = "artwork_slides"."artwork_id" and public.is_store_member("artworks"."store_id")));
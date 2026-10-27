CREATE TYPE "public"."artwork_status" AS ENUM('rascunho', 'em_revisao', 'aprovada', 'descartada');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('pendente', 'validado', 'rejeitado');--> statement-breakpoint
CREATE TYPE "public"."author_kind" AS ENUM('usuario', 'agente');--> statement-breakpoint
CREATE TYPE "public"."brand_asset_kind" AS ENUM('logo_claro', 'logo_escuro', 'simbolo', 'logo_mono', 'fonte', 'manual', 'referencia_estilo', 'layout_origem', 'post_bom', 'post_ruim');--> statement-breakpoint
CREATE TYPE "public"."brand_kit_source" AS ENUM('upload_manual', 'guiado');--> statement-breakpoint
CREATE TYPE "public"."business_goal" AS ENUM('vender_mais', 'ganhar_seguidores', 'divulgar_lancamento', 'gerar_contatos');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('rascunho', 'ativa', 'encerrada');--> statement-breakpoint
CREATE TYPE "public"."color_role" AS ENUM('primaria', 'secundaria', 'destaque', 'fundo', 'texto', 'extra');--> statement-breakpoint
CREATE TYPE "public"."connection_status" AS ENUM('conectado', 'expirado', 'desconectado');--> statement-breakpoint
CREATE TYPE "public"."content_format" AS ENUM('post', 'story', 'reels', 'carrossel');--> statement-breakpoint
CREATE TYPE "public"."content_goal" AS ENUM('atrair', 'engajar', 'vender', 'fidelizar');--> statement-breakpoint
CREATE TYPE "public"."content_origin" AS ENUM('plano_mes', 'biblioteca', 'agente', 'campanha', 'resultados', 'usuario', 'onboarding');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('ideia', 'em_producao', 'em_revisao', 'aprovado', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('educativo', 'comercial', 'institucional', 'autoridade');--> statement-breakpoint
CREATE TYPE "public"."date_kind" AS ENUM('feriado', 'data_comercial', 'data_setor', 'tendencia');--> statement-breakpoint
CREATE TYPE "public"."font_role" AS ENUM('titulo', 'paragrafo', 'destaque');--> statement-breakpoint
CREATE TYPE "public"."font_source" AS ENUM('google', 'upload');--> statement-breakpoint
CREATE TYPE "public"."funnel_stage" AS ENUM('descoberta', 'consideracao', 'decisao', 'fidelizacao');--> statement-breakpoint
CREATE TYPE "public"."idea_source" AS ENUM('biblioteca', 'gerada', 'versao', 'agente', 'resultados', 'usuario');--> statement-breakpoint
CREATE TYPE "public"."image_style" AS ENUM('fotografico', 'ilustrado', 'minimalista', '3d', 'outro');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pendente', 'processando', 'concluido', 'erro');--> statement-breakpoint
CREATE TYPE "public"."marketing_level" AS ENUM('simples', 'intermediario', 'avancado');--> statement-breakpoint
CREATE TYPE "public"."memory_kind" AS ENUM('preferencia', 'decisao', 'fato');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('sugerido', 'aprovado', 'arquivado');--> statement-breakpoint
CREATE TYPE "public"."restriction_kind" AS ENUM('cor', 'elemento', 'estilo', 'termo');--> statement-breakpoint
CREATE TYPE "public"."rule_source" AS ENUM('layouts', 'cores', 'fontes', 'estilo', 'voz', 'evitar', 'manual');--> statement-breakpoint
CREATE TYPE "public"."social_provider" AS ENUM('instagram', 'facebook', 'google_business');--> statement-breakpoint
CREATE TYPE "public"."store_role" AS ENUM('owner', 'designer', 'member');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."term_kind" AS ENUM('amada', 'proibida');--> statement-breakpoint
CREATE TABLE "agent_memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"kind" "memory_kind" NOT NULL,
	"content" text NOT NULL,
	"conversation_id" uuid,
	"confirmed" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_memories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "art_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"artwork_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "art_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artwork_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"layers" jsonb NOT NULL,
	"render_path" text,
	"caption" text,
	"author" "author_kind" DEFAULT 'agente' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artwork_versions_artwork_id_version_unique" UNIQUE("artwork_id","version"),
	CONSTRAINT "artwork_versions_version_check" CHECK ("artwork_versions"."version" >= 1)
);
--> statement-breakpoint
ALTER TABLE "artwork_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"content_id" uuid,
	"brand_kit_id" uuid NOT NULL,
	"layout_id" uuid,
	"prompt" text,
	"format" "content_format" NOT NULL,
	"status" "artwork_status" DEFAULT 'rascunho' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artworks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"kind" "brand_asset_kind" NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"is_generated" boolean DEFAULT false NOT NULL,
	"status" "asset_status" DEFAULT 'pendente' NOT NULL,
	"validation" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brand_assets_dimensions_check" CHECK (("brand_assets"."width" is null or "brand_assets"."width" > 0) and ("brand_assets"."height" is null or "brand_assets"."height" > 0))
);
--> statement-breakpoint
ALTER TABLE "brand_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"role" "color_role" NOT NULL,
	"name" text,
	"hex" char(7) NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "brand_colors_hex_check" CHECK ("brand_colors"."hex" ~ '^#[0-9A-Fa-f]{6}$')
);
--> statement-breakpoint
ALTER TABLE "brand_colors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_fonts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"role" "font_role" NOT NULL,
	"family" text NOT NULL,
	"source" "font_source" NOT NULL,
	"asset_id" uuid,
	"weights" integer[] DEFAULT '{400}' NOT NULL,
	"license_confirmed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "brand_fonts_brand_kit_id_role_unique" UNIQUE("brand_kit_id","role"),
	CONSTRAINT "brand_fonts_upload_asset_check" CHECK ("brand_fonts"."source" <> 'upload' or "brand_fonts"."asset_id" is not null)
);
--> statement-breakpoint
ALTER TABLE "brand_fonts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"source" "brand_kit_source" DEFAULT 'guiado' NOT NULL,
	"image_style" "image_style",
	"completeness" smallint DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brand_kits_store_id_version_unique" UNIQUE("store_id","version"),
	CONSTRAINT "brand_kits_version_check" CHECK ("brand_kits"."version" >= 1),
	CONSTRAINT "brand_kits_completeness_check" CHECK ("brand_kits"."completeness" >= 0)
);
--> statement-breakpoint
ALTER TABLE "brand_kits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_layouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"name" text NOT NULL,
	"format" "content_format" NOT NULL,
	"source_asset_id" uuid,
	"structure" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_layouts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_restrictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"kind" "restriction_kind" NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_restrictions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"rule" text NOT NULL,
	"source" "rule_source" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"kind" "term_kind" NOT NULL,
	"term" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_terms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "brand_voice" (
	"brand_kit_id" uuid PRIMARY KEY NOT NULL,
	"formal_casual" smallint NOT NULL,
	"serious_fun" smallint NOT NULL,
	"technical_simple" smallint NOT NULL,
	"educational_sales" smallint NOT NULL,
	"tone_label" text,
	"sample_caption" text,
	"sample_approved" boolean DEFAULT false NOT NULL,
	CONSTRAINT "brand_voice_formal_casual_check" CHECK ("brand_voice"."formal_casual" between 0 and 100),
	CONSTRAINT "brand_voice_serious_fun_check" CHECK ("brand_voice"."serious_fun" between 0 and 100),
	CONSTRAINT "brand_voice_technical_simple_check" CHECK ("brand_voice"."technical_simple" between 0 and 100),
	CONSTRAINT "brand_voice_educational_sales_check" CHECK ("brand_voice"."educational_sales" between 0 and 100)
);
--> statement-breakpoint
ALTER TABLE "brand_voice" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "calendar_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"kind" date_kind NOT NULL,
	"segment" text,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "calendar_dates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"goal" "content_goal" NOT NULL,
	"calendar_date_id" uuid,
	"formats" "content_format"[] DEFAULT '{}' NOT NULL,
	"auto_distribute" boolean DEFAULT true NOT NULL,
	"status" "campaign_status" DEFAULT 'ativa' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_dates_check" CHECK ("campaigns"."end_date" >= "campaigns"."start_date")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"handle" text
);
--> statement-breakpoint
ALTER TABLE "competitors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "content_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"month" date NOT NULL,
	"weekly_frequency" text NOT NULL,
	"focus_weekdays" smallint[] NOT NULL,
	"include_date_ids" uuid[] DEFAULT '{}' NOT NULL,
	"use_saved_ideas" boolean DEFAULT true NOT NULL,
	"rationale" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "plan_status" DEFAULT 'sugerido' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_plans_store_id_month_unique" UNIQUE("store_id","month"),
	CONSTRAINT "content_plans_month_check" CHECK ("content_plans"."month" = date_trunc('month', "content_plans"."month")::date),
	CONSTRAINT "content_plans_focus_weekdays_check" CHECK ("content_plans"."focus_weekdays" <@ '{0,1,2,3,4,5,6}'::smallint[])
);
--> statement-breakpoint
ALTER TABLE "content_plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "content_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"from_status" "content_status",
	"to_status" "content_status" NOT NULL,
	"changed_by" uuid,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_status_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"plan_id" uuid,
	"campaign_id" uuid,
	"idea_id" uuid,
	"title" text NOT NULL,
	"format" "content_format" NOT NULL,
	"goal" "content_goal" NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "content_status" DEFAULT 'ideia' NOT NULL,
	"origin" "content_origin" DEFAULT 'usuario' NOT NULL,
	"why_this_day" text,
	"caption" text,
	"current_artwork_id" uuid,
	"social_account_id" uuid,
	"external_post_id" text,
	"permalink" text,
	"published_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contents_social_account_id_external_post_id_unique" UNIQUE("social_account_id","external_post_id")
);
--> statement-breakpoint
ALTER TABLE "contents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'Nova conversa' NOT NULL,
	"tag" text,
	"pinned" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"next_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "diagnostics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"score" smallint NOT NULL,
	"consistency_score" smallint NOT NULL,
	"content_score" smallint NOT NULL,
	"offer_score" smallint NOT NULL,
	"strengths" text[] DEFAULT '{}' NOT NULL,
	"attention_points" text[] DEFAULT '{}' NOT NULL,
	"opportunities" text[] DEFAULT '{}' NOT NULL,
	"sources" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_baseline" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diagnostics_score_check" CHECK ("diagnostics"."score" between 0 and 100),
	CONSTRAINT "diagnostics_consistency_score_check" CHECK ("diagnostics"."consistency_score" between 0 and 100),
	CONSTRAINT "diagnostics_content_score_check" CHECK ("diagnostics"."content_score" between 0 and 100),
	CONSTRAINT "diagnostics_offer_score_check" CHECK ("diagnostics"."offer_score" between 0 and 100)
);
--> statement-breakpoint
ALTER TABLE "diagnostics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "idea_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"requested_by" uuid NOT NULL,
	"theme" text,
	"goal" "content_goal",
	"formats" "content_format"[] DEFAULT '{}' NOT NULL,
	"content_types" "content_type"[] DEFAULT '{}' NOT NULL,
	"quantity" smallint DEFAULT 6 NOT NULL,
	"status" "job_status" DEFAULT 'pendente' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idea_requests_quantity_check" CHECK ("idea_requests"."quantity" between 1 and 50)
);
--> statement-breakpoint
ALTER TABLE "idea_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "idea_saves" (
	"idea_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idea_saves_idea_id_user_id_pk" PRIMARY KEY("idea_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "idea_saves" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"parent_idea_id" uuid,
	"request_id" uuid,
	"calendar_date_id" uuid,
	"persona_id" uuid,
	"title" text NOT NULL,
	"format" "content_format" NOT NULL,
	"content_type" "content_type" NOT NULL,
	"goal" "content_goal" NOT NULL,
	"funnel_stage" "funnel_stage" NOT NULL,
	"audience" text,
	"why" text NOT NULL,
	"how_to_use" text NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"caption_example" text,
	"best_time" text,
	"recommended" boolean DEFAULT false NOT NULL,
	"source" "idea_source" DEFAULT 'gerada' NOT NULL,
	"variation_tone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ideas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"payload" jsonb,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"social_account_id" uuid NOT NULL,
	"day" date NOT NULL,
	"store_id" uuid NOT NULL,
	"account" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"posts" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"audience" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metric_snapshots_social_account_id_day_pk" PRIMARY KEY("social_account_id","day")
);
--> statement-breakpoint
ALTER TABLE "metric_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "personas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_kit_id" uuid NOT NULL,
	"name" text NOT NULL,
	"age" smallint,
	"description" text NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "personas_age_check" CHECK ("personas"."age" is null or "personas"."age" between 0 and 120)
);
--> statement-breakpoint
ALTER TABLE "personas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"monthly_art_limit" integer,
	"price_cents" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "plans_price_cents_check" CHECK ("plans"."price_cents" >= 0),
	CONSTRAINT "plans_monthly_art_limit_check" CHECK ("plans"."monthly_art_limit" is null or "plans"."monthly_art_limit" >= 0)
);
--> statement-breakpoint
ALTER TABLE "plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"marketing_level" "marketing_level" DEFAULT 'simples' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_theme_check" CHECK ("profiles"."theme" in ('light', 'dark', 'system')),
	CONSTRAINT "profiles_full_name_length_check" CHECK (char_length("profiles"."full_name") <= 120),
	CONSTRAINT "profiles_avatar_url_check" CHECK ("profiles"."avatar_url" is null or "profiles"."avatar_url" ~ '^https://')
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"provider" "social_provider" NOT NULL,
	"external_id" text NOT NULL,
	"handle" text,
	"token_secret_id" uuid,
	"status" "connection_status" DEFAULT 'conectado' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social_accounts_store_id_provider_unique" UNIQUE("store_id","provider")
);
--> statement-breakpoint
ALTER TABLE "social_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_members" (
	"store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "store_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "store_members_store_id_user_id_pk" PRIMARY KEY("store_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "store_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_positioning" (
	"store_id" uuid PRIMARY KEY NOT NULL,
	"differentiators" text,
	"objections" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "store_positioning" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "store_products_position_check" CHECK ("store_products"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "store_products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"segment" text NOT NULL,
	"city" text,
	"state" text,
	"serves_online" boolean DEFAULT false NOT NULL,
	"website_url" text,
	"instagram_handle" text,
	"main_goal" "business_goal",
	"current_objective" text,
	"focus_weekdays" smallint[] DEFAULT '{4,5,6}' NOT NULL,
	"is_regulated" boolean DEFAULT false NOT NULL,
	"onboarding_step" smallint DEFAULT 1 NOT NULL,
	"onboarding_completed_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug"),
	CONSTRAINT "stores_slug_check" CHECK ("stores"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "stores_onboarding_step_check" CHECK ("stores"."onboarding_step" between 1 and 4),
	CONSTRAINT "stores_focus_weekdays_check" CHECK ("stores"."focus_weekdays" <@ '{0,1,2,3,4,5,6}'::smallint[])
);
--> statement-breakpoint
ALTER TABLE "stores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"plan_id" text NOT NULL,
	"status" "subscription_status" DEFAULT 'trialing' NOT NULL,
	"trial_art_limit" integer DEFAULT 3 NOT NULL,
	"current_period_end" timestamp with time zone,
	"provider_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_store_id_unique" UNIQUE("store_id"),
	CONSTRAINT "subscriptions_trial_art_limit_check" CHECK ("subscriptions"."trial_art_limit" >= 0)
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "agent_memories" ADD CONSTRAINT "agent_memories_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_memories" ADD CONSTRAINT "agent_memories_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "art_usage" ADD CONSTRAINT "art_usage_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "art_usage" ADD CONSTRAINT "art_usage_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "art_usage" ADD CONSTRAINT "art_usage_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_versions" ADD CONSTRAINT "artwork_versions_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_layout_id_brand_layouts_id_fk" FOREIGN KEY ("layout_id") REFERENCES "public"."brand_layouts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_assets" ADD CONSTRAINT "brand_assets_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_colors" ADD CONSTRAINT "brand_colors_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_fonts" ADD CONSTRAINT "brand_fonts_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_fonts" ADD CONSTRAINT "brand_fonts_asset_id_brand_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."brand_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD CONSTRAINT "brand_kits_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD CONSTRAINT "brand_kits_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_layouts" ADD CONSTRAINT "brand_layouts_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_layouts" ADD CONSTRAINT "brand_layouts_source_asset_id_brand_assets_id_fk" FOREIGN KEY ("source_asset_id") REFERENCES "public"."brand_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_restrictions" ADD CONSTRAINT "brand_restrictions_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_rules" ADD CONSTRAINT "brand_rules_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_terms" ADD CONSTRAINT "brand_terms_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_voice" ADD CONSTRAINT "brand_voice_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_dates" ADD CONSTRAINT "calendar_dates_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_calendar_date_id_calendar_dates_id_fk" FOREIGN KEY ("calendar_date_id") REFERENCES "public"."calendar_dates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_plans" ADD CONSTRAINT "content_plans_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_plans" ADD CONSTRAINT "content_plans_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_status_history" ADD CONSTRAINT "content_status_history_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_status_history" ADD CONSTRAINT "content_status_history_changed_by_profiles_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_plan_id_content_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."content_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_current_artwork_id_artworks_id_fk" FOREIGN KEY ("current_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_requests" ADD CONSTRAINT "idea_requests_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_requests" ADD CONSTRAINT "idea_requests_requested_by_profiles_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_saves" ADD CONSTRAINT "idea_saves_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_saves" ADD CONSTRAINT "idea_saves_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_parent_idea_id_ideas_id_fk" FOREIGN KEY ("parent_idea_id") REFERENCES "public"."ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_request_id_idea_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."idea_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_calendar_date_id_calendar_dates_id_fk" FOREIGN KEY ("calendar_date_id") REFERENCES "public"."calendar_dates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personas" ADD CONSTRAINT "personas_brand_kit_id_brand_kits_id_fk" FOREIGN KEY ("brand_kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_positioning" ADD CONSTRAINT "store_positioning_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_memories_store_id_idx" ON "agent_memories" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "agent_memories_conversation_id_idx" ON "agent_memories" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "art_usage_store_id_idx" ON "art_usage" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "art_usage_artwork_id_idx" ON "art_usage" USING btree ("artwork_id");--> statement-breakpoint
CREATE INDEX "art_usage_user_id_idx" ON "art_usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "artwork_versions_artwork_id_idx" ON "artwork_versions" USING btree ("artwork_id");--> statement-breakpoint
CREATE INDEX "artworks_store_id_idx" ON "artworks" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "artworks_content_id_idx" ON "artworks" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "artworks_brand_kit_id_idx" ON "artworks" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "artworks_layout_id_idx" ON "artworks" USING btree ("layout_id");--> statement-breakpoint
CREATE INDEX "artworks_approved_by_idx" ON "artworks" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "artworks_created_by_idx" ON "artworks" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "brand_assets_brand_kit_id_idx" ON "brand_assets" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_colors_brand_kit_id_idx" ON "brand_colors" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_fonts_brand_kit_id_idx" ON "brand_fonts" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_fonts_asset_id_idx" ON "brand_fonts" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "brand_kits_store_id_idx" ON "brand_kits" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "brand_kits_created_by_idx" ON "brand_kits" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "brand_kits_one_current" ON "brand_kits" USING btree ("store_id") WHERE "brand_kits"."is_current";--> statement-breakpoint
CREATE INDEX "brand_layouts_brand_kit_id_idx" ON "brand_layouts" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_layouts_source_asset_id_idx" ON "brand_layouts" USING btree ("source_asset_id");--> statement-breakpoint
CREATE INDEX "brand_restrictions_brand_kit_id_idx" ON "brand_restrictions" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_rules_brand_kit_id_idx" ON "brand_rules" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "brand_terms_brand_kit_id_idx" ON "brand_terms" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "calendar_dates_store_id_idx" ON "calendar_dates" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "campaigns_store_id_idx" ON "campaigns" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "campaigns_calendar_date_id_idx" ON "campaigns" USING btree ("calendar_date_id");--> statement-breakpoint
CREATE INDEX "competitors_store_id_idx" ON "competitors" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "content_plans_store_id_idx" ON "content_plans" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "content_plans_approved_by_idx" ON "content_plans" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "content_status_history_content_id_idx" ON "content_status_history" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "content_status_history_changed_by_idx" ON "content_status_history" USING btree ("changed_by");--> statement-breakpoint
CREATE INDEX "contents_store_id_idx" ON "contents" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "contents_plan_id_idx" ON "contents" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "contents_campaign_id_idx" ON "contents" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "contents_idea_id_idx" ON "contents" USING btree ("idea_id");--> statement-breakpoint
CREATE INDEX "contents_current_artwork_id_idx" ON "contents" USING btree ("current_artwork_id");--> statement-breakpoint
CREATE INDEX "contents_social_account_id_idx" ON "contents" USING btree ("social_account_id");--> statement-breakpoint
CREATE INDEX "contents_created_by_idx" ON "contents" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "contents_store_id_scheduled_at_idx" ON "contents" USING btree ("store_id","scheduled_at");--> statement-breakpoint
CREATE INDEX "contents_store_id_status_idx" ON "contents" USING btree ("store_id","status");--> statement-breakpoint
CREATE INDEX "conversations_store_id_idx" ON "conversations" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "diagnostics_store_id_idx" ON "diagnostics" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idea_requests_store_id_idx" ON "idea_requests" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idea_requests_requested_by_idx" ON "idea_requests" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "idea_saves_user_id_idx" ON "idea_saves" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ideas_store_id_idx" ON "ideas" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "ideas_parent_idea_id_idx" ON "ideas" USING btree ("parent_idea_id");--> statement-breakpoint
CREATE INDEX "ideas_request_id_idx" ON "ideas" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "ideas_calendar_date_id_idx" ON "ideas" USING btree ("calendar_date_id");--> statement-breakpoint
CREATE INDEX "ideas_persona_id_idx" ON "ideas" USING btree ("persona_id");--> statement-breakpoint
CREATE INDEX "ideas_store_id_goal_format_idx" ON "ideas" USING btree ("store_id","goal","format");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "metric_snapshots_store_id_idx" ON "metric_snapshots" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "metric_snapshots_store_id_day_idx" ON "metric_snapshots" USING btree ("store_id","day" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_store_id_idx" ON "notifications" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "personas_brand_kit_id_idx" ON "personas" USING btree ("brand_kit_id");--> statement-breakpoint
CREATE INDEX "social_accounts_store_id_idx" ON "social_accounts" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_members_user_id_idx" ON "store_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "store_products_store_id_idx" ON "store_products" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "stores_created_by_idx" ON "stores" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions" USING btree ("plan_id");--> statement-breakpoint
CREATE VIEW "public"."store_art_usage" WITH (security_invoker = true) AS (select "subscriptions"."store_id", count("art_usage"."id")::int as "arts_used", "subscriptions"."trial_art_limit" from "subscriptions" left join "art_usage" on "art_usage"."store_id" = "subscriptions"."store_id" group by "subscriptions"."store_id", "subscriptions"."trial_art_limit");--> statement-breakpoint
CREATE POLICY "membros da loja" ON "agent_memories" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("agent_memories"."store_id")) WITH CHECK (public.is_store_member("agent_memories"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "art_usage" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("art_usage"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "artwork_versions" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "artworks" where "artworks"."id" = "artwork_versions"."artwork_id" and public.is_store_member("artworks"."store_id"))) WITH CHECK (exists (select 1 from "artworks" where "artworks"."id" = "artwork_versions"."artwork_id" and public.is_store_member("artworks"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "artworks" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("artworks"."store_id")) WITH CHECK (public.is_store_member("artworks"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "brand_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_assets"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "só o dono altera" ON "brand_assets" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_assets"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_assets"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros leem" ON "brand_colors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_colors"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "só o dono altera" ON "brand_colors" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_colors"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_colors"."brand_kit_id" and public.is_store_owner("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_fonts" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_fonts"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_fonts"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_kits" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("brand_kits"."store_id")) WITH CHECK (public.is_store_member("brand_kits"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_layouts" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_layouts"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_layouts"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_restrictions" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_restrictions"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_restrictions"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_rules" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_rules"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_rules"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_terms" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_terms"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_terms"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "brand_voice" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_voice"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "brand_voice"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "datas globais e da loja" ON "calendar_dates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("calendar_dates"."store_id" is null or public.is_store_member("calendar_dates"."store_id"));--> statement-breakpoint
CREATE POLICY "loja gerencia suas datas" ON "calendar_dates" AS PERMISSIVE FOR ALL TO "authenticated" USING ("calendar_dates"."store_id" is not null and public.is_store_member("calendar_dates"."store_id")) WITH CHECK ("calendar_dates"."store_id" is not null and public.is_store_member("calendar_dates"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "campaigns" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("campaigns"."store_id")) WITH CHECK (public.is_store_member("campaigns"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "competitors" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("competitors"."store_id")) WITH CHECK (public.is_store_member("competitors"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "content_plans" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("content_plans"."store_id")) WITH CHECK (public.is_store_member("content_plans"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "content_status_history" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "contents" where "contents"."id" = "content_status_history"."content_id" and public.is_store_member("contents"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "contents" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("contents"."store_id")) WITH CHECK (public.is_store_member("contents"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "conversations" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("conversations"."store_id")) WITH CHECK (public.is_store_member("conversations"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "diagnostics" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("diagnostics"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "idea_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("idea_requests"."store_id"));--> statement-breakpoint
CREATE POLICY "membros pedem ideias" ON "idea_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.is_store_member("idea_requests"."store_id") and "idea_requests"."requested_by" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "salvos próprios" ON "idea_saves" AS PERMISSIVE FOR ALL TO "authenticated" USING ("idea_saves"."user_id" = (select auth.uid()) and exists (select 1 from "ideas" where "ideas"."id" = "idea_saves"."idea_id" and public.is_store_member("ideas"."store_id"))) WITH CHECK ("idea_saves"."user_id" = (select auth.uid()) and exists (select 1 from "ideas" where "ideas"."id" = "idea_saves"."idea_id" and public.is_store_member("ideas"."store_id")));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "ideas" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("ideas"."store_id")) WITH CHECK (public.is_store_member("ideas"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "conversations" where "conversations"."id" = "messages"."conversation_id" and public.is_store_member("conversations"."store_id")));--> statement-breakpoint
CREATE POLICY "membros enviam mensagens" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("messages"."role" = 'user' and exists (select 1 from "conversations" where "conversations"."id" = "messages"."conversation_id" and public.is_store_member("conversations"."store_id")));--> statement-breakpoint
CREATE POLICY "membros leem" ON "metric_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("metric_snapshots"."store_id"));--> statement-breakpoint
CREATE POLICY "avisos próprios" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("notifications"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "usuário marca aviso como lido" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("notifications"."user_id" = (select auth.uid())) WITH CHECK ("notifications"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "personas" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (select 1 from "brand_kits" where "brand_kits"."id" = "personas"."brand_kit_id" and public.is_store_member("brand_kits"."store_id"))) WITH CHECK (exists (select 1 from "brand_kits" where "brand_kits"."id" = "personas"."brand_kit_id" and public.is_store_member("brand_kits"."store_id")));--> statement-breakpoint
CREATE POLICY "planos visíveis" ON "plans" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "perfil próprio e da equipe" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("profiles"."id" = (select auth.uid()) or public.shares_store_with("profiles"."id"));--> statement-breakpoint
CREATE POLICY "usuário altera o próprio perfil" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profiles"."id" = (select auth.uid())) WITH CHECK ("profiles"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "membros leem" ON "social_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("social_accounts"."store_id"));--> statement-breakpoint
CREATE POLICY "membros veem a equipe" ON "store_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("store_members"."store_id"));--> statement-breakpoint
CREATE POLICY "dono gerencia a equipe" ON "store_members" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_owner("store_members"."store_id")) WITH CHECK (public.is_store_owner("store_members"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "store_positioning" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("store_positioning"."store_id")) WITH CHECK (public.is_store_member("store_positioning"."store_id"));--> statement-breakpoint
CREATE POLICY "membros da loja" ON "store_products" AS PERMISSIVE FOR ALL TO "authenticated" USING (public.is_store_member("store_products"."store_id")) WITH CHECK (public.is_store_member("store_products"."store_id"));--> statement-breakpoint
CREATE POLICY "membros leem a loja" ON "stores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("stores"."id") or "stores"."created_by" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "qualquer usuário cria loja" ON "stores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("stores"."created_by" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "dono altera a loja" ON "stores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (public.is_store_owner("stores"."id")) WITH CHECK (public.is_store_owner("stores"."id"));--> statement-breakpoint
CREATE POLICY "dono exclui a loja" ON "stores" AS PERMISSIVE FOR DELETE TO "authenticated" USING (public.is_store_owner("stores"."id"));--> statement-breakpoint
CREATE POLICY "membros veem a assinatura" ON "subscriptions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_store_member("subscriptions"."store_id"));
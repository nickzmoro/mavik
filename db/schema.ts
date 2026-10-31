import { eq, relations, sql, type SQL } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  char,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  pgView,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  unique,
  uuid,
  type PgTable,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";

export const storeRoleEnum = pgEnum("store_role", [
  "owner",
  "designer",
  "member",
]);
export const marketingLevelEnum = pgEnum("marketing_level", [
  "simples",
  "intermediario",
  "avancado",
]);
export const businessGoalEnum = pgEnum("business_goal", [
  "vender_mais",
  "ganhar_seguidores",
  "divulgar_lancamento",
  "gerar_contatos",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
]);
export const brandKitSourceEnum = pgEnum("brand_kit_source", [
  "upload_manual",
  "guiado",
]);
export const brandAssetKindEnum = pgEnum("brand_asset_kind", [
  "logo_claro",
  "logo_escuro",
  "simbolo",
  "logo_mono",
  "fonte",
  "manual",
  "referencia_estilo",
  "layout_origem",
  "post_bom",
  "post_ruim",
  "story_bom",
]);
export const assetStatusEnum = pgEnum("asset_status", [
  "pendente",
  "validado",
  "rejeitado",
]);
export const colorRoleEnum = pgEnum("color_role", [
  "primaria",
  "secundaria",
  "destaque",
  "fundo",
  "texto",
  "extra",
]);
export const fontRoleEnum = pgEnum("font_role", [
  "titulo",
  "paragrafo",
  "destaque",
]);
export const fontSourceEnum = pgEnum("font_source", [
  "google",
  "upload",
  "nome",
]);
export const imageStyleEnum = pgEnum("image_style", [
  "fotografico",
  "ilustrado",
  "minimalista",
  "3d",
  "outro",
]);
export const termKindEnum = pgEnum("term_kind", ["amada", "proibida"]);
export const ruleSourceEnum = pgEnum("rule_source", [
  "layouts",
  "cores",
  "fontes",
  "estilo",
  "voz",
  "evitar",
  "manual",
]);
export const restrictionKindEnum = pgEnum("restriction_kind", [
  "cor",
  "elemento",
  "estilo",
  "termo",
]);
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);
export const memoryKindEnum = pgEnum("memory_kind", [
  "preferencia",
  "decisao",
  "fato",
]);
export const contentFormatEnum = pgEnum("content_format", [
  "post",
  "story",
  "reels",
  "carrossel",
  "banner",
]);
export const contentTypeEnum = pgEnum("content_type", [
  "educativo",
  "comercial",
  "institucional",
  "autoridade",
]);
export const contentGoalEnum = pgEnum("content_goal", [
  "atrair",
  "engajar",
  "vender",
  "fidelizar",
]);
export const funnelStageEnum = pgEnum("funnel_stage", [
  "descoberta",
  "consideracao",
  "decisao",
  "fidelizacao",
]);
export const ideaSourceEnum = pgEnum("idea_source", [
  "biblioteca",
  "gerada",
  "versao",
  "agente",
  "resultados",
  "usuario",
]);
export const dateKindEnum = pgEnum("date_kind", [
  "feriado",
  "data_comercial",
  "data_setor",
  "tendencia",
]);
export const jobStatusEnum = pgEnum("job_status", [
  "pendente",
  "processando",
  "concluido",
  "erro",
]);
export const planStatusEnum = pgEnum("plan_status", [
  "sugerido",
  "aprovado",
  "arquivado",
]);
export const contentStatusEnum = pgEnum("content_status", [
  "ideia",
  "em_producao",
  "em_revisao",
  "aprovado",
  "publicado",
]);
export const contentOriginEnum = pgEnum("content_origin", [
  "plano_mes",
  "biblioteca",
  "agente",
  "campanha",
  "resultados",
  "usuario",
  "onboarding",
]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "rascunho",
  "ativa",
  "encerrada",
]);
export const artworkStatusEnum = pgEnum("artwork_status", [
  "rascunho",
  "em_revisao",
  "aprovada",
  "descartada",
]);
export const authorKindEnum = pgEnum("author_kind", ["usuario", "agente"]);
export const socialProviderEnum = pgEnum("social_provider", [
  "instagram",
  "facebook",
  "google_business",
]);
export const connectionStatusEnum = pgEnum("connection_status", [
  "conectado",
  "expirado",
  "desconectado",
]);

const id = () => uuid("id").primaryKey().defaultRandom();

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

const storeId = () =>
  uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" });

const brandKitId = () =>
  uuid("brand_kit_id")
    .notNull()
    .references(() => brandKits.id, { onDelete: "cascade" });

const profileId = (name: string) =>
  uuid(name)
    .notNull()
    .references(() => profiles.id, { onDelete: "restrict" });

const optionalProfileId = (name: string) =>
  uuid(name).references(() => profiles.id, { onDelete: "set null" });

const isStoreMember = (storeIdColumn: AnyPgColumn) =>
  sql`public.is_store_member(${storeIdColumn})`;

const isStoreOwner = (storeIdColumn: AnyPgColumn) =>
  sql`public.is_store_owner(${storeIdColumn})`;

const isCurrentUser = (userIdColumn: AnyPgColumn) =>
  sql`${userIdColumn} = ${authUid}`;

const isScore = (column: AnyPgColumn) => sql`${column} between 0 and 100`;

const parentStoreCheck = ({
  parentTable,
  parentId,
  parentStoreId,
  foreignKey,
  storeCheck = isStoreMember,
}: {
  parentTable: PgTable;
  parentId: AnyPgColumn;
  parentStoreId: AnyPgColumn;
  foreignKey: AnyPgColumn;
  storeCheck?: (storeIdColumn: AnyPgColumn) => SQL;
}) =>
  sql`exists (select 1 from ${parentTable} where ${parentId} = ${foreignKey} and ${storeCheck(parentStoreId)})`;

const fullAccessPolicy = (name: string, condition: SQL) =>
  pgPolicy(name, {
    for: "all",
    to: authenticatedRole,
    using: condition,
    withCheck: condition,
  });

const readPolicy = (name: string, condition: SQL) =>
  pgPolicy(name, { for: "select", to: authenticatedRole, using: condition });

const storeMembersPolicy = (storeIdColumn: AnyPgColumn) =>
  fullAccessPolicy("membros da loja", isStoreMember(storeIdColumn));

const storeMembersReadPolicy = (storeIdColumn: AnyPgColumn) =>
  readPolicy("membros leem", isStoreMember(storeIdColumn));

const brandKitCheck = (
  foreignKey: AnyPgColumn,
  storeCheck?: (storeIdColumn: AnyPgColumn) => SQL,
) =>
  parentStoreCheck({
    parentTable: brandKits,
    parentId: brandKits.id,
    parentStoreId: brandKits.storeId,
    foreignKey,
    storeCheck,
  });

const brandKitMembersPolicy = (foreignKey: AnyPgColumn) =>
  fullAccessPolicy("membros da loja", brandKitCheck(foreignKey));

const brandKitOwnerPolicies = (foreignKey: AnyPgColumn) => [
  readPolicy("membros leem", brandKitCheck(foreignKey)),
  fullAccessPolicy("só o dono altera", brandKitCheck(foreignKey, isStoreOwner)),
];

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    avatarUrl: text("avatar_url"),
    marketingLevel: marketingLevelEnum("marketing_level")
      .notNull()
      .default("simples"),
    theme: text("theme").notNull().default("system"),
    createdAt: createdAt(),
  },
  (table) => [
    check(
      "profiles_theme_check",
      sql`${table.theme} in ('light', 'dark', 'system')`,
    ),
    check(
      "profiles_full_name_length_check",
      sql`char_length(${table.fullName}) <= 120`,
    ),
    check(
      "profiles_avatar_url_check",
      sql`${table.avatarUrl} is null or ${table.avatarUrl} ~ '^https://'`,
    ),
    readPolicy(
      "perfil próprio e da equipe",
      sql`${isCurrentUser(table.id)} or public.shares_store_with(${table.id})`,
    ),
    pgPolicy("usuário altera o próprio perfil", {
      for: "update",
      to: authenticatedRole,
      using: isCurrentUser(table.id),
      withCheck: isCurrentUser(table.id),
    }),
  ],
);

export const stores = pgTable(
  "stores",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    segment: text("segment").notNull(),
    city: text("city"),
    state: text("state"),
    servesOnline: boolean("serves_online").notNull().default(false),
    websiteUrl: text("website_url"),
    instagramHandle: text("instagram_handle"),
    mainGoal: businessGoalEnum("main_goal"),
    currentObjective: text("current_objective"),
    focusWeekdays: smallint("focus_weekdays")
      .array()
      .notNull()
      .default(sql`'{4,5,6}'`),
    isRegulated: boolean("is_regulated").notNull().default(false),
    onboardingStep: smallint("onboarding_step").notNull().default(1),
    onboardingCompletedAt: timestamp("onboarding_completed_at", {
      withTimezone: true,
    }),
    createdBy: profileId("created_by"),
    createdAt: createdAt(),
  },
  (table) => [
    index("stores_created_by_idx").on(table.createdBy),
    check("stores_slug_check", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
    check(
      "stores_onboarding_step_check",
      sql`${table.onboardingStep} between 1 and 4`,
    ),
    check(
      "stores_focus_weekdays_check",
      sql`${table.focusWeekdays} <@ '{0,1,2,3,4,5,6}'::smallint[]`,
    ),
    readPolicy(
      "membros leem a loja",
      sql`${isStoreMember(table.id)} or ${isCurrentUser(table.createdBy)}`,
    ),
    pgPolicy("qualquer usuário cria loja", {
      for: "insert",
      to: authenticatedRole,
      withCheck: isCurrentUser(table.createdBy),
    }),
    pgPolicy("dono altera a loja", {
      for: "update",
      to: authenticatedRole,
      using: isStoreOwner(table.id),
      withCheck: isStoreOwner(table.id),
    }),
    pgPolicy("dono exclui a loja", {
      for: "delete",
      to: authenticatedRole,
      using: isStoreOwner(table.id),
    }),
  ],
);

export const storeMembers = pgTable(
  "store_members",
  {
    storeId: storeId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: storeRoleEnum("role").notNull().default("member"),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.storeId, table.userId] }),
    index("store_members_user_id_idx").on(table.userId),
    readPolicy("membros veem a equipe", isStoreMember(table.storeId)),
    fullAccessPolicy("dono gerencia a equipe", isStoreOwner(table.storeId)),
  ],
);

export const storeProducts = pgTable(
  "store_products",
  {
    id: id(),
    storeId: storeId(),
    name: text("name").notNull(),
    position: smallint("position").notNull().default(0),
  },
  (table) => [
    index("store_products_store_id_idx").on(table.storeId),
    check("store_products_position_check", sql`${table.position} >= 0`),
    storeMembersPolicy(table.storeId),
  ],
);

export const storePositioning = pgTable(
  "store_positioning",
  {
    storeId: uuid("store_id")
      .primaryKey()
      .references(() => stores.id, { onDelete: "cascade" }),
    differentiators: text("differentiators"),
    objections: text("objections"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [storeMembersPolicy(table.storeId)],
);

export const competitors = pgTable(
  "competitors",
  {
    id: id(),
    storeId: storeId(),
    name: text("name").notNull(),
    handle: text("handle"),
  },
  (table) => [
    index("competitors_store_id_idx").on(table.storeId),
    storeMembersPolicy(table.storeId),
  ],
);

export const diagnostics = pgTable(
  "diagnostics",
  {
    id: id(),
    storeId: storeId(),
    score: smallint("score").notNull(),
    consistencyScore: smallint("consistency_score").notNull(),
    contentScore: smallint("content_score").notNull(),
    offerScore: smallint("offer_score").notNull(),
    strengths: text("strengths")
      .array()
      .notNull()
      .default(sql`'{}'`),
    attentionPoints: text("attention_points")
      .array()
      .notNull()
      .default(sql`'{}'`),
    opportunities: text("opportunities")
      .array()
      .notNull()
      .default(sql`'{}'`),
    sources: jsonb("sources").notNull().default({}),
    isBaseline: boolean("is_baseline").notNull().default(false),
    createdAt: createdAt(),
  },
  (table) => [
    index("diagnostics_store_id_idx").on(table.storeId),
    check("diagnostics_score_check", isScore(table.score)),
    check(
      "diagnostics_consistency_score_check",
      isScore(table.consistencyScore),
    ),
    check("diagnostics_content_score_check", isScore(table.contentScore)),
    check("diagnostics_offer_score_check", isScore(table.offerScore)),
    storeMembersReadPolicy(table.storeId),
  ],
);

export const plans = pgTable(
  "plans",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    monthlyArtLimit: integer("monthly_art_limit"),
    priceCents: integer("price_cents").notNull().default(0),
  },
  (table) => [
    check("plans_price_cents_check", sql`${table.priceCents} >= 0`),
    check(
      "plans_monthly_art_limit_check",
      sql`${table.monthlyArtLimit} is null or ${table.monthlyArtLimit} >= 0`,
    ),
    readPolicy("planos visíveis", sql`true`),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: id(),
    storeId: storeId().unique(),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: subscriptionStatusEnum("status").notNull().default("trialing"),
    trialArtLimit: integer("trial_art_limit").notNull().default(3),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    providerCustomerId: text("provider_customer_id"),
    createdAt: createdAt(),
  },
  (table) => [
    index("subscriptions_plan_id_idx").on(table.planId),
    check(
      "subscriptions_trial_art_limit_check",
      sql`${table.trialArtLimit} >= 0`,
    ),
    readPolicy("membros veem a assinatura", isStoreMember(table.storeId)),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    userId: profileId("user_id"),
    storeId: storeId(),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull().default({}),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_store_id_idx").on(table.storeId),
    readPolicy("avisos próprios", isCurrentUser(table.userId)),
    pgPolicy("usuário marca aviso como lido", {
      for: "update",
      to: authenticatedRole,
      using: isCurrentUser(table.userId),
      withCheck: isCurrentUser(table.userId),
    }),
  ],
);

export const brandKits = pgTable(
  "brand_kits",
  {
    id: id(),
    storeId: storeId(),
    version: integer("version").notNull(),
    isCurrent: boolean("is_current").notNull().default(false),
    source: brandKitSourceEnum("source").notNull().default("guiado"),
    imageStyle: imageStyleEnum("image_style"),
    completeness: smallint("completeness").notNull().default(0),
    createdBy: profileId("created_by"),
    createdAt: createdAt(),
  },
  (table) => [
    unique("brand_kits_store_id_version_unique").on(
      table.storeId,
      table.version,
    ),
    index("brand_kits_store_id_idx").on(table.storeId),
    index("brand_kits_created_by_idx").on(table.createdBy),
    uniqueIndex("brand_kits_one_current")
      .on(table.storeId)
      .where(sql`${table.isCurrent}`),
    check("brand_kits_version_check", sql`${table.version} >= 1`),
    check("brand_kits_completeness_check", sql`${table.completeness} >= 0`),
    storeMembersPolicy(table.storeId),
  ],
);

export const brandAssets = pgTable(
  "brand_assets",
  {
    id: id(),
    brandKitId: brandKitId(),
    kind: brandAssetKindEnum("kind").notNull(),
    storagePath: text("storage_path").notNull(),
    mimeType: text("mime_type").notNull(),
    width: integer("width"),
    height: integer("height"),
    isGenerated: boolean("is_generated").notNull().default(false),
    status: assetStatusEnum("status").notNull().default("pendente"),
    validation: jsonb("validation").notNull().default({}),
    label: text("label"),
    createdAt: createdAt(),
  },
  (table) => [
    index("brand_assets_brand_kit_id_idx").on(table.brandKitId),
    check(
      "brand_assets_dimensions_check",
      sql`(${table.width} is null or ${table.width} > 0) and (${table.height} is null or ${table.height} > 0)`,
    ),
    ...brandKitOwnerPolicies(table.brandKitId),
  ],
);

export const brandColors = pgTable(
  "brand_colors",
  {
    id: id(),
    brandKitId: brandKitId(),
    role: colorRoleEnum("role").notNull(),
    name: text("name"),
    hex: char("hex", { length: 7 }).notNull(),
    position: smallint("position").notNull().default(0),
  },
  (table) => [
    index("brand_colors_brand_kit_id_idx").on(table.brandKitId),
    check("brand_colors_hex_check", sql`${table.hex} ~ '^#[0-9A-Fa-f]{6}$'`),
    ...brandKitOwnerPolicies(table.brandKitId),
  ],
);

export const brandFonts = pgTable(
  "brand_fonts",
  {
    id: id(),
    brandKitId: brandKitId(),
    role: fontRoleEnum("role").notNull(),
    family: text("family").notNull(),
    source: fontSourceEnum("source").notNull(),
    assetId: uuid("asset_id").references(() => brandAssets.id, {
      onDelete: "set null",
    }),
    weights: integer("weights")
      .array()
      .notNull()
      .default(sql`'{400}'`),
    licenseConfirmed: boolean("license_confirmed").notNull().default(false),
  },
  (table) => [
    unique("brand_fonts_brand_kit_id_role_unique").on(
      table.brandKitId,
      table.role,
    ),
    index("brand_fonts_brand_kit_id_idx").on(table.brandKitId),
    index("brand_fonts_asset_id_idx").on(table.assetId),
    check(
      "brand_fonts_upload_asset_check",
      sql`${table.source} <> 'upload' or ${table.assetId} is not null`,
    ),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const brandLayouts = pgTable(
  "brand_layouts",
  {
    id: id(),
    brandKitId: brandKitId(),
    name: text("name").notNull(),
    format: contentFormatEnum("format").notNull(),
    sourceAssetId: uuid("source_asset_id").references(() => brandAssets.id, {
      onDelete: "set null",
    }),
    structure: jsonb("structure").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index("brand_layouts_brand_kit_id_idx").on(table.brandKitId),
    index("brand_layouts_source_asset_id_idx").on(table.sourceAssetId),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const brandVoice = pgTable(
  "brand_voice",
  {
    brandKitId: uuid("brand_kit_id")
      .primaryKey()
      .references(() => brandKits.id, { onDelete: "cascade" }),
    formalCasual: smallint("formal_casual").notNull(),
    seriousFun: smallint("serious_fun").notNull(),
    technicalSimple: smallint("technical_simple").notNull(),
    educationalSales: smallint("educational_sales").notNull(),
    toneLabel: text("tone_label"),
    sampleCaption: text("sample_caption"),
    sampleApproved: boolean("sample_approved").notNull().default(false),
  },
  (table) => [
    check("brand_voice_formal_casual_check", isScore(table.formalCasual)),
    check("brand_voice_serious_fun_check", isScore(table.seriousFun)),
    check("brand_voice_technical_simple_check", isScore(table.technicalSimple)),
    check(
      "brand_voice_educational_sales_check",
      isScore(table.educationalSales),
    ),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const brandTerms = pgTable(
  "brand_terms",
  {
    id: id(),
    brandKitId: brandKitId(),
    kind: termKindEnum("kind").notNull(),
    term: text("term").notNull(),
  },
  (table) => [
    index("brand_terms_brand_kit_id_idx").on(table.brandKitId),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const personas = pgTable(
  "personas",
  {
    id: id(),
    brandKitId: brandKitId(),
    name: text("name").notNull(),
    age: smallint("age"),
    description: text("description").notNull(),
    confirmed: boolean("confirmed").notNull().default(false),
  },
  (table) => [
    index("personas_brand_kit_id_idx").on(table.brandKitId),
    check(
      "personas_age_check",
      sql`${table.age} is null or ${table.age} between 0 and 120`,
    ),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const brandRules = pgTable(
  "brand_rules",
  {
    id: id(),
    brandKitId: brandKitId(),
    rule: text("rule").notNull(),
    source: ruleSourceEnum("source").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index("brand_rules_brand_kit_id_idx").on(table.brandKitId),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const brandArtRules = pgTable(
  "brand_art_rules",
  {
    id: id(),
    brandKitId: brandKitId(),
    rule: text("rule").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAt(),
  },
  (table) => [
    index("brand_art_rules_brand_kit_id_idx").on(table.brandKitId),
    check(
      "brand_art_rules_rule_check",
      sql`char_length(${table.rule}) between 1 and 500`,
    ),
    ...brandKitOwnerPolicies(table.brandKitId),
  ],
);

export const brandRestrictions = pgTable(
  "brand_restrictions",
  {
    id: id(),
    brandKitId: brandKitId(),
    kind: restrictionKindEnum("kind").notNull(),
    value: text("value").notNull(),
  },
  (table) => [
    index("brand_restrictions_brand_kit_id_idx").on(table.brandKitId),
    brandKitMembersPolicy(table.brandKitId),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: id(),
    storeId: storeId(),
    userId: profileId("user_id"),
    title: text("title").notNull().default("Nova conversa"),
    tag: text("tag"),
    pinned: boolean("pinned").notNull().default(false),
    archived: boolean("archived").notNull().default(false),
    nextSteps: jsonb("next_steps").notNull().default([]),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: createdAt(),
  },
  (table) => [
    index("conversations_store_id_idx").on(table.storeId),
    index("conversations_user_id_idx").on(table.userId),
    storeMembersPolicy(table.storeId),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: id(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    payload: jsonb("payload"),
    attachments: jsonb("attachments").notNull().default([]),
    createdAt: createdAt(),
  },
  (table) => {
    const conversationCheck = parentStoreCheck({
      parentTable: conversations,
      parentId: conversations.id,
      parentStoreId: conversations.storeId,
      foreignKey: table.conversationId,
    });

    return [
      index("messages_conversation_id_idx").on(table.conversationId),
      readPolicy("membros leem", conversationCheck),
      pgPolicy("membros enviam mensagens", {
        for: "insert",
        to: authenticatedRole,
        withCheck: sql`${table.role} = 'user' and ${conversationCheck}`,
      }),
    ];
  },
);

export const agentMemories = pgTable(
  "agent_memories",
  {
    id: id(),
    storeId: storeId(),
    kind: memoryKindEnum("kind").notNull(),
    content: text("content").notNull(),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "set null",
    }),
    confirmed: boolean("confirmed").notNull().default(true),
    active: boolean("active").notNull().default(true),
    createdAt: createdAt(),
  },
  (table) => [
    index("agent_memories_store_id_idx").on(table.storeId),
    index("agent_memories_conversation_id_idx").on(table.conversationId),
    storeMembersPolicy(table.storeId),
  ],
);

export const calendarDates = pgTable(
  "calendar_dates",
  {
    id: id(),
    storeId: uuid("store_id").references(() => stores.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    date: date("date").notNull(),
    kind: dateKindEnum("kind").notNull(),
    segment: text("segment"),
    notes: text("notes"),
  },
  (table) => [
    index("calendar_dates_store_id_idx").on(table.storeId),
    readPolicy(
      "datas globais e da loja",
      sql`${table.storeId} is null or ${isStoreMember(table.storeId)}`,
    ),
    fullAccessPolicy(
      "loja gerencia suas datas",
      sql`${table.storeId} is not null and ${isStoreMember(table.storeId)}`,
    ),
  ],
);

export const ideas = pgTable(
  "ideas",
  {
    id: id(),
    storeId: storeId(),
    parentIdeaId: uuid("parent_idea_id").references(
      (): AnyPgColumn => ideas.id,
      {
        onDelete: "set null",
      },
    ),
    requestId: uuid("request_id").references(() => ideaRequests.id, {
      onDelete: "set null",
    }),
    calendarDateId: uuid("calendar_date_id").references(
      () => calendarDates.id,
      {
        onDelete: "set null",
      },
    ),
    personaId: uuid("persona_id").references(() => personas.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    format: contentFormatEnum("format").notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    goal: contentGoalEnum("goal").notNull(),
    funnelStage: funnelStageEnum("funnel_stage").notNull(),
    audience: text("audience"),
    why: text("why").notNull(),
    howToUse: text("how_to_use").notNull(),
    steps: jsonb("steps").notNull().default([]),
    captionExample: text("caption_example"),
    bestTime: text("best_time"),
    recommended: boolean("recommended").notNull().default(false),
    source: ideaSourceEnum("source").notNull().default("gerada"),
    variationTone: text("variation_tone"),
    createdAt: createdAt(),
  },
  (table) => [
    index("ideas_store_id_idx").on(table.storeId),
    index("ideas_parent_idea_id_idx").on(table.parentIdeaId),
    index("ideas_request_id_idx").on(table.requestId),
    index("ideas_calendar_date_id_idx").on(table.calendarDateId),
    index("ideas_persona_id_idx").on(table.personaId),
    index("ideas_store_id_goal_format_idx").on(
      table.storeId,
      table.goal,
      table.format,
    ),
    storeMembersPolicy(table.storeId),
  ],
);

export const ideaSaves = pgTable(
  "idea_saves",
  {
    ideaId: uuid("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.ideaId, table.userId] }),
    index("idea_saves_user_id_idx").on(table.userId),
    fullAccessPolicy(
      "salvos próprios",
      sql`${isCurrentUser(table.userId)} and ${parentStoreCheck({
        parentTable: ideas,
        parentId: ideas.id,
        parentStoreId: ideas.storeId,
        foreignKey: table.ideaId,
      })}`,
    ),
  ],
);

export const ideaRequests = pgTable(
  "idea_requests",
  {
    id: id(),
    storeId: storeId(),
    requestedBy: profileId("requested_by"),
    theme: text("theme"),
    calendarDateId: uuid("calendar_date_id").references(
      () => calendarDates.id,
      { onDelete: "set null" },
    ),
    goal: contentGoalEnum("goal"),
    formats: contentFormatEnum("formats")
      .array()
      .notNull()
      .default(sql`'{}'`),
    contentTypes: contentTypeEnum("content_types")
      .array()
      .notNull()
      .default(sql`'{}'`),
    quantity: smallint("quantity").notNull().default(6),
    status: jobStatusEnum("status").notNull().default("pendente"),
    createdAt: createdAt(),
  },
  (table) => [
    index("idea_requests_store_id_idx").on(table.storeId),
    index("idea_requests_calendar_date_id_idx").on(table.calendarDateId),
    index("idea_requests_requested_by_idx").on(table.requestedBy),
    check(
      "idea_requests_quantity_check",
      sql`${table.quantity} between 1 and 50`,
    ),
    readPolicy("membros leem", isStoreMember(table.storeId)),
    pgPolicy("membros pedem ideias", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${isStoreMember(table.storeId)} and ${isCurrentUser(table.requestedBy)}`,
    }),
  ],
);

export const contentPlans = pgTable(
  "content_plans",
  {
    id: id(),
    storeId: storeId(),
    month: date("month").notNull(),
    weeklyFrequency: text("weekly_frequency").notNull(),
    focusWeekdays: smallint("focus_weekdays").array().notNull(),
    includeDateIds: uuid("include_date_ids")
      .array()
      .notNull()
      .default(sql`'{}'`),
    useSavedIdeas: boolean("use_saved_ideas").notNull().default(true),
    rationale: jsonb("rationale").notNull().default({}),
    status: planStatusEnum("status").notNull().default("sugerido"),
    approvedBy: optionalProfileId("approved_by"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [
    unique("content_plans_store_id_month_unique").on(
      table.storeId,
      table.month,
    ),
    index("content_plans_store_id_idx").on(table.storeId),
    index("content_plans_approved_by_idx").on(table.approvedBy),
    check(
      "content_plans_month_check",
      sql`${table.month} = date_trunc('month', ${table.month})::date`,
    ),
    check(
      "content_plans_focus_weekdays_check",
      sql`${table.focusWeekdays} <@ '{0,1,2,3,4,5,6}'::smallint[]`,
    ),
    storeMembersPolicy(table.storeId),
  ],
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: id(),
    storeId: storeId(),
    name: text("name").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    goal: contentGoalEnum("goal").notNull(),
    calendarDateId: uuid("calendar_date_id").references(
      () => calendarDates.id,
      {
        onDelete: "set null",
      },
    ),
    formats: contentFormatEnum("formats")
      .array()
      .notNull()
      .default(sql`'{}'`),
    autoDistribute: boolean("auto_distribute").notNull().default(true),
    status: campaignStatusEnum("status").notNull().default("ativa"),
    createdAt: createdAt(),
  },
  (table) => [
    index("campaigns_store_id_idx").on(table.storeId),
    index("campaigns_calendar_date_id_idx").on(table.calendarDateId),
    check("campaigns_dates_check", sql`${table.endDate} >= ${table.startDate}`),
    storeMembersPolicy(table.storeId),
  ],
);

export const contents = pgTable(
  "contents",
  {
    id: id(),
    storeId: storeId(),
    planId: uuid("plan_id").references(() => contentPlans.id, {
      onDelete: "set null",
    }),
    campaignId: uuid("campaign_id").references(() => campaigns.id, {
      onDelete: "set null",
    }),
    ideaId: uuid("idea_id").references(() => ideas.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    format: contentFormatEnum("format").notNull(),
    goal: contentGoalEnum("goal").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    status: contentStatusEnum("status").notNull().default("ideia"),
    origin: contentOriginEnum("origin").notNull().default("usuario"),
    whyThisDay: text("why_this_day"),
    caption: text("caption"),
    currentArtworkId: uuid("current_artwork_id").references(
      (): AnyPgColumn => artworks.id,
      { onDelete: "set null" },
    ),
    socialAccountId: uuid("social_account_id").references(
      () => socialAccounts.id,
      {
        onDelete: "set null",
      },
    ),
    externalPostId: text("external_post_id"),
    permalink: text("permalink"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: profileId("created_by"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("contents_social_account_id_external_post_id_unique").on(
      table.socialAccountId,
      table.externalPostId,
    ),
    index("contents_store_id_idx").on(table.storeId),
    index("contents_plan_id_idx").on(table.planId),
    index("contents_campaign_id_idx").on(table.campaignId),
    index("contents_idea_id_idx").on(table.ideaId),
    index("contents_current_artwork_id_idx").on(table.currentArtworkId),
    index("contents_social_account_id_idx").on(table.socialAccountId),
    index("contents_created_by_idx").on(table.createdBy),
    index("contents_store_id_scheduled_at_idx").on(
      table.storeId,
      table.scheduledAt,
    ),
    index("contents_store_id_status_idx").on(table.storeId, table.status),
    storeMembersPolicy(table.storeId),
  ],
);

export const contentStatusHistory = pgTable(
  "content_status_history",
  {
    id: id(),
    contentId: uuid("content_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    fromStatus: contentStatusEnum("from_status"),
    toStatus: contentStatusEnum("to_status").notNull(),
    changedBy: optionalProfileId("changed_by"),
    changedAt: timestamp("changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("content_status_history_content_id_idx").on(table.contentId),
    index("content_status_history_changed_by_idx").on(table.changedBy),
    readPolicy(
      "membros leem",
      parentStoreCheck({
        parentTable: contents,
        parentId: contents.id,
        parentStoreId: contents.storeId,
        foreignKey: table.contentId,
      }),
    ),
  ],
);

export const artworks = pgTable(
  "artworks",
  {
    id: id(),
    storeId: storeId(),
    contentId: uuid("content_id").references((): AnyPgColumn => contents.id, {
      onDelete: "set null",
    }),
    brandKitId: brandKitId(),
    layoutId: uuid("layout_id").references(() => brandLayouts.id, {
      onDelete: "set null",
    }),
    prompt: text("prompt"),
    format: contentFormatEnum("format").notNull(),
    status: artworkStatusEnum("status").notNull().default("rascunho"),
    approvedBy: optionalProfileId("approved_by"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdBy: profileId("created_by"),
    createdAt: createdAt(),
  },
  (table) => [
    index("artworks_store_id_idx").on(table.storeId),
    index("artworks_content_id_idx").on(table.contentId),
    index("artworks_brand_kit_id_idx").on(table.brandKitId),
    index("artworks_layout_id_idx").on(table.layoutId),
    index("artworks_approved_by_idx").on(table.approvedBy),
    index("artworks_created_by_idx").on(table.createdBy),
    storeMembersPolicy(table.storeId),
  ],
);

export const artworkVersions = pgTable(
  "artwork_versions",
  {
    id: id(),
    artworkId: uuid("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    layers: jsonb("layers").notNull(),
    renderPath: text("render_path"),
    caption: text("caption"),
    author: authorKindEnum("author").notNull().default("agente"),
    createdAt: createdAt(),
  },
  (table) => [
    unique("artwork_versions_artwork_id_version_unique").on(
      table.artworkId,
      table.version,
    ),
    index("artwork_versions_artwork_id_idx").on(table.artworkId),
    check("artwork_versions_version_check", sql`${table.version} >= 1`),
    fullAccessPolicy(
      "membros da loja",
      parentStoreCheck({
        parentTable: artworks,
        parentId: artworks.id,
        parentStoreId: artworks.storeId,
        foreignKey: table.artworkId,
      }),
    ),
  ],
);

export const artworkSlides = pgTable(
  "artwork_slides",
  {
    id: id(),
    artworkId: uuid("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    version: integer("version").notNull().default(1),
    renderPath: text("render_path").notNull(),
    copy: jsonb("copy").notNull(),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("artwork_slides_artwork_id_position_unique").on(
      table.artworkId,
      table.position,
    ),
    index("artwork_slides_artwork_id_idx").on(table.artworkId),
    check(
      "artwork_slides_position_check",
      sql`${table.position} between 1 and 10`,
    ),
    check("artwork_slides_version_check", sql`${table.version} >= 1`),
    fullAccessPolicy(
      "membros da loja",
      parentStoreCheck({
        parentTable: artworks,
        parentId: artworks.id,
        parentStoreId: artworks.storeId,
        foreignKey: table.artworkId,
      }),
    ),
  ],
);

export const artUsage = pgTable(
  "art_usage",
  {
    id: id(),
    storeId: storeId(),
    artworkId: uuid("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    userId: profileId("user_id"),
    createdAt: createdAt(),
  },
  (table) => [
    index("art_usage_store_id_idx").on(table.storeId),
    index("art_usage_artwork_id_idx").on(table.artworkId),
    index("art_usage_user_id_idx").on(table.userId),
    storeMembersReadPolicy(table.storeId),
  ],
);

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id: id(),
    storeId: storeId(),
    provider: socialProviderEnum("provider").notNull(),
    externalId: text("external_id").notNull(),
    providerUserId: text("provider_user_id"),
    handle: text("handle"),
    tokenSecretId: uuid("token_secret_id"),
    status: connectionStatusEnum("status").notNull().default("conectado"),
    accountType: text("account_type"),
    scopes: text("scopes").array().notNull().default([]),
    lastError: text("last_error"),
    connectedBy: optionalProfileId("connected_by"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("social_accounts_store_id_provider_unique").on(
      table.storeId,
      table.provider,
    ),
    index("social_accounts_store_id_idx").on(table.storeId),
    storeMembersReadPolicy(table.storeId),
  ],
);

export const socialAccountTokens = pgTable(
  "social_account_tokens",
  {
    socialAccountId: uuid("social_account_id")
      .primaryKey()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    accessTokenEncrypted: text("access_token_encrypted").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    refreshedAt: timestamp("refreshed_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("social_account_tokens_expires_at_idx").on(table.expiresAt),
  ],
).enableRLS();

export const metricSnapshots = pgTable(
  "metric_snapshots",
  {
    socialAccountId: uuid("social_account_id")
      .notNull()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    storeId: storeId(),
    account: jsonb("account").notNull().default({}),
    posts: jsonb("posts").notNull().default({}),
    audience: jsonb("audience"),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.socialAccountId, table.day] }),
    index("metric_snapshots_store_id_idx").on(table.storeId),
    index("metric_snapshots_store_id_day_idx").on(
      table.storeId,
      table.day.desc(),
    ),
    storeMembersReadPolicy(table.storeId),
  ],
);

export const storeArtUsage = pgView("store_art_usage")
  .with({ securityInvoker: true })
  .as((queryBuilder) =>
    queryBuilder
      .select({
        storeId: subscriptions.storeId,
        artsUsed: sql<number>`count(${artUsage.id})::int`.as("arts_used"),
        trialArtLimit: subscriptions.trialArtLimit,
      })
      .from(subscriptions)
      .leftJoin(artUsage, eq(artUsage.storeId, subscriptions.storeId))
      .groupBy(subscriptions.storeId, subscriptions.trialArtLimit),
  );

export const profilesRelations = relations(profiles, ({ many }) => ({
  storeMembers: many(storeMembers),
  notifications: many(notifications),
  ideaSaves: many(ideaSaves),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [stores.createdBy],
    references: [profiles.id],
  }),
  members: many(storeMembers),
  products: many(storeProducts),
  positioning: one(storePositioning),
  competitors: many(competitors),
  diagnostics: many(diagnostics),
  subscription: one(subscriptions),
  notifications: many(notifications),
  brandKits: many(brandKits),
  conversations: many(conversations),
  agentMemories: many(agentMemories),
  calendarDates: many(calendarDates),
  ideas: many(ideas),
  ideaRequests: many(ideaRequests),
  contentPlans: many(contentPlans),
  campaigns: many(campaigns),
  contents: many(contents),
  artworks: many(artworks),
  artUsage: many(artUsage),
  socialAccounts: many(socialAccounts),
  metricSnapshots: many(metricSnapshots),
}));

export const storeMembersRelations = relations(storeMembers, ({ one }) => ({
  store: one(stores, {
    fields: [storeMembers.storeId],
    references: [stores.id],
  }),
  user: one(profiles, {
    fields: [storeMembers.userId],
    references: [profiles.id],
  }),
}));

export const storeProductsRelations = relations(storeProducts, ({ one }) => ({
  store: one(stores, {
    fields: [storeProducts.storeId],
    references: [stores.id],
  }),
}));

export const storePositioningRelations = relations(
  storePositioning,
  ({ one }) => ({
    store: one(stores, {
      fields: [storePositioning.storeId],
      references: [stores.id],
    }),
  }),
);

export const competitorsRelations = relations(competitors, ({ one }) => ({
  store: one(stores, {
    fields: [competitors.storeId],
    references: [stores.id],
  }),
}));

export const diagnosticsRelations = relations(diagnostics, ({ one }) => ({
  store: one(stores, {
    fields: [diagnostics.storeId],
    references: [stores.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  store: one(stores, {
    fields: [subscriptions.storeId],
    references: [stores.id],
  }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
  store: one(stores, {
    fields: [notifications.storeId],
    references: [stores.id],
  }),
}));

export const brandKitsRelations = relations(brandKits, ({ one, many }) => ({
  store: one(stores, { fields: [brandKits.storeId], references: [stores.id] }),
  creator: one(profiles, {
    fields: [brandKits.createdBy],
    references: [profiles.id],
  }),
  assets: many(brandAssets),
  colors: many(brandColors),
  fonts: many(brandFonts),
  layouts: many(brandLayouts),
  voice: one(brandVoice),
  terms: many(brandTerms),
  personas: many(personas),
  rules: many(brandRules),
  artRules: many(brandArtRules),
  restrictions: many(brandRestrictions),
  artworks: many(artworks),
}));

export const brandAssetsRelations = relations(brandAssets, ({ one, many }) => ({
  brandKit: one(brandKits, {
    fields: [brandAssets.brandKitId],
    references: [brandKits.id],
  }),
  fonts: many(brandFonts),
  layouts: many(brandLayouts),
}));

export const brandColorsRelations = relations(brandColors, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandColors.brandKitId],
    references: [brandKits.id],
  }),
}));

export const brandFontsRelations = relations(brandFonts, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandFonts.brandKitId],
    references: [brandKits.id],
  }),
  asset: one(brandAssets, {
    fields: [brandFonts.assetId],
    references: [brandAssets.id],
  }),
}));

export const brandLayoutsRelations = relations(
  brandLayouts,
  ({ one, many }) => ({
    brandKit: one(brandKits, {
      fields: [brandLayouts.brandKitId],
      references: [brandKits.id],
    }),
    sourceAsset: one(brandAssets, {
      fields: [brandLayouts.sourceAssetId],
      references: [brandAssets.id],
    }),
    artworks: many(artworks),
  }),
);

export const brandVoiceRelations = relations(brandVoice, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandVoice.brandKitId],
    references: [brandKits.id],
  }),
}));

export const brandTermsRelations = relations(brandTerms, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandTerms.brandKitId],
    references: [brandKits.id],
  }),
}));

export const personasRelations = relations(personas, ({ one, many }) => ({
  brandKit: one(brandKits, {
    fields: [personas.brandKitId],
    references: [brandKits.id],
  }),
  ideas: many(ideas),
}));

export const brandRulesRelations = relations(brandRules, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandRules.brandKitId],
    references: [brandKits.id],
  }),
}));

export const brandArtRulesRelations = relations(brandArtRules, ({ one }) => ({
  brandKit: one(brandKits, {
    fields: [brandArtRules.brandKitId],
    references: [brandKits.id],
  }),
}));

export const brandRestrictionsRelations = relations(
  brandRestrictions,
  ({ one }) => ({
    brandKit: one(brandKits, {
      fields: [brandRestrictions.brandKitId],
      references: [brandKits.id],
    }),
  }),
);

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [conversations.storeId],
      references: [stores.id],
    }),
    user: one(profiles, {
      fields: [conversations.userId],
      references: [profiles.id],
    }),
    messages: many(messages),
    agentMemories: many(agentMemories),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const agentMemoriesRelations = relations(agentMemories, ({ one }) => ({
  store: one(stores, {
    fields: [agentMemories.storeId],
    references: [stores.id],
  }),
  conversation: one(conversations, {
    fields: [agentMemories.conversationId],
    references: [conversations.id],
  }),
}));

export const calendarDatesRelations = relations(
  calendarDates,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [calendarDates.storeId],
      references: [stores.id],
    }),
    ideas: many(ideas),
    campaigns: many(campaigns),
  }),
);

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  store: one(stores, { fields: [ideas.storeId], references: [stores.id] }),
  parentIdea: one(ideas, {
    fields: [ideas.parentIdeaId],
    references: [ideas.id],
    relationName: "ideaVersions",
  }),
  versions: many(ideas, { relationName: "ideaVersions" }),
  request: one(ideaRequests, {
    fields: [ideas.requestId],
    references: [ideaRequests.id],
  }),
  calendarDate: one(calendarDates, {
    fields: [ideas.calendarDateId],
    references: [calendarDates.id],
  }),
  persona: one(personas, {
    fields: [ideas.personaId],
    references: [personas.id],
  }),
  saves: many(ideaSaves),
  contents: many(contents),
}));

export const ideaSavesRelations = relations(ideaSaves, ({ one }) => ({
  idea: one(ideas, { fields: [ideaSaves.ideaId], references: [ideas.id] }),
  user: one(profiles, {
    fields: [ideaSaves.userId],
    references: [profiles.id],
  }),
}));

export const ideaRequestsRelations = relations(
  ideaRequests,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [ideaRequests.storeId],
      references: [stores.id],
    }),
    requester: one(profiles, {
      fields: [ideaRequests.requestedBy],
      references: [profiles.id],
    }),
    ideas: many(ideas),
  }),
);

export const contentPlansRelations = relations(
  contentPlans,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [contentPlans.storeId],
      references: [stores.id],
    }),
    approver: one(profiles, {
      fields: [contentPlans.approvedBy],
      references: [profiles.id],
    }),
    contents: many(contents),
  }),
);

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  store: one(stores, { fields: [campaigns.storeId], references: [stores.id] }),
  calendarDate: one(calendarDates, {
    fields: [campaigns.calendarDateId],
    references: [calendarDates.id],
  }),
  contents: many(contents),
}));

export const contentsRelations = relations(contents, ({ one, many }) => ({
  store: one(stores, { fields: [contents.storeId], references: [stores.id] }),
  plan: one(contentPlans, {
    fields: [contents.planId],
    references: [contentPlans.id],
  }),
  campaign: one(campaigns, {
    fields: [contents.campaignId],
    references: [campaigns.id],
  }),
  idea: one(ideas, { fields: [contents.ideaId], references: [ideas.id] }),
  currentArtwork: one(artworks, {
    fields: [contents.currentArtworkId],
    references: [artworks.id],
    relationName: "contentCurrentArtwork",
  }),
  socialAccount: one(socialAccounts, {
    fields: [contents.socialAccountId],
    references: [socialAccounts.id],
  }),
  creator: one(profiles, {
    fields: [contents.createdBy],
    references: [profiles.id],
  }),
  artworks: many(artworks, { relationName: "contentArtworks" }),
  statusHistory: many(contentStatusHistory),
}));

export const contentStatusHistoryRelations = relations(
  contentStatusHistory,
  ({ one }) => ({
    content: one(contents, {
      fields: [contentStatusHistory.contentId],
      references: [contents.id],
    }),
    changer: one(profiles, {
      fields: [contentStatusHistory.changedBy],
      references: [profiles.id],
    }),
  }),
);

export const artworksRelations = relations(artworks, ({ one, many }) => ({
  store: one(stores, { fields: [artworks.storeId], references: [stores.id] }),
  content: one(contents, {
    fields: [artworks.contentId],
    references: [contents.id],
    relationName: "contentArtworks",
  }),
  brandKit: one(brandKits, {
    fields: [artworks.brandKitId],
    references: [brandKits.id],
  }),
  layout: one(brandLayouts, {
    fields: [artworks.layoutId],
    references: [brandLayouts.id],
  }),
  approver: one(profiles, {
    fields: [artworks.approvedBy],
    references: [profiles.id],
    relationName: "artworkApprover",
  }),
  creator: one(profiles, {
    fields: [artworks.createdBy],
    references: [profiles.id],
    relationName: "artworkCreator",
  }),
  currentInContents: many(contents, { relationName: "contentCurrentArtwork" }),
  versions: many(artworkVersions),
  usage: many(artUsage),
}));

export const artworkVersionsRelations = relations(
  artworkVersions,
  ({ one }) => ({
    artwork: one(artworks, {
      fields: [artworkVersions.artworkId],
      references: [artworks.id],
    }),
  }),
);

export const artUsageRelations = relations(artUsage, ({ one }) => ({
  store: one(stores, { fields: [artUsage.storeId], references: [stores.id] }),
  artwork: one(artworks, {
    fields: [artUsage.artworkId],
    references: [artworks.id],
  }),
  user: one(profiles, { fields: [artUsage.userId], references: [profiles.id] }),
}));

export const socialAccountsRelations = relations(
  socialAccounts,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [socialAccounts.storeId],
      references: [stores.id],
    }),
    contents: many(contents),
    metricSnapshots: many(metricSnapshots),
  }),
);

export const metricSnapshotsRelations = relations(
  metricSnapshots,
  ({ one }) => ({
    socialAccount: one(socialAccounts, {
      fields: [metricSnapshots.socialAccountId],
      references: [socialAccounts.id],
    }),
    store: one(stores, {
      fields: [metricSnapshots.storeId],
      references: [stores.id],
    }),
  }),
);

# Ideias reais (banco, geração com IA, datas e favoritos) — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar os mocks de `app/app/ideias` pelo banco, gerar ideias com `LUNA_MODEL` a partir dos dados da empresa e implementar "Gerar novas ideias", datas do calendário e favoritos.

**Architecture:** O código monta os "slots" de cada ideia (formato, objetivo, etapa do funil, tipo e data), o que garante a mistura por construção. O modelo preenche só o texto de cada slot via structured outputs (`zodResponseFormat`). A pós-validação reaproveita `lib/caption/lint.ts`, e as reprovadas ganham 1 nova tentativa. Leitura e favoritos usam server actions + React Query, com atualização otimista.

**Tech Stack:** Next.js 16 App Router, Drizzle + Postgres (Supabase), Zod 4.6, `openai` 7.45 (`openai/helpers/zod`, compatível com zod v4), React Query, React Hook Form, `node --test`.

**Spec:** pedido do usuário de 29/10/2026 nesta conversa (seções 1 a 7 + "Entrega").

## Global Constraints

- Seguir o CLAUDE.md: kebab-case, nomes em inglês, textos de UI em PT-BR, sem comentários, React Hook Form + Zod em formulários, actions em `actions/<nome>/{index,schema}.ts`, hooks com função de query key e mutation key.
- Nenhuma alteração no banco sem aprovação (Task 1 só roda depois do "ok").
- Modelo: `LUNA_MODEL` de `lib/ai/models.ts`. Prompt em inglês, saída em PT-BR.
- Geração inicial: 9 ideias, `source = "biblioteca"`. "Gerar novas": 1 a 12, `source = "gerada"`.
- Aviso do dialog, literal: "As novas ideias vão substituir as atuais. Suas ideias salvas nos favoritos continuam guardadas."
- Título até 60 caracteres. Legenda: primeira frase ≤ 125 caracteres, no máximo 1 CTA, no máximo 5 hashtags, sem termos proibidos.
- Ideia favoritada (qualquer linha em `idea_saves`) nunca é apagada.
- Módulos testados com `node --test` usam import relativo com extensão `.ts` e não importam `server-only` (padrão de `lib/caption/lint.test.ts`).
- Manter o visual atual da página.

## Review Focus

1. **Duas abas abertas sem ideias** disparam a geração inicial duas vezes: a segunda chamada deve ver o `idea_requests` em `processando` e não gerar de novo (teste na Task 6).
2. **Tema com data que já passou neste ano** ("Dia das Mães" em outubro): deve resolver para a próxima ocorrência, no ano seguinte (teste na Task 3).
3. **Loja sem produtos, personas ou brand_rules**: o prompt não pode quebrar nem inventar produtos; seções vazias somem (teste na Task 4).
4. **Modelo devolve menos itens, ou slots fora de ordem**: casar por `slot`, tratar o que falta como reprovado e re-tentar (teste na Task 5).
5. **Ideia ligada a um conteúdo agendado** (`contents.idea_id`): a substituição não pode apagar, senão o agendamento perde o vínculo (teste na Task 2).

---

## Decisões de banco (precisam do seu ok)

**1. `idea_requests.calendar_date_id`** (FK `calendar_dates.id`, `on delete set null`, com índice).

**2. Substituição: apagar só as não protegidas** (recomendado, sem coluna nova). Apaga as ideias da loja que não têm linha em `idea_saves` e não estão ligadas a nenhum `contents.idea_id`. Recomendo isso em vez de `archived_at` porque arquivar obriga a filtrar todas as consultas de ideias e a tabela cresce sem uso. Um histórico de ideias antigas não faz parte da spec.

**3. Quantidade:** sem mudança. A action sempre grava `quantity` explícito (9 ou 1–12), e o default 6 e o check `1..50` continuam válidos.

**4. Datas globais.** `calendar_dates` está **vazia** no banco: 0 globais e 0 da loja (consultei em modo leitura). Sem datas, a faixa "Datas e acontecimentos" fica vazia e a regra "≥1 ideia ligada à próxima data" nunca se aplica. Proposta: semear as datas comerciais nacionais de nov/2026 a dez/2027 como **globais** (`store_id null`), geradas a partir do mesmo dicionário da Task 3, com a lista exata na migration para revisão. Datas fora dessa janela são criadas sob demanda para a loja.

```diff
 export const ideaRequests = pgTable(
   "idea_requests",
   {
     ...
     theme: text("theme"),
+    calendarDateId: uuid("calendar_date_id").references(
+      () => calendarDates.id,
+      { onDelete: "set null" },
+    ),
     goal: contentGoalEnum("goal"),
     ...
   },
   (table) => [
     index("idea_requests_store_id_idx").on(table.storeId),
+    index("idea_requests_calendar_date_id_idx").on(table.calendarDateId),
```

```sql
-- 0008_idea_requests_calendar_date.sql (gerada pelo drizzle-kit)
ALTER TABLE "idea_requests" ADD COLUMN "calendar_date_id" uuid;
ALTER TABLE "idea_requests" ADD CONSTRAINT "idea_requests_calendar_date_id_calendar_dates_id_fk"
  FOREIGN KEY ("calendar_date_id") REFERENCES "public"."calendar_dates"("id") ON DELETE set null;
CREATE INDEX "idea_requests_calendar_date_id_idx" ON "idea_requests" USING btree ("calendar_date_id");

-- 0009_seed_calendar_dates.sql (custom, só INSERT)
INSERT INTO "calendar_dates" ("name", "date", "kind") VALUES
  ('Black Friday', '2026-11-27', 'data_comercial'),
  ('Cyber Monday', '2026-11-30', 'data_comercial'),
  ('Natal', '2026-12-25', 'feriado'),
  ('Ano Novo', '2027-01-01', 'feriado'),
  ('Carnaval', '2027-02-09', 'feriado'),
  ('Dia da Mulher', '2027-03-08', 'data_comercial'),
  ('Dia do Consumidor', '2027-03-15', 'data_comercial'),
  ('Páscoa', '2027-03-28', 'feriado'),
  ('Dia das Mães', '2027-05-09', 'data_comercial'),
  ('Dia dos Namorados', '2027-06-12', 'data_comercial'),
  ('Dia dos Pais', '2027-08-08', 'data_comercial'),
  ('Dia do Cliente', '2027-09-15', 'data_comercial'),
  ('Dia das Crianças', '2027-10-12', 'data_comercial'),
  ('Halloween', '2027-10-31', 'data_comercial'),
  ('Black Friday', '2027-11-26', 'data_comercial'),
  ('Cyber Monday', '2027-11-29', 'data_comercial'),
  ('Natal', '2027-12-25', 'feriado');
```

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `lib/content/content-labels.ts` (novo) | Tipos dos enums do banco (`ContentFormat`, `ContentType`, `ContentGoal`, `FunnelStage`) e os mapas de rótulos PT-BR. Absorve `formatLabels`/`goalLabels` de `plan-agenda-items.ts`. |
| `lib/ideas/idea-slots.ts` (novo) | `buildInitialSlots`, `buildRequestSlots`, `funnelStageByGoal`, `recommendedGoalByBusinessGoal`. Puro. |
| `lib/ideas/calendar-events.ts` (novo) | Dicionário de datas nacionais, `detectCalendarEvent`, `getNextOccurrence`. Puro. |
| `lib/ideas/validate-idea.ts` (novo) | Zod da saída do modelo, limpeza (`humanizeCaption`), checagens de título e legenda, `findSimilarTitle`. Puro. |
| `lib/ideas/idea-queries.ts` (novo) | Builders Drizzle que recebem o `db` como parâmetro: `selectStoreIdeas`, `deleteReplaceableIdeas`. Testável com `drizzle.mock()`. |
| `lib/ai/prompts/ideas.ts` (novo) | `IDEAS_SYSTEM_PROMPT` e `buildIdeasUserPrompt(context, slots)`. Puro. |
| `lib/ideas/get-ideas-data.ts` (novo, server-only) | Monta `IdeasData` (ideias, datas, salvas, pedido em andamento) da loja do usuário. |
| `lib/ideas/get-idea-context.ts` (novo, server-only) | Junta empresa, produtos, posicionamento, personas, voz, termos, brand_rules ativas e títulos atuais. |
| `lib/ideas/generate-ideas.ts` (novo, server-only) | Orquestra pedido → slots → modelo → validação → retry → substituição → insert. |
| `lib/ideas/resolve-calendar-date.ts` (novo, server-only) | Acha a data (global ou da loja) ou cria uma com `store_id`. |
| `actions/get-ideas`, `actions/toggle-idea-save`, `actions/generate-ideas` | `index.ts` + `schema.ts`. |
| `hooks/queries/use-ideas.ts`, `hooks/mutations/use-toggle-idea-save.ts`, `hooks/mutations/use-generate-ideas.ts` | React Query com funções de key. |
| `lib/caption/lint.ts` | Acrescenta os clichês novos em `CAPTION_CLICHES` (DRY, ver Dúvida 2). |
| `lib/rate-limit/index.ts` | Regra `generateIdeasByUser`. |
| `lib/validations/ideas.ts`, `lib/validations/agenda.ts`, `components/common/format-icons.ts`, `app/app/agenda/*`, `app/app/etapas/utils/plan-agenda-items.ts`, `lib/mocks/agenda.ts`, `lib/mocks/results.ts` | Trocar os rótulos dos mocks ("Reels") pelos valores dos enums ("reels") mais o mapa de rótulos. |
| `app/app/ideias/*` | Dados reais, favoritos, datas e dialog de gerar. |
| `lib/mocks/ideas.ts` | Fica só com o que continua mock: abordagens de versões, dias/horários de agendar e opções de preparo. |

---

### Task 1: Banco (só depois da aprovação)

**Files:**
- Modify: `db/schema.ts` (bloco `ideaRequests`, ~linha 976)
- Create: `db/migrations/0008_idea_requests_calendar_date.sql` (drizzle-kit), `db/migrations/0009_seed_calendar_dates.sql` (`npx drizzle-kit generate --custom --name seed_calendar_dates`)

- [ ] **Step 1:** Aplicar o diff de schema da seção "Decisões de banco".
- [ ] **Step 2:** `npx drizzle-kit generate --name idea_requests_calendar_date`. Esperado: o SQL de 0008 acima.
- [ ] **Step 3:** Gerar a migration custom 0009 e colar o `INSERT`. As datas vêm de `getNextOccurrence` (Task 3) e a lista é revisada contra o calendário.
- [ ] **Step 4:** `npx tsc --noEmit` sem erro novo. **Não** rodar `db:migrate`: o usuário aplica.
- [ ] **Step 5:** Commit `feat(db): link idea requests to calendar dates and seed national dates`.

### Task 2: Rótulos, tipos e leitura do banco

**Files:**
- Create: `lib/content/content-labels.ts`, `lib/ideas/idea-queries.ts`, `lib/ideas/idea-queries.test.ts`, `lib/ideas/get-ideas-data.ts`
- Modify: todos os consumidores de `lib/mocks/ideas` listados no mapa

**Interfaces:**
- Produces:
  - `type ContentFormat = (typeof contentFormatEnum.enumValues)[number]` e o mesmo para `ContentType`, `ContentGoal`, `FunnelStage`.
  - `formatLabels: Record<ContentFormat, string>` (`reels: "Reels"`, `carrossel: "Carrossel"`, `post: "Post"`, `story: "Story"`), e também `contentTypeLabels`, `goalLabels`, `funnelStageLabels` (`consideracao: "Consideração"`, `fidelizacao: "Fidelização"`).
  - `type IdeaView = { id: string; title: string; format: ContentFormat; contentType: ContentType; goal: ContentGoal; funnelStage: FunnelStage; audience: string | null; calendarDateId: string | null; isRecommended: boolean; why: string; howToUse: string; bestTime: string | null; steps: string[]; captionExample: string | null }`.
  - `type IdeaDateView = { id: string; name: string; date: string; daysUntil: number; isTrend: boolean; ideasCount: number }`.
  - `type IdeasData = { ideas: IdeaView[]; dates: IdeaDateView[]; savedIdeaIds: string[]; isGenerating: boolean }`.
  - `selectStoreIdeas(database, storeId)` e `deleteReplaceableIdeas(database, storeId)`, os dois devolvendo a query do Drizzle (sem executar).
  - `getIdeasData(): Promise<IdeasData>`. As datas são as globais mais as da loja, de hoje até +70 dias. `isTrend = kind === "tendencia"`.

- [ ] **Step 1: Teste que falha** em `lib/ideas/idea-queries.test.ts`, com `drizzle.mock()`:

```ts
test("selectStoreIdeas filtra pela loja: ideia da loja A não aparece para a loja B", () => {
  const { sql, params } = selectStoreIdeas(mockDb, "loja-b").toSQL();
  assert.match(sql, /where "ideas"\."store_id" = \$1/);
  assert.deepEqual(params, ["loja-b"]);
});

test("deleteReplaceableIdeas nunca apaga favoritada nem ideia usada em conteúdo", () => {
  const { sql, params } = deleteReplaceableIdeas(mockDb, "loja-a").toSQL();
  assert.match(sql, /"ideas"\."store_id" = \$1/);
  assert.match(sql, /not exists \(select .* from "idea_saves"/);
  assert.match(sql, /not exists \(select .* from "contents"/);
  assert.deepEqual(params, ["loja-a"]);
});
```

- [ ] **Step 2:** `node --test lib/ideas/idea-queries.test.ts`. Esperado: FAIL (módulo não existe).
- [ ] **Step 3:** Implementar `idea-queries.ts`, importando `../../db/schema.ts` (import relativo, para o test runner).
- [ ] **Step 4:** Rodar de novo. Esperado: PASS.
- [ ] **Step 5:** Criar `content-labels.ts` e trocar todos os usos de `ideaFormats`, `ideaGoals`, `ideaTypes`, `IdeaFormat` e `IdeaGoal` (agenda, etapas, validations, format-icons, mocks de agenda e resultados) pelos valores dos enums mais os rótulos. A tela continua mostrando os mesmos textos.
- [ ] **Step 6:** `npx tsc --noEmit` e `npx eslint app lib components`: sem erro novo.
- [ ] **Step 7:** Commit `refactor: use database content enums with PT-BR labels`.

### Task 3: Datas: dicionário e detecção

**Files:**
- Create: `lib/ideas/calendar-events.ts`, `lib/ideas/calendar-events.test.ts`, `lib/ideas/resolve-calendar-date.ts`

**Interfaces:**
- Produces:
  - `type CalendarEvent = { key: CalendarEventKey; name: string; kind: "feriado" | "data_comercial"; synonyms: string[] }`.
  - `calendarEvents: CalendarEvent[]` (as 13 datas do seed, com sinônimos: Black Friday → `["black friday", "bf", "blackfriday", "sexta negra"]`, Natal → `["natal", "noite de natal", "christmas"]`, Dia das Mães → `["dia das maes", "dia das mães", "maes"]` etc.).
  - `detectCalendarEvent(theme: string): CalendarEvent | null`: compara sem acento e por palavra inteira (`bf` não casa com "bfoo").
  - `getNextOccurrence(key: CalendarEventKey, from: Date): string`, que devolve `YYYY-MM-DD`. Regras: datas fixas (dia/mês); Dia das Mães = 2º domingo de maio; Dia dos Pais = 2º domingo de agosto; Black Friday = sexta depois da 4ª quinta de novembro; Cyber Monday = Black Friday + 3; Páscoa pelo algoritmo de Meeus; Carnaval = Páscoa − 47.
  - `resolveCalendarDate({ storeId, event, from }): Promise<{ id: string; name: string; date: string }>`: procura em `calendar_dates` (`store_id is null or store_id = storeId`, mesmo nome, mesma data) e, se não achar, insere com `store_id = storeId` e o `kind` do evento.

- [ ] **Step 1: Testes que falham:**

```ts
test("detecta Black Friday por nome e sinônimo", () => {
  assert.equal(detectCalendarEvent("ideias para a black friday")?.key, "black-friday");
  assert.equal(detectCalendarEvent("promo BF")?.key, "black-friday");
  assert.equal(detectCalendarEvent("cardápio de Natal")?.key, "natal");
  assert.equal(detectCalendarEvent("Dia das Maes")?.key, "dia-das-maes");
});

test("não detecta data em tema comum", () => {
  assert.equal(detectCalendarEvent("novo bolo de cenoura"), null);
  assert.equal(detectCalendarEvent("bfoo"), null);
});

test("próxima ocorrência pula para o ano seguinte quando a data já passou", () => {
  const october = new Date("2026-10-29T12:00:00-03:00");
  assert.equal(getNextOccurrence("dia-das-maes", october), "2027-05-09");
  assert.equal(getNextOccurrence("black-friday", october), "2026-11-27");
  assert.equal(getNextOccurrence("natal", october), "2026-12-25");
  assert.equal(getNextOccurrence("pascoa", october), "2027-03-28");
});
```

- [ ] **Step 2:** Rodar. Esperado: FAIL.
- [ ] **Step 3:** Implementar `calendar-events.ts`. Calcular as datas no fuso `America/Sao_Paulo`, como `app/app/estudio/utils/schedule-days.ts`.
- [ ] **Step 4:** Rodar. Esperado: PASS. Conferir as datas da migration 0009 com `getNextOccurrence`.
- [ ] **Step 5:** Implementar `resolve-calendar-date.ts`, sem teste unitário (é I/O). A cobertura vem do teste da Task 6.
- [ ] **Step 6:** Commit `feat(ideas): detect calendar events from themes`.

### Task 4: Slots e prompt

**Files:**
- Create: `lib/ideas/idea-slots.ts`, `lib/ideas/idea-slots.test.ts`, `lib/ai/prompts/ideas.ts`, `lib/ai/prompts/ideas.test.ts`

**Interfaces:**
- Produces:
  - `type IdeaSlot = { slot: number; format: ContentFormat; contentType: ContentType; goal: ContentGoal; funnelStage: FunnelStage; calendarDate: { id: string; name: string; date: string; daysUntil: number } | null }`.
  - `funnelStageByGoal: Record<ContentGoal, FunnelStage>` = `{ atrair: "descoberta", engajar: "consideracao", vender: "decisao", fidelizar: "fidelizacao" }`.
  - `buildInitialSlots(nextDate: IdeaSlot["calendarDate"]): IdeaSlot[]`, com 9 slots. Formatos em ordem fixa `["reels","carrossel","story","reels","post","carrossel","reels","story","post"]` (3 reels, como pede o ig-plan). Objetivos `["atrair","engajar","vender","fidelizar","atrair","vender","engajar","fidelizar","vender"]`. Tipos em ciclo `["educativo","comercial","autoridade","institucional"]`. Se houver `nextDate`, ela entra no slot de `vender` de índice 2.
  - `buildRequestSlots({ quantity, goal, formats, contentTypes, calendarDate }): IdeaSlot[]`: percorre formatos e tipos em ciclo, com o mesmo objetivo e a mesma data em todos.
  - `recommendedGoalByBusinessGoal: Record<BusinessGoal, ContentGoal>` = `{ vender_mais: "vender", ganhar_seguidores: "atrair", divulgar_lancamento: "engajar", gerar_contatos: "vender" }`.
  - `IDEAS_SYSTEM_PROMPT: string` (texto exato abaixo).
  - `buildIdeasUserPrompt(context: IdeaPromptContext, slots: IdeaSlot[], retryIssues?: Record<number, string[]>): string`.
  - `type IdeaPromptContext = { storeName: string; segment: string; city: string | null; products: string[]; differentiators: string | null; objections: string | null; businessGoal: string | null; currentObjective: string | null; personas: { name: string; age: number | null; description: string }[]; tone: string | null; lovedTerms: string[]; forbiddenTerms: string[]; brandRules: string[]; existingTitles: string[]; today: string }`.

- [ ] **Step 1: Testes que falham:**

```ts
test("mistura inicial: 4 formatos, 4 objetivos, 4 etapas e nunca 3 formatos iguais seguidos", () => {
  const slots = buildInitialSlots(null);
  assert.equal(slots.length, 9);
  assert.equal(new Set(slots.map((s) => s.format)).size, 4);
  assert.equal(new Set(slots.map((s) => s.goal)).size, 4);
  assert.equal(new Set(slots.map((s) => s.funnelStage)).size, 4);
  for (let i = 2; i < slots.length; i++) {
    assert.ok(!(slots[i].format === slots[i - 1].format && slots[i].format === slots[i - 2].format));
  }
  assert.ok(slots.every((s) => s.funnelStage === funnelStageByGoal[s.goal]));
});

test("mistura inicial liga pelo menos 1 ideia à próxima data", () => {
  const date = { id: "d1", name: "Black Friday", date: "2026-11-27", daysUntil: 29 };
  assert.equal(buildInitialSlots(date).filter((s) => s.calendarDate?.id === "d1").length, 1);
});

test("pedido gera a quantidade pedida percorrendo formatos e tipos", () => {
  const slots = buildRequestSlots({ quantity: 5, goal: "vender", formats: ["reels", "story"], contentTypes: ["comercial"], calendarDate: null });
  assert.deepEqual(slots.map((s) => s.format), ["reels", "story", "reels", "story", "reels"]);
  assert.ok(slots.every((s) => s.goal === "vender" && s.funnelStage === "decisao"));
});

test("prompt omite seções vazias e lista os títulos atuais e os termos proibidos", () => {
  const prompt = buildIdeasUserPrompt({ ...emptyContext, existingTitles: ["Café de reunião"], forbiddenTerms: ["barato"] }, buildInitialSlots(null));
  assert.doesNotMatch(prompt, /Products:/);
  assert.match(prompt, /Café de reunião/);
  assert.match(prompt, /barato/);
});
```

- [ ] **Step 2:** Rodar. Esperado: FAIL.
- [ ] **Step 3:** Implementar `idea-slots.ts` e `lib/ai/prompts/ideas.ts`, com `IDEAS_SYSTEM_PROMPT` exatamente assim:

```text
You are a senior social media strategist for small Brazilian businesses. You write Instagram content ideas for ONE specific business, described in the user message. Write every value in Brazilian Portuguese.

You receive a numbered list of slots. Each slot already fixes the format, content type, goal, funnel stage and, sometimes, a calendar date. Return exactly one idea per slot, with the same "slot" number, and never change what the slot fixes.

Specificity
- Every idea must be about THIS business: name one of its products, one of its differentiators or a real situation of its audience. An idea that would work for any business in the segment is rejected.
- Never invent prices, discounts, deadlines, quantities, results or facts the business did not give. Where one is needed, write a placeholder in double braces, such as {{preço}} or {{horário}}.
- Never use any forbidden term. Prefer the loved terms when they fit naturally.
- Follow every active brand rule.
- Do not repeat or paraphrase any title in "Current ideas".

title
- Up to 60 characters. A concrete hook built like the hook formulas below. No greetings, no "Você sabia", no empty clickbait ("Você não vai acreditar", "Imperdível").
- Hook formulas to draw from (adapt to Portuguese, never copy): Cost Confession, Negative Command ("Pare de X. Faça Y."), Nobody Tells You, Time Collapse, Wrong Way Right Way, Numbered With A Favourite ("3 X. O 2º ninguém usa."), The Objection, Before And After, The Callout, The Verbatim Question, Head To Head, Permission ("Você não precisa de X"), The Reveal.

why
- 1 to 2 sentences explaining why this idea moves the slot's goal for this business.

best_time
- A weekday and hour plausible for the audience, such as "Terça, 12h". Consumer audiences are reachable early in the evening, and business audiences early in the morning.
- When the slot has a calendar date, publish before it and say the date: 2 to 7 days before for posts and reels, and on the day before or on the day itself for stories, for example "Terça, 24 nov, 18h".

how_to_use and steps
- how_to_use: 1 to 2 sentences on how to produce and publish it.
- steps follow the format:
  - carrossel: 6 to 10 steps. Step 1 is the cover with the hook in 6 words or fewer, then one idea per slide (headline of 3 to 7 words, at most 25 words), a recap slide, and a final slide with one call to action.
  - story: 3 to 5 frames. Frame 1 has a face or hands, there is one idea per frame, and frame 4 has exactly one sticker (poll, question box, quiz or link).
  - reels: the hook is spoken and shown on screen in the first 3 seconds, then one beat per step, and it ends by delivering what the hook promised, with one call to action. 15 to 45 seconds.
  - post: 3 to 4 steps for the photo, the on-image text (6 words or fewer) and the caption.

caption_example
- The first sentence delivers the value in at most 125 characters and is never a greeting, a hashtag or an emoji.
- Then a short body of 1 to 3 short paragraphs.
- Exactly one call to action (comment a word, save, send to someone, visit, or send a message). Never two.
- Up to 5 specific hashtags on the last line, or none. Never #viral, #fyp or #explorepage.
- No em dashes, no curly quotes and no ellipsis character.

calendar_event
- Set it only when the user's theme names a commemorative date from this list: {{calendarEventKeys}}. Otherwise set it to null.
```

  `{{calendarEventKeys}}` vem de `calendarEvents.map((e) => e.key)`. O user prompt lista, em blocos `Label: valor`, só o que não estiver vazio: Business, Segment, City, Products, Differentiators, Objections customers raise, Business goal, Current objective, Audience personas, Tone of voice, Loved terms, Forbidden terms, Active brand rules, Today, Current ideas. Depois vem `Slots:`, com uma linha por slot (`#3 format=reels type=comercial goal=vender stage=decisao date=Black Friday 2026-11-27 (in 29 days)`) e, quando houver retry, `Fix these slots:` com os motivos.
- [ ] **Step 4:** Rodar. Esperado: PASS.
- [ ] **Step 5:** Commit `feat(ideas): idea slots and generation prompt`.

### Task 5: Validação

**Files:**
- Create: `lib/ideas/validate-idea.ts`, `lib/ideas/validate-idea.test.ts`
- Modify: `lib/caption/lint.ts` (acrescentar em `CAPTION_CLICHES`: "você sabia", "corre que", "o melhor da cidade", "não fique de fora", "aproveite já")

**Interfaces:**
- Consumes: `lintCaption`, `humanizeCaption`, `CAPTION_CLICHES` de `lib/caption/lint.ts`; `IdeaSlot`.
- Produces:
  - `generatedIdeaSchema = z.object({ slot: z.number().int(), title: z.string(), why: z.string(), how_to_use: z.string(), steps: z.array(z.string()), caption_example: z.string(), best_time: z.string(), audience: z.string().nullable(), calendar_event: z.enum(calendarEventKeys).nullable() })` e `generatedIdeasSchema = z.object({ ideas: z.array(generatedIdeaSchema) })`, para usar com `zodResponseFormat`.
  - `type ValidatedIdea = Omit<GeneratedIdea, "slot"> & { slot: IdeaSlot }`, com os textos já limpos.
  - `validateGeneratedIdeas({ slots, generated, forbiddenTerms, existingTitles }): { approved: ValidatedIdea[]; rejected: Record<number, string[]> }`.
  - `findSimilarTitle(title, titles): string | null`: compara sem acento e sem palavras vazias, com similaridade de Jaccard ≥ 0,6 entre os conjuntos de palavras.

  Regras de reprovação, cada uma com motivo em inglês para o retry: título > 60 caracteres ou vazio; título com clichê; título parecido com um existente ou com outro aprovado na mesma leva; `why` com mais de 2 frases; `steps` vazio; legenda com problemas no `lintCaption(caption, { maxHashtags: 5 })` (125 caracteres, 1 CTA, hashtags, clichês); termo proibido em qualquer texto; slot ausente ou repetido. A limpeza (`humanizeCaption`) roda em título, `why`, `how_to_use`, `steps` e legenda **antes** das checagens.

- [ ] **Step 1: Testes que falham:**

```ts
test("reprova legenda com primeira frase acima de 125 caracteres", ...);
test("reprova legenda com 2 CTAs", ...);          // "Comente QUERO e salve este post."
test("reprova legenda com 6 hashtags", ...);
test("reprova termo proibido em qualquer campo, sem acento", ...);
test("reprova título parecido com ideia existente", () => {
  assert.equal(findSimilarTitle("3 sinais de que seu café é fresco", ["3 sinais de que o seu café é fresco"]), "3 sinais de que o seu café é fresco");
});
test("limpa travessão, aspas curvas e invisíveis antes de validar", ...);
test("slot ausente vira reprovado com motivo", () => {
  const { rejected } = validateGeneratedIdeas({ slots: twoSlots, generated: [ideaForSlot(0)], forbiddenTerms: [], existingTitles: [] });
  assert.deepEqual(Object.keys(rejected), ["1"]);
});
```

- [ ] **Step 2:** Rodar. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test` (inclui os testes antigos de caption). Esperado: PASS.
- [ ] **Step 5:** Commit `feat(ideas): validate generated ideas`.

### Task 6: Geração, pedido e substituição (etapa b + c no servidor)

**Files:**
- Create: `lib/ideas/get-idea-context.ts`, `lib/ideas/generate-ideas.ts`, `actions/generate-ideas/{index,schema}.ts`
- Modify: `lib/rate-limit/index.ts`

**Interfaces:**
- Consumes: Tasks 2 a 5.
- Produces:
  - `generateIdeasSchema = z.discriminatedUnion("mode", [z.object({ mode: z.literal("initial") }), z.object({ mode: z.literal("request"), theme: z.string().trim().max(80), calendarDateId: z.uuid().nullable(), goal: z.enum(contentGoals), formats: z.array(z.enum(contentFormats)).min(1), contentTypes: z.array(z.enum(contentTypes)).min(1), quantity: z.number().int().min(1).max(12) })])`.
  - `generateIdeas(input): Promise<AuthActionResult<{ created: number; missing: number }>>`.
  - `rateLimitRules.generateIdeasByUser = { limit: 6, windowMs: 10 * MINUTE_MS, blockMs: MINUTE_MS, maxBlockMs: HOUR_MS }`.

  Fluxo do `lib/ideas/generate-ideas.ts`:
  1. Dono da loja (`getOwnedStore`).
  2. Se já houver um `idea_requests` da loja em `pendente` ou `processando` criado há menos de 5 minutos, devolve "Já estamos criando suas ideias.". `mode: "initial"` com ideias já existentes devolve `{ created: 0, missing: 0 }`.
  3. Resolve a data: `calendarDateId` informado, senão `detectCalendarEvent(theme)` → `resolveCalendarDate`. No `initial`, usa a próxima data em até 70 dias.
  4. Insere o `idea_requests` (`processando`, `quantity`, `calendar_date_id`).
  5. Monta os slots, chama `openai.chat.completions.parse({ model: LUNA_MODEL, response_format: zodResponseFormat(generatedIdeasSchema, "ideas") })` e valida.
  6. Se houver reprovadas, chama 1 vez só para elas, com os motivos. Se a IA trouxer `calendar_event` e o passo 3 não tiver achado data, resolve com ela (reforço).
  7. Numa transação: `deleteReplaceableIdeas` (só no modo `request`) e insere as aprovadas (`source` biblioteca/gerada, `request_id`, `calendar_date_id`, `recommended = goal === recommendedGoalByBusinessGoal[mainGoal]`, `audience`). Depois, `concluido`.
  8. Em erro: `erro` e "Não conseguimos gerar as ideias agora. Tente de novo.". Se nenhuma for aprovada, nada é apagado.

- [ ] **Step 1: Teste que falha** em `lib/ideas/generate-ideas.test.ts`: extrair a decisão pura `planReplacement({ approvedCount, mode })` → `{ shouldDelete: boolean }` e testar que `approvedCount === 0` nunca apaga e que `mode: "initial"` nunca apaga. Testar também `isRequestInProgress(requests, now)` com um pedido `processando` de 2 minutos (true) e um de 6 minutos (false).
- [ ] **Step 2:** Rodar. Esperado: FAIL.
- [ ] **Step 3:** Implementar `get-idea-context.ts`, `generate-ideas.ts`, a action e o rate limit (chave `generate-ideas:user:${userId}`, mesmo padrão de `generate-post-caption`).
- [ ] **Step 4:** `npm test`, `npx tsc --noEmit` e `npx eslint`. Esperado: PASS, sem erro novo.
- [ ] **Step 5:** Commit `feat(ideas): generate ideas with LUNA and replace unsaved ones`.

### Task 7: Tela: leitura, favoritos e geração inicial (etapas a + b)

**Files:**
- Create: `actions/get-ideas/{index,schema}.ts`, `actions/toggle-idea-save/{index,schema}.ts`, `hooks/queries/use-ideas.ts`, `hooks/mutations/use-toggle-idea-save.ts`, `hooks/mutations/use-generate-ideas.ts`
- Modify: `app/app/ideias/page.tsx`, `hooks/use-ideas-library.ts`, `ideas-library.tsx`, `idea-card.tsx`, `idea-detail-dialog.tsx`, `idea-chips.tsx`, `ideas-dates.tsx`, `ideas-empty-state.tsx`, `ideas-filters.tsx`, `idea-versions-dialog.tsx`, `schedule-idea-dialog.tsx`

**Interfaces:**
- `getIdeasQueryKey = () => ["ideas"] as const`; `useIdeas(initialData: IdeasData)`.
- `toggleIdeaSaveSchema = z.object({ ideaId: z.uuid(), isSaved: z.boolean() })`. A action confere se a ideia é da loja do usuário antes do insert/delete (`onConflictDoNothing` no insert).
- `useToggleIdeaSave()`: o `onMutate` cancela as queries, guarda o snapshot e troca `savedIdeaIds`; o `onError` faz o rollback e mostra toast; o `onSettled` invalida.
- `useGenerateIdeas()`: no `onSuccess`, invalida `getIdeasQueryKey()`.

- [ ] **Step 1:** `page.tsx` carrega `getIdeasData()` dentro de `<Suspense>` (padrão de `app/app/marca/page.tsx`) e passa `initialData`.
- [ ] **Step 2:** `use-ideas-library` usa `useIdeas`. Os filtros usam os valores dos enums, com rótulos de `content-labels`. "Público" mostra os `audience` distintos. "Para você" = `isRecommended`. A data selecionada é por `calendarDateId`.
- [ ] **Step 3:** Card e detalhe usam `useToggleIdeaSave` (o detalhe ganha o botão de salvar). O chip de data mostra o nome da data a partir de `dates`.
- [ ] **Step 4:** Com `ideas.length === 0` e `!isGenerating`, a biblioteca chama `generateIdeas({ mode: "initial" })` uma vez (com `ref` de guarda) e mostra o `GeneratingIdeasState` já existente no lugar da lista. Em erro, mostra o estado vazio com o botão "Gerar ideias".
- [ ] **Step 5:** Versões e agendar continuam como estão (mock), só adaptados aos novos tipos.
- [ ] **Step 6:** `npx tsc --noEmit` e `npx eslint`, sem erro novo. **Parar e mostrar ao usuário.**
- [ ] **Step 7:** Commit `feat(ideas): real ideas, favorites and initial generation`.

### Task 8: Dialog "Gerar novas ideias" com datas (etapa c)

**Files:**
- Modify: `lib/validations/ideas.ts`, `app/app/ideias/components/generate-ideas-dialog.tsx`, `ideas-library.tsx`

**Interfaces:**
- `generateIdeasFormSchema`: `theme` (até 80), `calendarDateId: z.string().nullable()`, `goal`, `formats` (mín. 1), `contentTypes` (mín. 1), `quantity: z.number().int().min(1).max(12)`. Tema e data são opcionais e excludentes: preencher um limpa o outro (Step 1).
- `ideaQuantityOptions = [3, 6, 9, 12]`, mais um campo numérico (`react-number-format`, regra do CLAUDE.md) para 1 a 12.

- [ ] **Step 1:** Campo "Data do calendário": `PillGroup` com as `dates` futuras (nome + dia). Escolher uma data limpa o tema e vice-versa.
- [ ] **Step 2:** O aviso literal da spec fica sempre visível acima do rodapé.
- [ ] **Step 3:** O submit chama `useGenerateIdeas` com `mode: "request"`. O loading usa o nome real da loja. No sucesso: "N novas ideias na sua biblioteca" e, se `missing > 0`, "Faltaram M ideias, tente gerar de novo.". Em erro, toast com a mensagem.
- [ ] **Step 4:** O texto fixo "tom acolhedor, fotos reais..." passa a listar os termos proibidos e as regras reais da marca, ou some se não houver nenhum.
- [ ] **Step 5:** `npm test`, `npx tsc --noEmit` e `npx eslint`, sem erro novo. Rodar `/ponytail-review` no diff. **Parar e mostrar ao usuário.**
- [ ] **Step 6:** Commit `feat(ideas): generate new ideas from themes and calendar dates`.

---

## Dúvidas

1. **Datas globais:** aprova semear as datas nacionais (lista do 0009)? Sem isso, a faixa de datas e a "≥1 ideia na próxima data" ficam vazias para todo mundo.
2. **Clichês:** a spec pede `lib/ideas/cliches-pt.ts`, mas `lib/caption/lint.ts` já tem `CAPTION_CLICHES` em PT-BR, usado pelas legendas. Proponho acrescentar os novos ali (uma lista só), em vez de criar um arquivo novo. Ok?
3. **Gatilho da geração inicial:** proponho gerar ao abrir Ideias sem nenhuma ideia (com loading visível). Disparar também ao concluir o onboarding deixaria o último passo esperando de 20 a 40 s, ou exigiria um job em segundo plano. Ok só ao abrir?
4. **Testes de "loja A x loja B" e "nunca apaga favoritada":** o projeto não tem banco de teste, então proponho testar a SQL gerada (`drizzle.mock()` + `toSQL()`). Se o `DATABASE_URL` for de desenvolvimento, posso fazer um teste de integração dentro de uma transação com `ROLLBACK`. O banco é de dev ou de produção?
5. **"Para você":** `recommended` = objetivo da ideia igual ao objetivo do negócio (`vender_mais`→vender, `ganhar_seguidores`→atrair, `divulgar_lancamento`→engajar, `gerar_contatos`→vender). Ok?
6. **Fora do escopo** (continuam mock): gerar versões de uma ideia e o dialog de agendar ideia. Confirma?

# Aprovação de textos antes da arte: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** fazer o input da Início funcionar e criar a tela `/app/estudio/aprovar`, onde o lojista edita e aprova os textos antes da geração da arte. Depois o estúdio gera a arte com esses textos exatos.

**Architecture:** um `PostDraftProvider` client, espelhado no `sessionStorage`, carrega prompt, formato, variações, anexos e textos entre Início, aprovação e estúdio. A server action `generate-post-copy` (`LUNA_MODEL`) devolve um JSON validado por Zod. Na `/api/generate`, o texto aprovado entra pelo código, depois do LLM que escreve o prompt.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, shadcn/ui, Tailwind, React Hook Form + Zod, React Query, OpenAI SDK, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-30-aprovacao-de-textos-design.md`

## Global Constraints

- Siga o `CLAUDE.md`: código em inglês e textos de UI em português, kebab-case, sem comentários no código, React Hook Form + Zod em formulários, React Query com hook próprio e função de mutation key exportada, server action em pasta com `index.ts` e `schema.ts`.
- Nada de mudança no banco.
- Não rode `npm run dev`.
- Ao fim de cada tarefa, os 3 comandos passam sem erro: `npm run lint`, `npx tsc --noEmit` e `npm test`.
- O teste roda `node --test "lib/**/*.test.ts"`. Por isso, arquivos de `lib/` cobertos por teste usam imports relativos com extensão `.ts` (ex.: `./lint.ts`), nunca `@/`.
- Limites de tamanho: título regular até 30 caracteres, destaque até 30, subtítulo até 90, tópico com título até 30 e frase até 110, máximo de 3 tópicos, CTA até 30, legenda até `CAPTION_LIMIT` (2200).
- Legenda: primeira frase com até `VISIBLE_WINDOW` (125) caracteres, 1 CTA, até 5 hashtags (`lintCaption(..., { maxHashtags: 5 })`), passando por `humanizeCaption`.
- Placeholder: `{{nome}}`. A aprovação fica bloqueada enquanto houver placeholder num campo ativo.
- "Vai na arte": título e CTA vêm ligados, subtítulo e tópicos desligados. A legenda nunca vai para a imagem.
- Story: a legenda não é gerada nem mostrada.
- Um único conjunto de textos para todas as variações.
- Só a Início passa pela aprovação. Os modos livre e guiado do estúdio continuam iguais.

## Review Focus

1. **F5 na `/aprovar`:** os textos e opções voltam do `sessionStorage`, os anexos somem e a tela mostra "Anexe a foto de novo". Acesso direto sem rascunho redireciona para a Início. Coberto pelo teste `parsePostDraft` (Task 3).
2. **Texto com aspas, acento, emoji, `$` ou `{{`:** chega ao prompt da imagem byte a byte. Coberto pelo teste `buildApprovedCopyInstruction` (Task 8).
3. **StrictMode ou montagem dupla do estúdio:** a geração automática dispara uma vez só. Fica a cargo do ref de guarda da Task 9, sem teste unitário. Verificar na revisão.
4. **Resposta do LLM fora do schema** (4 tópicos, CTA longo, legenda com 2 CTAs): a action tenta de novo uma vez e, se falhar, mostra um erro amigável. Coberto pelos testes do schema (Task 5).
5. **Variações acima do restante do teste**, enviadas pela Início ou ao aprovar: o envio é barrado com a mesma mensagem do estúdio. Coberto pelo teste `getInitialVariationCount`/`artOptionsSchema` (Task 1). A checagem no submit fica para a revisão.

---

## Etapa (a): input da Início + setinha + formato/variações

### Task 1: opções de arte compartilhadas

**Files:**
- Create: `lib/art-options.ts`, `lib/art-options.test.ts`
- Modify: `app/app/estudio/hooks/use-studio.ts` (remover `formatArtCount`, `formatVariationCount` e o cálculo inline do `variationCount` inicial), `lib/validations/image-generation.ts` (`format` passa a usar `artFormatIdSchema`), e os imports em `studio-header.tsx`, `studio-preview-panel.tsx`, `studio-prompt-form.tsx`, `preview-generating-state.tsx`, `trial-limit-dialog.tsx` e `format-options-popover.tsx`.

**Interfaces:**
- Produces (em `lib/art-options.ts`, importando `./mocks/studio.ts`):
  - `artFormatIdSchema: z.ZodEnum<["square","portrait","story"]>`
  - `artOptionsSchema = z.object({ formatId: artFormatIdSchema, variationCount: z.number().int().min(1).max(maxVariationsPerGeneration) })`
  - `type ArtOptions = z.infer<typeof artOptionsSchema>`
  - `getInitialVariationCount(remainingArts: number): number`: `Math.max(1, Math.min(maxVariationsPerGeneration, remainingArts))`
  - `formatArtCount(count: number): string`, `formatVariationCount(count: number): string` e `findArtFormat(formatId?: ArtFormatId): ArtFormat`, movidos de `use-studio.ts` sem mudança.

- [ ] **Step 1:** teste em `lib/art-options.test.ts`:
  - `artOptionsSchema aceita todo formato e toda contagem do seletor`: percorre `artFormats` × `variationCountOptions` e espera `success === true` em todos.
  - `artOptionsSchema rejeita 0 e 4 variações e formato desconhecido`.
  - `getInitialVariationCount`: `(Infinity) → 3`, `(2) → 2`, `(0) → 1`.
  - `formatVariationCount(1) === "1 variação"` e `formatArtCount(2) === "2 artes"`.
- [ ] **Step 2:** `npm test` falha com "Cannot find module".
- [ ] **Step 3:** crie `lib/art-options.ts`, atualize os imports e troque o cálculo inline no `useStudio` por `getInitialVariationCount(remainingArts)`.
- [ ] **Step 4:** `npm test`, `npm run lint` e `npx tsc --noEmit` passam.
- [ ] **Step 5:** commit `refactor(studio): share art format and variation options`.

### Task 2: componentes comuns e hook de cota

**Files:**
- Move (`git mv`): `app/app/estudio/components/format-options-popover.tsx`, `round-send-button.tsx` e `trial-limit-dialog.tsx` para `components/common/`
- Create: `hooks/use-art-quota.ts`
- Modify: imports em `ai-editor-dialog.tsx`, `guided-questions.tsx`, `studio-prompt-form.tsx` e `studio-workspace.tsx`, e em `use-studio.ts` (passa a usar `useArtQuota`).

**Interfaces:**
- Consumes: `getInitialVariationCount` e `formatArtCount` (Task 1).
- Produces: `useArtQuota()` → `{ usedArts: number; artLimit: number; remainingArts: number; variationCount: number; setVariationCount(count: number): void; registerUsedArts(count: number): void; getQuotaError(): "limit" | string | null }`.
  - `getQuotaError` devolve `"limit"` quando `remainingArts <= 0`.
  - Devolve a mensagem `Restam ${formatArtCount(remainingArts)} no teste. Escolha até ${formatVariationCount(remainingArts)}.` quando `variationCount > remainingArts`.
  - Senão, devolve `null`.
- `FormatOptionsPopover`: o `id` fixo `studio-format-label` vira `useId()`, porque o componente agora pode aparecer em duas telas.

- [ ] **Step 1:** mova os arquivos e extraia de `useStudio` a lógica de `usedArts`, `artLimit`, `remainingArts` e `variationCount` para `useArtQuota`. O `generate` e o `adjustVariation` do estúdio usam `getQuotaError()` e mantêm o mesmo comportamento: `"limit"` abre o diálogo, e uma mensagem abre o popover e mostra o toast.
- [ ] **Step 2:** `npm run lint`, `npx tsc --noEmit` e `npm test` passam, e `grep -rn "estudio/components/round-send-button\|estudio/components/format-options" app components` não retorna nada.
- [ ] **Step 3:** commit `refactor(studio): move format popover, send button and quota to common`.

### Task 3: rascunho do post (provider + sessionStorage)

**Files:**
- Create: `lib/post-draft.ts`, `lib/post-draft.test.ts`, `providers/post-draft-provider.tsx`
- Modify: `app/app/layout.tsx` (envolve `AppShell` com `PostDraftProvider` dentro do `ToastProvider`), `hooks/use-attachments.ts` (`useAttachments(initialAttachments: Attachment[] = [])`), `lib/routes.ts` (`studioApproval: "/app/estudio/aprovar"`).

**Interfaces:**
- Consumes: `artOptionsSchema` (Task 1) e `postCopySchema` e `postCopyFieldSchema` (Task 5; até a Task 5 ficar pronta, `copy` fica `z.unknown().optional()` e a Task 5 troca).
- Produces:
  - `lib/post-draft.ts`:
    - `POST_DRAFT_STORAGE_KEY = "mavik:post-draft"`
    - `storedPostDraftSchema = artOptionsSchema.extend({ prompt: generateArtFormSchema.shape.prompt, copy: postCopySchema.optional(), artFields: z.array(postCopyFieldSchema), isApproved: z.boolean() })`
    - `type StoredPostDraft`
    - `parsePostDraft(raw: string | null): StoredPostDraft | null`: JSON inválido ou fora do schema devolve `null`.
    - `defaultArtFields: PostCopyField[] = ["title", "cta"]`
  - `providers/post-draft-provider.tsx`: `usePostDraft()` → `{ draft: (StoredPostDraft & { attachments: Attachment[] }) | null; saveDraft(next: Partial<…>): void; clearDraft(): void; hasLostAttachments: boolean }`.
    - A leitura e a escrita no `sessionStorage` ficam em `try/catch`.
    - `hasLostAttachments` é `true` quando o rascunho veio do storage depois de um F5.
- `generateArtFormSchema` vem de `lib/validations/generate-art.ts`. Para o teste, ele precisa importar só `zod`, o que já é o caso.

- [ ] **Step 1:** teste em `lib/post-draft.test.ts`:
  - `parsePostDraft devolve null para null, JSON quebrado e formato inválido`
  - `parsePostDraft restaura prompt, formato, variações, textos e artFields`, com um objeto completo em ida e volta por `JSON.stringify`
- [ ] **Step 2:** `npm test` falha.
- [ ] **Step 3:** implemente `lib/post-draft.ts`, o provider, a rota e o parâmetro de `useAttachments`.
- [ ] **Step 4:** `npm test`, `npm run lint` e `npx tsc --noEmit` passam.
- [ ] **Step 5:** commit `feat(app): add post draft provider persisted in session storage`.

### Task 4: input da Início

**Files:**
- Modify: `app/app/inicio/components/create-post-card.tsx`

**Interfaces:**
- Consumes: `FormatOptionsPopover`, `RoundSendButton`, `TrialLimitDialog`, `useArtQuota` (Task 2), `usePostDraft`, `routes.studioApproval` (Task 3), `findArtFormat`, `getInitialVariationCount` (Task 1).

- [ ] **Step 1:** monte o card com estes comportamentos:
  - `defaultValues.prompt = draft?.prompt ?? ""`.
  - `useAttachments(draft?.attachments)`.
  - O estado de formato e variações começa em `draft` ou em `portrait` / `getInitialVariationCount`.
  - `FormatOptionsPopover` fica ao lado do picker, só quando `isComposerActive`, igual ao `studio-prompt-form.tsx`.
  - `<RoundSendButton label="Gerar arte" />` substitui o `Button`.
  - Anexos, voz e `promptStarters` continuam como estão.
- [ ] **Step 2:** implemente `handleGenerateArt({ prompt })`:
  - Se `getQuotaError()` devolver `"limit"`, abre o `TrialLimitDialog`.
  - Se devolver uma mensagem, abre o popover e mostra `showToast(mensagem)`.
  - Senão, chama `saveDraft({ prompt, formatId, variationCount, attachments, copy: undefined, artFields: defaultArtFields, isApproved: false })` e depois `router.push(routes.studioApproval)`.
- [ ] **Step 3:** `npm run lint`, `npx tsc --noEmit` e `npm test` passam.
- [ ] **Step 4:** commit `feat(inicio): send idea with format and variations to copy approval`.

---

## Etapa (b): action de texto

Use `mattpocock-skills:tdd` nas Tasks 5 e 8.

### Task 5: schema e validação do texto gerado

**Files:**
- Create: `lib/post-copy/post-copy-schema.ts`, `lib/post-copy/validate-post-copy.ts`, `lib/post-copy/post-copy.test.ts`
- Modify: `lib/post-draft.ts` (troca `copy` por `postCopySchema.optional()`)

**Interfaces:**
- Produces:
  - `postCopySchema = z.object({ title: z.object({ regular, highlight }), subtitle, topics: z.array(z.object({ title, sentence })).max(3), cta, caption: z.string().trim().min(1).max(CAPTION_LIMIT).optional() })`, com todo `string` usando `.trim().min(1).max(N)` e os limites das Global Constraints.
  - `type PostCopy`
  - `postCopyFieldSchema = z.enum(["title", "subtitle", "topics", "cta", "caption"])`
  - `type PostCopyField`
  - `findPlaceholders(text: string): string[]`, com a regex `/\{\{[^{}]+\}\}/g`
  - `getPostCopyIssues(copy: PostCopy, { forbiddenTerms, isStory }: { forbiddenTerms: string[]; isStory: boolean }): string[]`, que junta:
    - `lintCaption(caption, { maxHashtags: 5 }).issues`, quando não é Story
    - `"Falta a legenda."`, quando não é Story e não há `caption`
    - `"Termos proibidos usados: …"` em qualquer campo, via `findForbiddenTerms`

    Antes, mova `findForbiddenTerms` de `write-linted-caption.ts` para `lib/caption/lint.ts`, porque `write-linted-caption` é `server-only` e não roda no `node --test`. Reexporte no lugar antigo.

- [ ] **Step 1:** testes:
  - `postCopySchema rejeita 4 tópicos`
  - `postCopySchema rejeita título regular com 31 caracteres, subtítulo com 91, frase de tópico com 111 e CTA com 31`
  - `postCopySchema aceita 0 tópicos e caption ausente`
  - `postCopySchema aceita {{preço}} nos campos`
  - `findPlaceholders("Por {{preço}} até {{data}}")` devolve `["{{preço}}","{{data}}"]`
  - `getPostCopyIssues aponta legenda com 2 CTAs` (`"Comente aqui e siga a gente"`)
  - `getPostCopyIssues aponta 6 hashtags e aceita 5`
  - `getPostCopyIssues aponta primeira frase com 126 caracteres`
  - `getPostCopyIssues aponta termo proibido no subtítulo`
  - `getPostCopyIssues exige legenda fora do Story e ignora no Story`
- [ ] **Step 2:** `npm test` falha.
- [ ] **Step 3:** implemente.
- [ ] **Step 4:** `npm test`, `npm run lint` e `npx tsc --noEmit` passam.
- [ ] **Step 5:** commit `feat(copy): add post copy schema and validation`.

### Task 6: server action `generate-post-copy`

**Files:**
- Create: `actions/generate-post-copy/index.ts`, `actions/generate-post-copy/schema.ts`, `hooks/mutations/use-generate-post-copy.ts`
- Modify: `lib/rate-limit/index.ts` (adicione `generatePostCopyByUser: { limit: 30, windowMs: 10 * MINUTE_MS, blockMs: MINUTE_MS, maxBlockMs: HOUR_MS }`)

**Interfaces:**
- Consumes: `postCopySchema`, `postCopyFieldSchema`, `getPostCopyIssues` e `humanizeCaption` (Task 5), `artFormatIdSchema` (Task 1), `getBrandContext`, `LUNA_MODEL`.
- Produces:
  - `generatePostCopySchema = z.object({ prompt: generateArtFormSchema.shape.prompt, formatId: artFormatIdSchema, field: postCopyFieldSchema.optional(), currentCopy: postCopySchema.optional() })`
  - `generatePostCopy(input): Promise<AuthActionResult<{ copy: PostCopy }>>`
  - `useGeneratePostCopy()` e `getGeneratePostCopyMutationKey = () => ["generate-post-copy"] as const`

- [ ] **Step 1:** implemente no padrão de `actions/generate-post-caption/index.ts`:
  - mesma sequência de validação, `getCurrentUserId`, rate limit (`generate-post-copy:user:${userId}`) e mensagem de bloqueio `Você pediu muitos textos seguidos. Tente de novo em ${formatRetryAfter(ms)}.`
  - `getBrandContext(userId, openai, { contentFormat: formatId === "story" ? "story" : "post" })`
  - `chat.completions.create` com `model: LUNA_MODEL` e `response_format: { type: "json_object" }`
- [ ] **Step 2:** o prompt de sistema diz:
  - o formato do JSON e os limites
  - nunca inventar números, preços, prazos ou descontos ausentes do pedido; nesses casos, usar `{{preço}}`, `{{data}}` etc.
  - seguir o tom, as palavras preferidas e as proibidas (`brandContext.guidelines`)
  - `CAPTION_WRITING_RULES`, com até 5 hashtags no final
  - no Story, omitir `caption`
  - com `field` e `currentCopy`: reescrever só aquele campo, com abordagem diferente, e devolver os outros idênticos
- [ ] **Step 3:** faça o parse com `postCopySchema.safeParse`. Aplique `humanizeCaption` a todos os textos e rode `getPostCopyIssues`. Com erro de schema ou issues, tente mais uma vez, mandando os problemas como no `writeLintedCaption`. Se falhar de novo, devolva `authFailure("Não conseguimos escrever os textos agora. Tente de novo.")`.
- [ ] **Step 4:** `npm run lint`, `npx tsc --noEmit` e `npm test` passam.
- [ ] **Step 5:** commit `feat(copy): add generate-post-copy action`.

---

## Etapa (c): tela de aprovação

Antes da Task 7, use a skill `frontend-design` e siga o `DESIGN.md` (tokens, voz e tom, acessibilidade) e os componentes shadcn de `components/ui`.

### Task 7: `/app/estudio/aprovar`

**Files:**
- Create: `app/app/estudio/aprovar/page.tsx` (`metadata` com `title: "Aprovar textos"` e `robots` noindex, igual ao estúdio)
- Create em `app/app/estudio/aprovar/components/`:
  - `copy-approval-workspace.tsx`: busca os textos, gerencia o form e trata os estados
  - `copy-field-card.tsx`: um campo com edição, `Switch` "Vai na arte" e "Gerar outra opção"
  - `copy-art-preview.tsx`: prévia na proporção do formato, só com os campos ligados
  - `copy-options-summary.tsx`: formato e variações
  - `placeholder-highlight.tsx`: destaca `{{…}}` com `findPlaceholders`

**Interfaces:**
- Consumes: `usePostDraft`, `routes` (Task 3), `useGeneratePostCopy` (Task 6), `postCopySchema`, `findPlaceholders`, `PostCopyField` (Task 5), `RoundSendButton` (Task 2), `formatVariationCount` e `findArtFormat` (Task 1).
- Form: React Hook Form com `postCopySchema` e um `superRefine` local que bloqueia placeholder em campo ativo com a mensagem `Troque ${placeholder} pelo valor real.` A legenda conta como ativa fora do Story.

- [ ] **Step 1:** comportamentos:
  - Sem `draft`, chama `router.replace(routes.authenticatedHome)`.
  - Com `draft` e sem `copy`, dispara `generatePostCopy` uma vez, com ref de guarda, e grava o resultado em `saveDraft({ copy })`.
  - Edições salvam no draft com `watch` (debounce não é necessário).
  - "Gerar outra opção" no campo X chama a action com `field: X` e `currentCopy`, e troca só `copy[X]`.
  - No Story, o campo legenda não aparece.
  - `hasLostAttachments` mostra um `Alert` com "Anexe a foto de novo na Início para usar no post." e um link de volta.
- [ ] **Step 2:** ações:
  - "Voltar para a Início" é um link para `routes.authenticatedHome`. O draft permanece e a Início restaura o prompt e as opções (Task 4).
  - "Aprovar e gerar arte" usa `<RoundSendButton label="Aprovar e gerar arte" />` no submit. Chama `saveDraft({ copy: values, isApproved: true })` e depois `router.push(routes.studio)`.
- [ ] **Step 3:** estados:
  - Carregamento: skeleton dos campos com `aria-busy`.
  - Erro: `Alert` com a `errorMessage` da action e o botão "Tentar de novo".
  - Rate limit: a mensagem da action é exibida tal como vem.
  - Durante qualquer geração, os botões ficam desabilitados.
- [ ] **Step 4:** `npm run lint`, `npx tsc --noEmit` e `npm test` passam.
- [ ] **Step 5:** commit `feat(studio): add copy approval screen`.

---

## Etapa (d): ligação com o estúdio

### Task 8: texto aprovado no prompt da imagem

**Files:**
- Create: `lib/post-copy/approved-copy.ts`, `lib/post-copy/approved-copy.test.ts`
- Modify: `lib/validations/image-generation.ts`, `app/api/generate/route.ts`

**Interfaces:**
- Consumes: `PostCopy` e `PostCopyField` (Task 5).
- Produces:
  - `approvedCopyEntrySchema = z.object({ role: z.enum(["headline", "headline-highlight", "subtitle", "topic-title", "topic-text", "cta"]), text: z.string().min(1).max(120) })`
  - `type ApprovedCopyEntry`
  - `toApprovedCopyEntries(copy: PostCopy, artFields: PostCopyField[]): ApprovedCopyEntry[]`: ordem título, subtítulo, tópicos e CTA. Ignora `caption` sempre e ignora campos fora de `artFields`.
  - `buildApprovedCopyInstruction(entries: ApprovedCopyEntry[]): string`: devolve `""` para lista vazia. Senão, devolve exatamente:

```
The post must contain ONLY these texts, in Brazilian Portuguese, copied character by character exactly as written between the quotes. Do not rewrite, translate, shorten, correct or add any word, and add no other text:
- <role>: "<text>"
```

  (uma linha `- role: "text"` por entrada, sem escapar o texto)
  - `generateImageSchema` ganha `approvedCopy: z.array(approvedCopyEntrySchema).max(12).optional()`.

- [ ] **Step 1:** testes:
  - `toApprovedCopyEntries respeita artFields e nunca inclui legenda`
  - `toApprovedCopyEntries mantém a ordem título, subtítulo, tópicos, CTA`
  - `buildApprovedCopyInstruction contém cada texto idêntico entre aspas`, com `'Bolo "da vó" — R$ 10 ✨ {{x}} $& á'`, conferido com `includes(`"${text}"`)`
  - `buildApprovedCopyInstruction devolve vazio sem entradas`
- [ ] **Step 2:** `npm test` falha.
- [ ] **Step 3:** implemente.
- [ ] **Step 4:** no `route.ts`:
  - Com `approvedCopy` não vazio, `writeImagePrompt` troca a frase `Include a short headline in Brazilian Portuguese (up to 8 words)…` por `buildApprovedCopyInstruction(approvedCopy)`, para o LLM reservar espaço no layout.
  - Concatene `buildApprovedCopyInstruction(approvedCopy)` ao `imagePrompt` **depois** de `removeBrandName` e dos guardrails, para o texto não ser alterado.
  - Com `editInstruction`, o fluxo atual não muda.
- [ ] **Step 5:** `npm test`, `npm run lint` e `npx tsc --noEmit` passam.
- [ ] **Step 6:** commit `feat(studio): send approved copy verbatim to the image prompt`.

### Task 9: estúdio consome o rascunho aprovado

**Files:**
- Modify: `app/app/estudio/hooks/use-studio.ts`, `hooks/mutations/use-generate-image.ts` (só se o tipo de input precisar de ajuste)

**Interfaces:**
- Consumes: `usePostDraft` (Task 3), `toApprovedCopyEntries` (Task 8), `useArtQuota` (Task 2).

- [ ] **Step 1:** em `useStudio`, quando `draft?.isApproved` for verdadeiro e não houver `initialArtwork`:
  - Estado inicial: `mode: "free"`, `formatId` e `variationCount` do draft, `lastPrompt = draft.prompt`, `caption = draft.copy.caption ?? ""`, anexos de `draft.attachments` (via `useAttachments(draft.attachments)`) e o estado novo `approvedCopy = toApprovedCopyEntries(draft.copy, draft.artFields)`.
- [ ] **Step 2:** um `useEffect` com ref de guarda chama `generate({ prompt: draft.prompt })` uma vez e depois `clearDraft()`.
  - `generate`, `regenerate` e `adjustVariation` mandam `approvedCopy` no `mutateAsync`.
  - Um novo envio pelo form livre do estúdio zera `approvedCopy`, porque o prompt mudou.
- [ ] **Step 3:** `npm run lint`, `npx tsc --noEmit` e `npm test` passam.
- [ ] **Step 4:** commit `feat(studio): generate art from approved copy draft`.

---

## Fechamento

- [ ] Use a skill `superpowers:verification-before-completion`: rode `npm run lint`, `npx tsc --noEmit` e `npm test` e cole a saída.
- [ ] Use a skill `ponytail:ponytail-review` na branch inteira (`git diff 9d15c48..HEAD`). Corrija os achados e repita a verificação.

# Área "Artes": plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** criar `/app/artes`, com a listagem e o detalhe de cada arte, e reutilizar ali o mesmo dialog "Ajustar com IA" do estúdio. Cada ajuste passa a ser uma nova versão da mesma arte.

**Architecture:**
- A listagem sai de `estudio/criados` para `app/app/artes/page.tsx`. O detalhe é um server component que busca a arte filtrando pela loja.
- O dialog e o código de ajuste vão para `components/common/ai-editor/` e para um hook compartilhado, usados pelo estúdio e pelo detalhe.
- A `/api/generate` grava o ajuste como `artwork_versions.version = N+1` da mesma arte. O texto do ajuste vai em `layers.editInstruction`, sem mudar o schema.

**Tech Stack:** Next.js 16 App Router (`cacheComponents`), React 19, Drizzle, Supabase Storage, React Query, shadcn/ui, `node --test`.

**Spec:** o pedido do usuário (área "Artes", colado na conversa de 30/10) e as decisões abaixo.

## Decisões já tomadas

- **Ajuste vira versão da mesma arte.** Ele cria uma nova linha em `artwork_versions` (`version` = máximo + 1) com `layers: { editInstruction }`. O schema não muda. O estúdio passa a manter o mesmo `artworkId` depois de ajustar.
- **"Descartar alterações"** apaga as versões criadas desde que o dialog abriu (e os arquivos delas no storage), voltando para a versão aberta. Sem isso, a listagem mostraria a versão que o lojista descartou.
- **"Salvar versão"** continua igual: só o contador local e o toast, porque o pedido exige o dialog idêntico. Na prática, cada ajuste já fica salvo.
- **"Variações":** o banco não liga as variações de uma geração (cada uma é uma arte própria). O detalhe mostra as **versões** da arte, não as variações.
- **Status "agendada":** não existe em `artwork_status` (`rascunho`, `em_revisao`, `aprovada`, `descartada`). É derivado do conteúdo ligado:
  - `contents.status = 'aprovado'` com `scheduled_at` no futuro → "agendada"
  - `contents.status = 'publicado'` → "publicada"
  - nos outros casos, vale o `artworks.status`
- **Formato** no banco é só `post`/`story`. Post 1:1 e 4:5 não se distinguem. No detalhe, o formato (`square`/`portrait`/`story`) é deduzido da proporção da imagem.
- **Dependências do dialog:** `round-send-button` já está em `components/common`. `brand-assurance-note` e `studio-composer-shell` também são usados por outras telas do estúdio, então vão para `components/common/`, e não para a pasta do dialog.
- **Base da branch:** `feature/area-artes` parte de `feature/aprovacao-de-textos`, que já moveu componentes para `components/common`.

## Global Constraints

- Siga o `CLAUDE.md`: código em inglês e textos em português, kebab-case, sem comentários, React Query com hook próprio e função de key exportada, server action em pasta com `index.ts` e `schema.ts`.
- Não mexa no schema do banco e não crie migração.
- Não rode `npm run dev`.
- Ao fim de cada etapa, os 4 comandos passam: `npm run lint`, `npx tsc --noEmit`, `npm test` e `npm run build`.
- Toda leitura ou escrita de arte filtra por `artworks.storeId = store.id` da loja do usuário (`getOwnedStore`). Id inválido ou de outra loja vira `notFound()` ou erro.
- Testes ficam em `lib/**/*.test.ts`, com imports relativos `.ts`.
- `robots: { index: false, follow: false }` em todas as páginas novas.

## Review Focus

1. **Ajuste da arte de outra loja:** se a requisição mandar o `artworkId` de outra loja, a rota responde 404 e não grava nenhuma versão. Coberto pelo teste de `appendArtworkVersion` (Task 6) e pela checagem `storeId`.
2. **Descartar depois de 2 ajustes:** volta exatamente para a versão aberta, e a listagem mostra a imagem original. Coberto pelo teste `getVersionsToDiscard` (Task 6).
3. **Dois ajustes quase ao mesmo tempo:** a constraint `unique(artwork_id, version)` impede versão duplicada. O segundo ajuste recebe um erro amigável, sem quebrar. Fica para a revisão.
4. **Arte do estúdio sem `artworkId`** (o salvamento falhou): o ajuste usa o caminho antigo, com `referenceImage` e uma arte nova. Coberto pelo teste `toAdjustImageInput` (Task 6).
5. **Página antiga `?pagina=3` em `/app/estudio/criados`:** redireciona para `/app/artes?pagina=3`. Fica para a revisão.

---

## Etapa (a): listagem, rotas e menu

### Task 1: rotas e status derivado

**Files:**
- Modify: `lib/routes.ts`
- Create: `lib/content/artwork-status.ts`, `lib/content/artwork-status.test.ts`

**Interfaces:**
- Produces:
  - `routes.artworks = "/app/artes"`
  - `getArtworkRoute(artworkId: string) => \`/app/artes/${encodeURIComponent(artworkId)}\``
  - `routes.studioArtworks` sai, e todos os usos passam para `routes.artworks`
  - `type ArtworkDisplayStatus = "rascunho" | "em_revisao" | "aprovada" | "descartada" | "agendada" | "publicada"`
  - `getArtworkDisplayStatus({ artworkStatus, contentStatus, scheduledAt, now }): ArtworkDisplayStatus`
  - `artworkDisplayStatusLabels: Record<ArtworkDisplayStatus, string>`, que substitui `artworkStatusLabels` do `artwork-card`
  - `artworkStatusFilters = ["rascunho", "aprovada", "agendada"] as const`

- [ ] **Step 1:** testes:
  - `getArtworkDisplayStatus devolve agendada para conteúdo aprovado no futuro`
  - `devolve publicada para conteúdo publicado`
  - `devolve o status da arte sem conteúdo ou com data passada`
- [ ] **Step 2:** `npm test` falha.
- [ ] **Step 3:** implemente e troque os 4 usos de `routes.studioArtworks` (`criados/page.tsx`, `preview-idle-state.tsx`, `drafts-section.tsx`) por `routes.artworks`.
- [ ] **Step 4:** `npm test` passa.
- [ ] **Step 5:** commit `feat(artes): add artworks routes and derived status`.

### Task 2: listagem `/app/artes` com filtros

**Files:**
- Create: `app/app/artes/page.tsx` (conteúdo movido de `app/app/estudio/criados/page.tsx`)
- Delete: `app/app/estudio/criados/page.tsx`
- Modify:
  - `next.config.ts`: `{ source: "/app/estudio/criados", destination: "/app/artes", permanent: true }`. O Next repassa a query `?pagina=`.
  - `lib/content/get-recent-artworks.ts`: aceita `format?: "post" | "story"` e `status?: (typeof artworkStatusFilters)[number]`, faz left join com `contents` (`status`, `scheduledAt`) e devolve `displayStatus` e `format`.
  - `components/common/artwork-card.tsx`: o link vai para `getArtworkRoute(artwork.id)`, com `aria-label` `Abrir arte: ${title}`, e o badge usa `displayStatus`.
  - `components/common/app-sidebar/sidebar-nav-items.ts`: item `{ label: "Artes", href: routes.artworks, icon: Images }` no grupo "Criar", depois de "Estúdio".

**Interfaces:**
- Consumes: Task 1.
- Filtros por query: `?formato=post|story` e `?status=rascunho|aprovada|agendada`. Valores inválidos são ignorados. A paginação mantém os filtros.
- O filtro "agendada" vai para o SQL: `contents.status = 'aprovado' and contents.scheduled_at > now()`. "rascunho" e "aprovada" usam `artworks.status`, excluindo as agendadas.

- [ ] **Step 1:** mova a página. Título "Artes", eyebrow "Criadas no Estúdio". O estado vazio e os textos ("Você ainda não gerou posts" etc.) continuam iguais.
- [ ] **Step 2:** filtros com `FilterPill` (`components/common/filter-pill.tsx`) como links: "Todos os formatos / Post / Story" e "Todos / Rascunho / Aprovada / Agendada". O estado vazio filtrado diz "Nenhuma arte com esses filtros" e tem o link "Limpar filtros".
- [ ] **Step 3:** redirect, card e item do menu.
- [ ] **Step 4:** os 4 comandos da Global Constraints passam.
- [ ] **Step 5:** commit `feat(artes): move generated posts to /app/artes with filters`.

---

## Etapa (b): página de detalhe

Antes da Task 3, use a skill `frontend-design` se ela estiver disponível. Senão, siga o `DESIGN.md` à mão e registre isso.

### Task 3: leitura do detalhe

**Files:**
- Create: `lib/content/get-artwork-detail.ts`
- Create: `lib/content/artwork-format.ts`, `lib/content/artwork-format.test.ts`

**Interfaces:**
- Produces:
  - `getArtworkDetail(artworkId: string): Promise<ArtworkDetail | null>`. Valida `z.uuid()` e filtra por `storeId` como em `getStudioArtwork`.
  - `ArtworkDetail = { id, title, prompt, format: "post" | "story", displayStatus, createdAt, approvedAt, scheduledAt, contentId, caption, versions: { version, imageUrl, editInstruction?, createdAt }[] }`
    - `versions` vem em ordem decrescente, e a primeira é a atual.
    - `caption`: a da última versão, ou a de `contents`, ou `""`.
  - `getArtworkImageUrls` ganha um irmão, `getVersionImageUrls(renderPaths: string[])`, com o mesmo signed URL de 1 h, extraído sem duplicar o código.
  - `getArtFormatIdFromSize(width: number, height: number): ArtFormatId`: proporção ≥ 1.6 → `story`, ≥ 1.15 → `portrait`, senão `square`.
- [ ] **Step 1:** testes de `getArtFormatIdFromSize`: 1024×1024 → square, 1024×1280 → portrait, 1024×1820 → story.
- [ ] **Step 2:** `npm test` falha, depois implemente, e `npm test` passa.
- [ ] **Step 3:** commit `feat(artes): read artwork detail with versions`.

### Task 4: página `/app/artes/[artworkId]`

**Files:**
- Create: `app/app/artes/[artworkId]/page.tsx`
- Create em `app/app/artes/[artworkId]/components/`: `artwork-detail-view.tsx` (client: imagem, metadados, ações), `artwork-versions.tsx`
- Move: `app/app/estudio/components/schedule-art-dialog.tsx` → `components/common/schedule-art-dialog.tsx`; `app/app/estudio/utils/schedule-days.ts` → `lib/schedule-days.ts`
- Modify: `lib/download-file.ts` (adicione `downloadImage(url, fileName)`, com fetch → blob → `downloadFile`, extraído de `studio-workspace.tsx:handleDownload`), `studio-workspace.tsx` (passa a usar esse helper)

**Interfaces:**
- `generateMetadata({ params })` devolve `title: detail?.title ?? "Arte"` e `robots` noindex. `params` e a leitura ficam dentro de `<Suspense>`, como em `/app/etapas`.
- Sem arte, a página chama `notFound()`.
- Ações:
  - **Ajustar com IA:** fica desabilitado até a Task 7, que o liga.
  - **Agendar:** abre o `ScheduleArtDialog` e chama `useScheduleArtwork` / `usePublishArtworkNow` com `artworkId`. Depois roda `router.refresh()`.
  - **Baixar:** `downloadImage`.
  - **Abrir no estúdio:** `getStudioUrlForArtwork(id)`.
  - **Voltar:** link para `routes.artworks`.
- Metadados: formato com a proporção deduzida pelo `onLoad` da imagem, status, "Criada em", "Aprovada em", "Agendada para", o prompt (recolhível com `TruncatedText`) e a legenda (só se existir).
- Histórico: lista de versões com miniatura, número, data e "Ajuste: …". Clicar troca a imagem grande. Só aparece com 2 ou mais versões.

- [ ] **Step 1:** mova `schedule-art-dialog` e `schedule-days` e atualize os imports do estúdio.
- [ ] **Step 2:** implemente a página e os componentes.
- [ ] **Step 3:** os 4 comandos passam.
- [ ] **Step 4:** commit `feat(artes): add artwork detail page`.

---

## Etapa (c): extrair e reutilizar o dialog

Use a skill `caveman:safe-refactor` nas Tasks 5 e 6. Antes da Task 5, rode o checklist manual do estúdio (abaixo) para ter a base de comparação.

### Task 5: mover o dialog sem mudar nada

**Files:**
- Move: `app/app/estudio/components/ai-editor-dialog.tsx` → `components/common/ai-editor/ai-editor-dialog.tsx`
- Move: `brand-assurance-note.tsx` e `studio-composer-shell.tsx` → `components/common/`
- Modify: os imports em `studio-workspace.tsx`, `brand-kit-summary-card.tsx`, `start-mode-picker.tsx`, `guided-questions.tsx` e `studio-prompt-form.tsx`

- [ ] **Step 1:** `git mv` dos arquivos e troca de imports. Nenhuma linha do JSX muda: confira com `git diff -M --stat`, que deve mostrar os renames com mudança só nos imports.
- [ ] **Step 2:** os 4 comandos passam.
- [ ] **Step 3:** commit `refactor(studio): move AI editor dialog to common`.

### Task 6: ajuste como versão + hook compartilhado

**Files:**
- Create: `lib/content/adjust-artwork.ts`, `lib/content/adjust-artwork.test.ts` (funções puras)
- Create: `lib/content/append-artwork-version.ts` (`server-only`)
- Create: `actions/discard-artwork-adjustments/index.ts`, `schema.ts`, e `hooks/mutations/use-discard-artwork-adjustments.ts`
- Create: `hooks/use-artwork-adjustment.ts`
- Modify:
  - `lib/validations/image-generation.ts`: `artworkId: z.uuid().optional()`. A refine passa a exigir `referenceImage` **ou** `artworkId` quando há `editInstruction`. `GenerateImageResult` ganha `version?: number`.
  - `app/api/generate/route.ts`: com `editInstruction` e `artworkId`, baixa o render da última versão daquela arte (filtrando pela loja) como referência e grava via `appendArtworkVersion`, que devolve `{ artworkId, version }`. Arte de outra loja → 404 `"Não encontramos essa arte."`. Sem `artworkId`, o fluxo atual não muda.
  - `app/app/estudio/hooks/use-studio.ts`: `adjustVariation` e `discardAdjustments` passam a usar o hook.

**Interfaces:**
- `toAdjustImageInput({ artworkId, imageDataUrl, prompt, editInstruction, formatId, variationIndex }): GenerateImageInput`: com `artworkId`, manda `artworkId` e nunca `referenceImage`. Sem ele, manda `referenceImage: imageDataUrl`.
- `getVersionsToDiscard(versions: number[], keepVersion: number): number[]`: devolve as versões maiores que `keepVersion`.
- `appendArtworkVersion({ storeId, artworkId, image, editInstruction }): Promise<{ artworkId: string; version: number } | null>`: numa transação, lê o máximo de `version` (verificando o `storeId` pela arte), insere `max+1` com `layers: { editInstruction }` e faz upload antes, removendo o arquivo se der erro, como em `saveArtworkDraft`.
- `discardArtworkAdjustments({ artworkId, keepVersion }): Promise<AuthActionResult>`: confere a loja, apaga as versões de `getVersionsToDiscard` e remove os arquivos do storage.
- `useArtworkAdjustment({ onLimitReached })` → `{ isAdjusting, adjustArtwork(target): Promise<GenerateImageResult | null>, discardAdjustments({ artworkId, keepVersion }): Promise<boolean> }`
  - `target = { artworkId?, imageUrl, prompt, formatId, variationIndex, editInstruction }`
  - Dentro dele: a checagem `useArtQuota().getQuotaError()` (`"limit"` chama `onLimitReached`), `compressImageDataUrl` só quando não há `artworkId`, a mutation, `registerUsedArts(1)` e o toast de erro com as mesmas mensagens de hoje.

- [ ] **Step 1:** testes de `toAdjustImageInput` (com e sem `artworkId`) e de `getVersionsToDiscard` (`[1,2,3,4]`, keep 2 → `[3,4]`; keep 4 → `[]`).
- [ ] **Step 2:** `npm test` falha, depois implemente, e `npm test` passa.
- [ ] **Step 3:** rota, action, hook e estúdio. O estúdio guarda a `version` aberta no `editorOriginalImage` e, ao descartar, chama `discardAdjustments` além de restaurar a imagem em memória.
- [ ] **Step 4:** os 4 comandos passam.
- [ ] **Step 5:** commit `feat(studio): save AI adjustments as artwork versions through a shared hook`.

### Task 7: dialog no detalhe

**Files:**
- Modify: `app/app/artes/[artworkId]/components/artwork-detail-view.tsx`

- [ ] **Step 1:** renderize `AiEditorDialog` com as mesmas props do estúdio:
  - `variationIndex={0}`
  - `imageUrl`: a versão atual
  - `format`: `findArtFormat(getArtFormatIdFromSize(...))`
  - `onAdjust`: `adjustArtwork`, seguido de `router.refresh()` quando der certo
  - `onDiscard`: `discardAdjustments({ artworkId, keepVersion: versionWhenOpened })` e depois `router.refresh()`
  - `onApprove`: fecha o dialog e abre o agendamento
  - `TrialLimitDialog` em `onLimitReached`
- [ ] **Step 2:** os 4 comandos passam.
- [ ] **Step 3:** commit `feat(artes): adjust artworks with AI from the detail page`.

### Checklist manual (antes da Task 5 e depois da Task 7)

**No estúdio:**
1. Gere 1 arte e clique em "Ajustar com IA". Confira: título "Ajustar com a IA", 4 ideias rápidas, clipe, microfone e setinha.
2. Clique numa ideia rápida e envie. Devem aparecer o overlay "Aplicando ajuste…", o toast `Ajuste aplicado: "…"` e a linha em "Ajustes feitos".
3. "Salvar versão" mostra o toast "Versão salva". "Descartar alterações" volta para a imagem original.
4. "Aprovar arte" abre o agendamento.

**No detalhe** (`/app/artes/<id>`), faça os mesmos passos. Depois de ajustar, a imagem grande e o histórico mostram a versão nova. Descartar volta para a versão anterior, também na listagem.

## Fechamento

- [ ] `superpowers:verification-before-completion`: os 4 comandos, com a saída.
- [ ] `ponytail:ponytail-review` em `git diff feature/aprovacao-de-textos..HEAD`.

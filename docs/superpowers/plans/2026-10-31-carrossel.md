# Carrossel de Instagram: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** gerar um carrossel de 3 a 10 slides (1080x1350): primeiro os textos, aprovados pelo lojista, depois a capa (com versões) e, em seguida, os demais slides no mesmo estilo. Inclui prévia com swipe, reordenação, ajuste de um único slide e download em .zip.

**Architecture:**
- **Formato:** novo formato `carousel` (kind `carousel`), gerado em 1024x1280 e entregue em 1080x1350 via `fitToFormat`.
- **Textos:** uma action nova, `generate-carousel-copy`, escreve os textos (`LUNA_MODEL` + regras do ig-carousel). A tela `/app/estudio/aprovar` ganha um modo carrossel.
- **Capa:** sai pela `/api/generate` atual (cada versão da capa é uma arte, como as variações de hoje). Ao escolher a capa, a rota `/api/carousel-slide` descreve o estilo dela uma única vez e o guarda em `artwork_versions.layers.carouselStyle`.
- **Slides seguintes:** gerados um por requisição, cada um recebendo a capa como referência e o mesmo bloco de estilo. São gravados em `artwork_slides`.
- **Edição:** o detalhe `/app/artes/[id]` vira o editor do carrossel.

**Tech Stack:** Next.js 16, Drizzle, sharp, OpenAI SDK, `@dnd-kit/core` (já instalado), **`fflate` (dependência nova, para o .zip)**, `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-31-banner-e-carrossel-design.md` (seção Carrossel).

## Banco: SQL proposto (precisa da sua aprovação antes da Task 1)

```sql
CREATE TABLE "artwork_slides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "artwork_id" uuid NOT NULL REFERENCES "artworks"("id") ON DELETE cascade,
  "position" integer NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "render_path" text NOT NULL,
  "copy" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "artwork_slides_artwork_id_position_unique" UNIQUE("artwork_id", "position"),
  CONSTRAINT "artwork_slides_position_check" CHECK ("position" BETWEEN 1 AND 10),
  CONSTRAINT "artwork_slides_version_check" CHECK ("version" >= 1)
);
CREATE INDEX "artwork_slides_artwork_id_idx" ON "artwork_slides" ("artwork_id");
ALTER TABLE "artwork_slides" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "membros da loja" ON "artwork_slides" AS PERMISSIVE FOR ALL TO "authenticated"
  USING (exists (select 1 from "artworks" where "artworks"."id" = "artwork_slides"."artwork_id" and public.is_store_member("artworks"."store_id")))
  WITH CHECK (exists (select 1 from "artworks" where "artworks"."id" = "artwork_slides"."artwork_id" and public.is_store_member("artworks"."store_id")));
```

- A política de acesso é a mesma de `artwork_versions`.
- `copy` guarda `{ role, headline, body }` de cada slide.
- O slide 1 aponta para o mesmo arquivo da capa escolhida.
- O carrossel usa o valor `carrossel`, que já existe em `content_format`.

## Decisões

- **Número de slides:** de 3 a 10, como você pediu (a skill sugere de 6 a 10). O "tema" é o próprio pedido do lojista. Não há um seletor de tema visual, porque o estilo vem da marca e da capa.
- **Estrutura do ig-carousel:**
  - capa com no máximo 6 palavras;
  - slide 2 com o que está em jogo;
  - uma ideia por slide (título de 3 a 7 palavras, corpo com até 25 palavras);
  - slide de resumo quando houver 6 ou mais slides;
  - último slide com um único CTA;
  - numeração `3/8` e `@` da loja pequeno no rodapé de cada slide;
  - legenda do post com as regras atuais (`lintCaption`, até 5 hashtags).
- **Variações = versões da capa:** o seletor "Variações" vira "Versões da capa" quando o formato é carrossel.
- **Custo no teste:** cada capa gasta 1 arte, e cada slide de 2 a N gasta mais 1.
- **Uma requisição por slide:** cada uma cabe nos 180 s de `maxDuration`, a UI mostra o progresso, e a geração roda com no máximo 3 slides ao mesmo tempo.
- **Regenerar ou ajustar um slide:** atualiza só a linha `(artwork_id, position)` e incrementa `version`. O arquivo antigo é removido. Não há histórico por slide.
- **Reordenar:** uma action com transação que desloca as posições (+100) e depois grava a ordem final, para não violar o `UNIQUE`. A UI usa dnd-kit e também botões "Mover para a esquerda/direita", para teclado.
- **Lista de Artes:** o carrossel aparece com a capa como miniatura. `getArtworkImageUrls` passa a cair no slide 1 quando a arte tem slides.
- **Publicar ou agendar no Instagram:** fica fora. O detalhe do carrossel mostra só "Baixar .zip".

## Global Constraints

- Siga o `CLAUDE.md`. Não rode `npm run dev`. Rode Prettier e lint só nos arquivos tocados.
- **Antes de `db:migrate`:** confira se a migração gerada bate com o SQL acima e peça confirmação.
- Ao fim de cada etapa: lint, `next typegen` + tsc, `npm test` e `npm run build`.
- Tamanho final do slide: 1080x1350.

## Review Focus

1. **Regenerar o slide 3:** os outros slides não mudam (nem `render_path`, nem `version`). Coberto pelo teste `replaceSlide` e pelo `UPDATE ... WHERE artwork_id AND position`.
2. **Reordenar 1↔N com o `UNIQUE`:** não pode haver erro de chave duplicada. Coberto pelo teste `planSlideReorder` e pela transação.
3. **Uma geração falha no meio (slide 5 de 8):** os slides prontos ficam salvos, e o lojista regenera só o 5. Fica para a revisão.
4. **O bloco de estilo é idêntico em todos os prompts.** Coberto pelo teste `buildSlidePrompt`.
5. **O .zip sai com os arquivos na ordem atual** (`slide-01.png`…). Coberto pelo teste `getSlideFileName`.

---

## Etapa (b): textos do carrossel

### Task 1: tabela, formato e schema dos textos (TDD)

**Files:**
- Modify: `db/schema.ts`: tabela `artworkSlides` com os helpers `id()` e `createdAt()`, e a política no padrão de `artworkVersions`. Gere a migração com `npx drizzle-kit generate --name artwork_slides` e **pare para confirmar o `db:migrate`**.
- Modify: `lib/mocks/studio.ts`: `ArtFormatKind` inclui `"carousel"`, e o formato `carousel` usa geração 1024x1280, saída 1080x1350, `ratioLabel` "4:5" e o label "Carrossel".
- Modify: `lib/art-options.ts`: `hasCaption` vale `true` para `carousel`.
- Create: `lib/carousel/carousel-copy.ts` e `lib/carousel/carousel-copy.test.ts`

**Interfaces:**
- `carouselSlideRoleSchema = z.enum(["cover", "stake", "idea", "recap", "cta"])`
- `carouselSlideCopySchema = z.object({ role, headline: z.string().trim().min(1).max(60), body: z.string().trim().max(180) })`
- `carouselCopySchema = z.object({ slides: z.array(carouselSlideCopySchema).min(3).max(10), caption: z.string().trim().min(1).max(CAPTION_LIMIT) })`
- `getCarouselCopyIssues(copy, { forbiddenTerms, slideCount }): string[]`. Aponta:
  - quantidade de slides diferente de `slideCount`
  - 1º slide que não é `cover`, ou último que não é `cta`
  - mais de um `cta`
  - capa com mais de 6 palavras
  - título com mais de 7 palavras
  - corpo com mais de 25 palavras
  - resumo (`recap`) faltando quando `slideCount >= 6`
  - termos proibidos
  - os problemas de `lintCaption(caption, { maxHashtags: 5 })`

- [ ] **Step 1:** testes, um por regra acima, mais `aceita um carrossel de 3 slides cover/idea/cta`.
- [ ] **Step 2:** falha, depois implementação, depois passa. Commit `feat(carousel): add slides table, carousel format and copy rules`.

### Task 2: action `generate-carousel-copy` e aprovação

**Files:**
- Create: `actions/generate-carousel-copy/index.ts`, `schema.ts` e `hooks/mutations/use-generate-carousel-copy.ts`
  - Mesmo padrão de `generate-post-copy`: rate limit `generateCarouselCopyByUser` (20 a cada 10 min), JSON, no máximo 2 tentativas e `humanizeCaption` em todos os textos.
  - Aceita `field: { slide: number } | "caption"` para "Gerar outra opção" de um slide só.
- Modify: `lib/post-draft.ts`: `slideCount?: number` (de 3 a 10) e `carouselCopy?: CarouselCopy`.
- Modify: `components/common/format-options-popover.tsx`: no formato carrossel, um passo de "Slides" (– 3…10 +) e o rótulo "Versões da capa".
- Modify: `app/app/estudio/aprovar/components/copy-approval-workspace.tsx`: com o formato carrossel, renderiza o `CarouselCopyForm`.
- Create: `app/app/estudio/aprovar/components/carousel-copy-form.tsx`
  - Uma lista numerada de slides (`3/8`), cada um com título e corpo editáveis e o botão "Gerar outra opção".
  - A legenda fica embaixo.
  - O bloqueio por `{{placeholder}}` reaproveita `findPlaceholders`.

- [ ] **Step 1:** implemente.
- [ ] **Step 2:** checagens. Commit `feat(carousel): write and approve carousel copy`.

## Etapa (c): imagens com consistência

### Task 3: prompts e geração por slide (TDD na parte pura)

**Files:**
- Create: `lib/carousel/slide-prompt.ts` e `.test.ts`: `buildSlidePrompt({ style, slide, position, slideCount, handle }): string`. Começa com o bloco `CAROUSEL STYLE (identical on every slide):\n${style}`, depois `Slide ${position}/${slideCount}` e os textos aprovados via `buildApprovedCopyInstruction`.
- Create: `lib/carousel/slides.ts` e `.test.ts`, com funções puras:
  - `replaceSlide(slides, position, slide)`
  - `planSlideReorder(currentPositions: number[], newOrder: number[]): { tempOffset: number; final: { from: number; to: number }[] }`
  - `getSlideFileName(position) => slide-${pad2(position)}.png`
- Create: `lib/content/artwork-slides.ts` (server-only): `getCarouselStyle`, `saveCarouselStyle`, `upsertSlide`, `listSlides` e `reorderSlides`, todos verificando a loja como em `artwork-versions.ts`.
- Create: `app/api/carousel-slide/route.ts`
  - Recebe `POST { artworkId, position, slideCount, slide, editInstruction? }`. Exige login, aplica rate limit e conta 1 arte.
  - Na primeira chamada, se a capa ainda não tem `carouselStyle`, pede ao `IMAGE_PROMPT_MODEL` que descreva o estilo da capa (fundo, tipografia, paleta, rodapé e posição dos textos) e salva isso no `layers` da capa.
  - Gera com `images.edit`, usando a capa como referência 1 (e o slide atual como referência 2 quando há `editInstruction`).
  - Depois aplica `applyLogo(…, "carousel")`, `fitToFormat`, `upsertSlide` e devolve `{ imageUrl, position, version }`.
- Modify: `lib/content/artwork-images.ts`: cai no slide 1 quando a arte não tem versão com `render_path`, ou quando é um carrossel.

- [ ] **Step 1:** testes:
  - `buildSlidePrompt repete o bloco de estilo idêntico em todas as posições`
  - `mostra 3/8`
  - `replaceSlide troca só a posição pedida`
  - `planSlideReorder nunca repete posição no meio`
  - `getSlideFileName`
  - o teste de `fitToFormat` passa a cobrir `carousel` (1080x1350), automaticamente
- [ ] **Step 2:** falha, depois implementação, depois passa. Rota e helpers.
- [ ] **Step 3:** checagens. Commit `feat(carousel): generate consistent slides from the chosen cover`.

## Etapa (d): UI de prévia, ajuste e download

Use a skill `frontend-design:frontend-design` antes da Task 4 e siga o `DESIGN.md`.

### Task 4: escolher a capa e gerar os slides no estúdio

**Files:**
- Modify: `app/app/estudio/hooks/use-studio.ts` e `preview-variations-result.tsx`. No formato carrossel, as variações são as capas, e o botão vira "Usar esta capa e gerar os slides".
- Create: `hooks/use-generate-carousel.ts`: chama `/api/carousel-slide` para os slides de 2 a N, no máximo 3 ao mesmo tempo, com progresso `x de N` e cancelamento. Ao terminar, faz `router.push(getArtworkRoute(id))`.
- Create: `actions/discard-cover-versions`: as capas não escolhidas viram `status = 'descartada'`.

- [ ] **Step 1:** implemente.
- [ ] **Step 2:** checagens. Commit `feat(carousel): pick a cover and generate the remaining slides`.

### Task 5: editor do carrossel no detalhe

**Files:**
- Modify: `lib/content/get-artwork-detail.ts`: devolve `slides: { position, imageUrl, copy, version }[]` quando o formato é `carrossel`.
- Create em `app/app/artes/[artworkId]/components/`:
  - `carousel-viewer.tsx`: um trilho com `scroll-snap` (swipe nativo), setas, contador `3/8` e miniaturas.
  - `carousel-slide-list.tsx`: reordena com dnd-kit e com os botões ← →.
  - `carousel-actions.tsx`: "Ajustar com IA" abre o `AiEditorDialog` existente para o slide atual, e `onAdjust` chama `/api/carousel-slide` com `editInstruction`. Também tem "Regenerar slide" e "Baixar .zip" (`fflate.zipSync` + `downloadFile`, com `getSlideFileName`).
- Create: `actions/reorder-carousel-slides` e o hook de mutation dele.
- Modify: `artwork-detail-view.tsx`: com `format === "carrossel"`, renderiza o editor no lugar da imagem única e esconde "Agendar".
- Dependência: `npm i fflate`.

- [ ] **Step 1:** implemente.
- [ ] **Step 2:** checagens. Commit `feat(carousel): preview, reorder, adjust one slide and download zip`.

## Fechamento

- [ ] `verification-before-completion` e `ponytail-review` em `git diff ff9f394..HEAD`.

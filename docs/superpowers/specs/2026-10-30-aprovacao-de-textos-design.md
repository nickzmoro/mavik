# Aprovação de textos antes da arte

Data: 2026-10-30
Branch: `feature/image-generator-integration`

## Intenção

Hoje o input da Início não faz nada: `handleGenerateArt` está vazio. Este trabalho tem dois objetivos:

1. Fazer o input funcionar, com o mesmo seletor de formato e variações do estúdio.
2. Criar uma etapa em que o lojista vê, edita e aprova os textos do post antes de gastar uma geração de imagem.

O motivo: o texto da arte e a legenda são o que o lojista mais quer controlar. Gerar imagem com texto errado gasta arte do plano e frustra.

## Fluxo

Início → envio → `/app/estudio/aprovar` (gera textos) → edita e aprova → `/app/estudio` gera a arte com os textos aprovados.

## Metas

- Input da Início com anexos, voz, `promptStarters`, seletor de formato e variações (o mesmo componente do estúdio) e a setinha `RoundSendButton` (`label="Gerar arte"`).
- O limite do teste é respeitado como no estúdio: arte esgotada abre o aviso de limite, e variações acima do restante ficam bloqueadas.
- Uma server action gera um JSON validado com título (parte fina + destaque), subtítulo, até 3 tópicos (título curto + 1 frase), CTA e legenda.
- A tela de aprovação tem cada campo editável, "Gerar outra opção" por campo, uma prévia simples, um resumo de formato e variações, voltar sem perder o que foi digitado, estados de carregamento e erro, e rate limit.
- A arte usa o texto aprovado **idêntico**.

## Fora do escopo

- O modo livre e o modo guiado do próprio estúdio não passam pela aprovação. Só o envio da Início passa.
- Não há rascunho persistido no banco.
- PDFs, links e materiais anexados não são enviados para a geração de texto nem de imagem, igual ao estúdio hoje.

## Antimetas (falha mesmo funcionando)

- O modelo de imagem reescreve, traduz ou resume o texto aprovado.
- Números, preços ou prazos são inventados.
- O componente ou a lógica de formato e variações é duplicado entre a Início e o estúdio.
- O lojista perde o texto digitado ao voltar para a Início.

## Decisões do dono do produto

1. **Variações:** um único conjunto de textos para todas as variações. As variações mudam só o visual.
2. **"Vai na arte":** cada campo de texto tem um botão "Vai na arte". Título e CTA vêm ligados, e subtítulo e tópicos vêm desligados. Só os campos ligados vão para a imagem, e a prévia mostra só esses campos. A legenda nunca vai para a imagem.
3. **Story:** a legenda fica escondida e não é gerada.
4. **Transporte de dados:** abordagem A (abaixo).

## Abordagens consideradas

- **A. Estado client com `sessionStorage` (escolhida).** Um `PostDraftProvider` no `app/app/layout.tsx` guarda prompt, formato, variações, anexos (`File`) e textos. A parte serializável é espelhada no `sessionStorage`. Um F5 perde só os anexos, e a tela mostra "Anexe a foto de novo". Não mexe no banco e é a menor quantidade de código.
- **B. Rascunho no banco.** Sobrevive a F5 e a troca de aparelho. Exige migração e upload para o storage, e deixa rascunhos órfãos. Foi descartada por pedir mudança no banco e por ser mais código.
- **C. URL + IndexedDB.** A URL fica enorme e o IndexedDB traz mais casos de erro. Descartada.

## Como funciona

### (a) Input da Início

- `format-options-popover.tsx` e `round-send-button.tsx` vão para `components/common/`. Os imports do estúdio são atualizados.
- `formatArtCount` e `formatVariationCount` saem de `use-studio.ts` para um módulo comum, porque o popover depende deles.
- A lógica de limite do teste ("restam N", `variationCount` inicial, bloqueio, abrir o aviso de limite) sai de `use-studio` para um hook comum, `useArtQuota`. O estúdio e a Início usam esse hook. O `TrialLimitDialog` também vira comum se a Início precisar abri-lo.
- Ao enviar, o form valida com `generateArtFormSchema`, grava no `PostDraftProvider` e chama `router.push(routes.studioApproval)`.

### (b) Server action `actions/generate-post-copy`

- Arquivos `index.ts` e `schema.ts`, no padrão de `generate-sample-caption`: `AuthActionResult`, `getCurrentUserId` e `rateLimitRules.generatePostCopyByUser` (regra nova em `lib/rate-limit`).
- Usa `LUNA_MODEL` com saída JSON e valida a resposta com Zod. Se a validação falhar, tenta mais uma vez mandando os erros de volta ao modelo, como faz `writeLintedCaption`.
- Entrada: `prompt`, `format`, `field?` (para "Gerar outra opção" de um campo só) e `currentCopy?` (contexto do campo a regenerar).
- O contexto da marca (tom, palavras preferidas e proibidas, regras) vem do mesmo lugar que `generate-post-caption` usa.
- Legenda: primeira frase com até 125 caracteres, 1 CTA, até 5 hashtags. Usa `lintCaption` com `maxHashtags: 5` e `humanizeCaption` (limpeza do ig-human). Termos proibidos são checados com `findForbiddenTerms`.
- Números e preços que o lojista não deu viram `{{placeholder}}`. O schema não bloqueia placeholders, e a UI destaca cada um.
- Story: a legenda não é pedida e o schema aceita `caption` ausente.
- No client, a chamada passa por `hooks/mutations/use-generate-post-copy.ts` (React Query), que exporta a função da mutation key, como os hooks de mutation existentes.

### (c) Tela `/app/estudio/aprovar`

- Componentes em `app/app/estudio/aprovar/components/`, com shadcn e seguindo o `DESIGN.md`.
- Sem rascunho no provider (acesso direto pela URL), a tela redireciona para a Início.
- Cada campo editável usa React Hook Form + Zod, com o mesmo schema da action, e tem "Gerar outra opção" e "Vai na arte".
- Placeholders `{{...}}` aparecem destacados. A aprovação é bloqueada enquanto houver um placeholder num campo que vai na arte ou na legenda, com a mensagem "Troque {{preço}} pelo valor real".
- A prévia simples respeita a proporção do formato e mostra os campos ligados.
- Há um resumo do formato e das variações.
- "Voltar" leva à Início com o prompt preservado, porque a Início lê o rascunho do provider.
- "Aprovar e gerar arte" usa `RoundSendButton`, grava os textos aprovados no provider e leva ao estúdio.

### (d) Ligação com o estúdio

- `useStudio` lê o rascunho aprovado do provider e dispara `generate` automaticamente uma vez. Depois, limpa o rascunho.
- A legenda aprovada vira o `caption` inicial do estúdio, e o estúdio não gera outra legenda.
- `generateImageSchema` ganha `approvedCopy?: string[]`, com os textos ligados em ordem.
- Em `app/api/generate/route.ts`, o código monta o trecho de texto **depois** do LLM que escreve o prompt e o concatena ao prompt final da imagem. Formato: `The image must contain exactly these texts in Brazilian Portuguese, copied character by character, with no other text: "…", "…". Do not rewrite, translate, shorten or add words.` O mesmo trecho também vai para o LLM, para ele reservar espaço no layout.
- Uma função pura, `buildApprovedCopyInstruction(approvedCopy)`, monta esse trecho e é testada.

## Testes (TDD)

O projeto roda `node --test "lib/**/*.test.ts"`, então os testes ficam em `lib/`.

- Schema e regras do texto gerado em `lib/post-copy/` (o `schema.ts` da action reexporta): limites de tamanho, no máximo 3 tópicos, 1 CTA, regras da legenda.
- `buildApprovedCopyInstruction`: cada texto aprovado aparece idêntico e entre aspas no prompt da imagem, inclusive com acentos, aspas e emoji.
- Formato e variações: o valor que a Início grava no rascunho é aceito pelo mesmo schema que o estúdio usa (`generateImageSchema.shape.format` e `variationCountOptions`).

## Cada etapa termina com

`npm run lint`, `tsc --noEmit` e `npm test` sem erros.

## Decisões minhas (confira)

- A regra do ig-caption fala em 3 hashtags, mas você pediu até 5. Fica 5, via o parâmetro `maxHashtags` que `lintCaption` já aceita.
- Limites de tamanho propostos: título fino até 30 caracteres, destaque até 30, subtítulo até 90, tópico com título até 30 e frase até 110, CTA até 30, legenda até `CAPTION_LIMIT` (2200).
- "Gerar outra opção" de um campo conta no rate limit da action, igual a uma geração completa.
- Aprovação bloqueada enquanto houver placeholder num campo ativo.

## Fica para quem implementar

- Layout exato da prévia e da tela, seguindo o `DESIGN.md`.
- Nomes finais de hooks e arquivos, em kebab-case.

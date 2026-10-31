# Banner e carrossel no estúdio

Data: 2026-10-31
Branch: `feature/banner-carrossel` (a partir de `feature/area-artes`)

## Intenção

Hoje o estúdio só gera posts de Instagram: 1:1, 4:5 e story. O lojista também precisa de banners para site, LinkedIn, Facebook e YouTube, e de carrosséis de Instagram com aparência consistente entre os slides. O seletor de formato da Início reaproveita o mesmo componente, então ganha as mesmas opções.

## Entrega em dois planos

1. **Banner** (etapa a): pequeno, tem uma migração de uma linha.
2. **Carrossel** (etapas b, c e d): textos, imagens consistentes, prévia, ajuste e .zip. Precisa da tabela nova `artwork_slides`.

## Decisões do dono do produto

- **Destinos de banner:**

  | Destino | Tamanho final | Observação |
  | --- | --- | --- |
  | Banner de site | 1920x600 | |
  | Capa LinkedIn | 1584x396 | |
  | Capa Facebook | 1640x624 | |
  | Banner YouTube | 2560x1440 | área segura central de 1546x423 |

  Cada destino é uma opção do seletor, com nome e proporção.
- **Banco do banner:** só o valor `banner` no enum `content_format` (`ALTER TYPE content_format ADD VALUE 'banner'`). O destino é deduzido do tamanho da imagem salva, porque cada proporção é única.
- **Banco do carrossel:** tabela nova `artwork_slides`. O SQL é mostrado antes de rodar.
- **Publicar ou agendar carrossel no Instagram:** fica fora desta entrega e vira uma etapa separada.
- **Ordem:** primeiro o banner, depois o carrossel.

## Banner: como funciona

- **Geração:** o modelo gera em **2048x1152**. É o mesmo par de números que o story já usa (1152x2048), invertido, então é um tamanho que sabidamente funciona. Depois o `sharp` faz um **recorte central** na proporção do destino e **redimensiona** para o tamanho exato. Nada é esticado.
- **Área segura:** é a faixa central que sobra depois do recorte, com margem de 6%. No YouTube, é a área de 1546x423 convertida para o quadro gerado. O prompt de composição horizontal manda o texto num lado e o produto no outro, tudo dentro dessa área, e nada de texto perto das bordas.
- **Logo:** é colocada dentro da área segura, no canto inferior direito dela, e não no canto do quadro gerado, que o recorte pode cortar. Não existe rodapé gerado por código hoje, então não há rodapé para reposicionar.
- **Lógica pura com teste:**
  - `getFormatCrop` (recorte e tamanho final)
  - `getSafeArea` (área segura no quadro gerado)
  - `getLogoBox` (a logo cabe na área segura)
  - um teste com `sharp` real: uma imagem de 2048x1152 vira exatamente o tamanho final de cada destino
- **Banner não é post de Instagram:**
  - Não tem legenda: a tela de aprovação esconde a legenda, como faz no story.
  - Não aparece "Agendar" nem "Publicar". Só "Baixar", no estúdio e no detalhe.
- **Artes:** o filtro ganha "Banner". O detalhe deduz o destino pela proporção (a função atual passa a escolher o formato de proporção mais próxima).
- **Teste (trial):** 1 banner gasta 1 arte. As variações continuam de 1 a 3.

## Carrossel: como funciona (segundo plano)

- **Opções:** número de slides (3 a 10) e tema.
- **Textos:** são gerados primeiro, com `LUNA_MODEL` e as regras da skill ig-carousel: uma capa que faz deslizar, uma ideia por slide e um único CTA no slide final. O lojista edita e aprova numa versão da tela `/app/estudio/aprovar` com os campos do carrossel.
- **Consistência visual:** a capa é gerada primeiro. Cada slide seguinte recebe a capa como imagem de referência e o **mesmo** bloco de estilo (fundo, tipografia, paleta, rodapé), escrito uma vez e repetido igual em todos os prompts.
- **Variações:** são versões da **capa**. O carrossel inteiro não é multiplicado.
- **Custo no teste:** cada slide gasta 1 arte, e cada capa extra gasta mais 1. Exemplo: 5 slides com 3 capas gastam 7 artes.
- **Tamanho:** 1080x1350 por slide (geração em 1024x1280, depois redimensionado).
- **UI:**
  - prévia em sequência com swipe
  - reordenar slides
  - regenerar ou ajustar UM slide, com o dialog "Ajustar com IA" existente
  - baixar tudo em .zip
- **Banco:** `artwork_slides(id, artwork_id, position, render_path, copy jsonb, version, created_at)`, com `unique(artwork_id, position)` e a mesma política de acesso de `artwork_versions`. O SQL final sai no plano do carrossel, para aprovação.

## Fora do escopo

- Publicar ou agendar carrossel no Instagram.
- Rodapé gerado por código.
- Novos tamanhos de geração além de 2048x1152 e 1024x1280.

## Antimetas

- Banner com texto cortado pelo recorte.
- Banner esticado ou distorcido.
- Slides do carrossel com fundo ou tipografia diferentes entre si.
- Regenerar um slide e alterar outro.

## Decisões minhas (confira)

- Margem da área segura: 6% de cada lado da faixa de recorte.
- O banner do YouTube sai de 2048x1152 ampliado para 2560x1440 (25% maior). A nitidez cai um pouco. Se o modelo aceitar um tamanho maior, troco depois.
- A logo do banner tem no máximo 18% da largura e 30% da altura da área segura.

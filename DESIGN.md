# DESIGN.md — Mavik

Design system do Mavik: estúdio de marketing para pequenos negócios. Tudo deriva do logo — duas violetas (Violeta e Lavanda), Poppins para títulos e Inter para texto. O produto fala português brasileiro.

---

## Fontes

| Variável CSS     | Fonte   | Uso                                                                  |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `--font-display` | Poppins | Títulos (`display`, `h1`–`h3`), botões de marca, números em destaque |
| `--font-body`    | Inter   | Corpo, `small`, `caption`, formulários, tabelas                      |

Carregue Poppins via `next/font/google` com os pesos 400, 500, 600 e 700. O peso 600 não tem arquivo local — use Google Fonts ou haverá fallback para 700.

---

## Estilos tipográficos

| Nome      | Família | Tamanho | Peso | Line-height | Uso                                     |
| --------- | ------- | ------- | ---- | ----------- | --------------------------------------- |
| `display` | Poppins | 48px    | 700  | 1.1         | Hero; um por página                     |
| `h1`      | Poppins | 32px    | 700  | 1.2         | Título de página                        |
| `h2`      | Poppins | 24px    | 600  | 1.25        | Título de seção                         |
| `h3`      | Poppins | 18px    | 600  | 1.3         | Título de card e diálogo                |
| `body`    | Inter   | 16px    | 400  | 1.6         | Parágrafos; max 75 caracteres por linha |
| `small`   | Inter   | 14px    | 400  | 1.5         | Apoio, tabelas, help de form            |
| `caption` | Inter   | 12px    | 500  | 1.4         | Rótulos, chips, metadados               |

---

## Tokens de cor

Use sempre os tokens semânticos em UI — nunca hex direto nem a escala `violet-*`.

### Fundos e superfícies

| Token       | Light     | Dark      | Uso                              |
| ----------- | --------- | --------- | -------------------------------- |
| `bg`        | `#ffffff` | `#12092b` | Fundo de página                  |
| `surface`   | `#f8f6fe` | `#1a0f3c` | Cards e telas sobre `bg`         |
| `surface-2` | `#efe8fd` | `#2a1366` | Chips, hover, botões secundários |

### Texto

| Token    | Light     | Dark      | Uso                                            |
| -------- | --------- | --------- | ---------------------------------------------- |
| `text`   | `#1b1530` | `#f4f0ff` | Corpo e títulos em todos os fundos             |
| `muted`  | `#5e5877` | `#b9b0d6` | Secundário: help, captions, descrições         |
| `border` | `#e2ddf0` | `#3a2a72` | Hairlines, bordas de card e input, separadores |

### Ações primárias

| Token           | Light     | Dark      | Uso                                                                                                 |
| --------------- | --------- | --------- | --------------------------------------------------------------------------------------------------- |
| `primary`       | `#5926c8` | `#b390fa` | Botões primários, links, estados ativos                                                             |
| `primary-hover` | `#3b1a8c` | `#cbb3fc` | Hover/press sobre `primary`                                                                         |
| `primary-brand` | `#5926c8` | `#5926c8` | Violeta fixo nos dois temas — CTAs de marketing                                                     |
| `on-primary`    | `#ffffff` | `#1a0f3c` | Texto e ícones sobre `primary`                                                                      |
| `accent`        | `#b390fa` | `#b390fa` | Lavanda — fills de apoio, bordas ativas. **Nunca texto branco** sobre ela (2.5:1); use `violet-900` |
| `focus`         | `#7440e0` | `#cbb3fc` | Anel de foco: 2px solid, 2px offset                                                                 |

### Status

| Token        | Light     | Dark      | Uso                                                                               |
| ------------ | --------- | --------- | --------------------------------------------------------------------------------- |
| `success`    | `#0e8a6b` | `#4fd1ae` | Ícones e bordas em `success-bg`. Texto pequeno usa `text` (3.84:1 no light)       |
| `success-bg` | `#e3f6f0` | `#103b33` | Fundo de alerta e badge de sucesso                                                |
| `warning`    | `#9a5b00` | `#f5b94d` | Texto e ícones em `warning-bg`                                                    |
| `warning-bg` | `#fff1d6` | `#3d2b0b` | Fundo de alerta de aviso                                                          |
| `danger`     | `#c7343a` | `#ff8a8f` | Erros e ações destrutivas. Texto pequeno usa `text` em `danger-bg` (4.49:1 light) |
| `danger-bg`  | `#fde8e8` | `#431b22` | Fundo de alerta de erro                                                           |

> **Proporção de cores:** ~60% neutros claros · ~25% violeta · ~10% lavanda · ~5% Noite.  
> **Status sempre carrega palavra ou ícone** — nunca cor sozinha.

---

## Espaçamento

Grade de 4px em passos de 8.

| Token     | Valor | Uso                                        |
| --------- | ----- | ------------------------------------------ |
| `space-1` | 4px   | Gap ícone–rótulo, insets apertados         |
| `space-2` | 8px   | Gap interno de chips e grupos de botões    |
| `space-3` | 12px  | Padding horizontal de input, gaps de lista |
| `space-4` | 16px  | Gap padrão; padding de botão               |
| `space-5` | 24px  | Padding de card                            |
| `space-6` | 32px  | Gap entre cards e grupos de form           |
| `space-7` | 48px  | Espaçamento de seção (mobile)              |
| `space-8` | 64px  | Espaçamento de seção (desktop)             |

---

## Raios

| Token    | Valor | Uso                                                 |
| -------- | ----- | --------------------------------------------------- |
| `r-sm`   | 6px   | Elementos pequenos: checkboxes, tooltips, tags      |
| `r-md`   | 12px  | Campos: inputs, textareas, selects                  |
| `r-lg`   | 16px  | Cards, diálogos, alertas                            |
| `r-full` | 999px | **Ação**: botões, chips, badges, switches, avatares |

---

## Sombras

| Token       | Valor                           | Uso                          |
| ----------- | ------------------------------- | ---------------------------- |
| `shadow-sm` | `0 1px 2px rgba(26,15,60,.08)`  | Cards e inputs em repouso    |
| `shadow-md` | `0 8px 24px rgba(26,15,60,.10)` | Diálogos, popovers, tooltips |

---

## Ícones

Use **Lucide** (`lucide-react`): grid 24px, stroke 2px, caps e joins redondos, `currentColor`.

- 16px inline
- 18–20px em alertas e botões
- Ícones com significado precisam de 3:1 contra o fundo
- Nenhum emoji como ícone

---

## Motion

| Situação                      | Duração |
| ----------------------------- | ------- |
| Hover e press                 | 150ms   |
| Abertura/fechamento de painel | 250ms   |

Sem animações de entrada decorativas. Respeite `prefers-reduced-motion`.

---

## Acessibilidade e estados

- Targets de toque: mínimo **44px** (altura padrão de Button, Input, paginação).
- Anel de foco: **2px solid** `focus`, **2px offset**, em todos os interativos — 5.5:1 ou mais nos dois temas.
- Hover: escurece `primary` para `primary-hover`; preenche ghost com `surface-2`.
- Disabled: opacidade 50%.
- Status: sempre acompanha palavra ou ícone.

---

## Logo

- Use `mavik-logo-light.webp` (colorido) em fundos claros.
- Use `mavik-logo-dark.webp` (branco) sobre `primary-brand`, Noite e tema dark.
- `mavik-logo-favicon.webp` é o símbolo isolado — favicons e avatares.
- Clear space de 25% da altura do logo. Altura mínima na tela: 24px.
- Não estire, rotacione, recolora, adicione sombra ou outline.
- Lavanda **não** funciona como fundo para o logo.

---

## Componentes

Os componentes seguem a API do **shadcn/ui** (variants, compound parts, `asChild` em triggers), estilizados com estes tokens. Carregue na ordem: `tokens.css` → fontes → `components/bundle.css` → React 18 → `components/bundle.js` (expõe `window.Mavik`).

---

## Voz e tom

- Frases curtas, verbos de ação, sem jargão técnico.
- Trate o leitor como "você".
- Sentence case em toda a UI; sem emoji na interface.
- **Botões nomeiam o resultado**: "Gerar arte", "Salvar ideia", "Agendar post" — nunca "Enviar".
- **Erros dizem o que aconteceu e o que fazer**: sem códigos, sem jargão.
- **Nunca prometa viralização.** Frame como hipótese: "Este formato costuma gerar mais salvamentos."
- A pessoa está sempre no controle — nada é publicado sem aprovação.

| Evite                             | Use                                                          |
| --------------------------------- | ------------------------------------------------------------ |
| Erro 422: asset inválido          | Sua logo tem fundo branco. Envie uma versão transparente.    |
| Inferência concluída com 4 saídas | Pronto! Veja suas 4 opções de arte.                          |
| Configure os parâmetros           | Quer mais ousado ou mais clássico?                           |
| Seu post vai viralizar            | Este formato costuma gerar mais salvamentos. É uma hipótese. |
| Enviar                            | Gerar arte · Salvar ideia · Agendar post                     |

---

## Temas

O produto tem dois temas: **light** e **dark**. O site de marketing roda em **dark**. Todos os tokens semânticos têm valor para os dois temas — nunca hardcode hex.

Logo[Cores](#cores)[Tipografia](#tipografia)[Espaçamento](#espacamento)[Componentes](#componentes)[Logo](#logo)[Tokens](#tokens)[Voz](#voz)

# Design system da plataforma de marketing com IA

Cores, tipografia, espaçamento e componentes para usar em telas, landing page e no app em Next.js. Tudo derivado da logo: dois tons de violeta, Sora nos títulos e Inter nos textos.

## Cores

O violeta principal e a lavanda vêm direto da logo. O restante é neutro, com um leve tom violeta para manter a coerência. Use sempre os tokens semânticos, não os hex.

Violeta

**#5926C8**\
--primary · botões, links, marca

Lavanda

**#B390FA**\
--accent · apoio, bordas ativas

Noite

**#1A0F3C**\
--violet-900 · fundos escuros

Névoa

**#EFE8FD**\
--surface-2 · chips, hover

Neve

**#F8F6FE**\
--surface · cards e telas

Grafite

**#1B1530**\
--text · texto principal

### Escala do violeta

50

100

200

300

400

500

600

700

800

900

### Cores de estado

**Sucesso**#0E8A6B sobre #E3F6F0

**Alerta**#9A5B00 sobre #FFF1D6

**Erro**#C7343A sobre #FDE8E8

### Contraste (WCAG)

| Combinação | Razão | Uso permitido |
| --- | --- | --- |
| Branco sobre Violeta | 8,3 : 1 | Texto de botão e links (AAA) |
| Violeta sobre Névoa | 7,0 : 1 | Chips e links (AA) |
| Lavanda sobre Noite | 7,0 : 1 | Texto no modo escuro (AAA) |
| Branco sobre Lavanda | 2,5 : 1 | Não usar para texto. Use Noite sobre Lavanda. |
| Violeta sobre Noite | 2,2 : 1 | Não usar para texto. No escuro, o primário vira Lavanda. |

Proporção sugerida: 60% neutros claros, 25% violeta, 10% lavanda, 5% noite. No modo escuro, o primário passa a ser a Lavanda (já configurado nos tokens).

## Tipografia

Sora dá personalidade aos títulos; Inter garante leitura confortável em formulários, tabelas e legendas. Mantenha linhas de texto abaixo de 75 caracteres.

Aa

**Sora** · 500, 600, 700\
Títulos, números de destaque e botões de marca.

Aa

**Inter** · 400, 500, 600\
Parágrafos, interface, formulários e tabelas.

### Escala

Display · 48 / 1,1 · 700Sua equipe de marketing

H1 · 32 / 1,2 · 700Título de página

H2 · 24 / 1,25 · 600Título de seção

H3 · 18 / 1,3 · 600Título de card

Corpo · 16 / 1,6 · 400Um texto de parágrafo com boa leitura, sem jargão e com frases curtas.

Pequeno · 14 / 1,5 · 400Texto de apoio, tabelas e ajuda de formulário.

Legenda · 12 / 1,4 · 500Rótulos, chips e metadados

## Espaçamento, raios e elevação

Grade de 4 px, com passos de 8. Raios maiores para elementos de ação (botões e chips), médios para campos e cards.

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (tokens --space-1 a --space-8)

### Raios e sombras

6 · pequeno

12 · campos

16 · cards

999 · botões

sombra sm

sombra md

### Movimento

Curto e a serviço da ação: 150 ms para hover e pressionar, 250 ms para abrir e fechar painéis. Sem animações de entrada decorativas. Respeitar prefers-reduced-motion.

## Componentes

Botões e chips arredondados, campos com foco visível e cards com um objetivo claro. Alvo de toque mínimo de 44 px.

### Botões

Um botão primário por tela. O rótulo diz o que acontece: "Gerar arte", não "Enviar".

### Campos

Nome da empresaAparece nas legendas e no diagnóstico.

InstagramComece com @ para conferirmos o perfil.

### Status do conteúdo

IdeiaEm produçãoEm revisãoAprovadoPublicado

### Card de ideia

Carrossel

#### 3 erros ao escolher um produto

Educativo, para quem está comparando opções.

**Por que funciona:** responde a uma dúvida comum antes da compra.

**Arte aprovada**Agendada para quinta, 10h.

**Pouco contraste**O título está difícil de ler. Aumentar o contraste?

**Logo com fundo branco**Envie uma versão com fundo transparente.

**Dica do agente**Faz 5 dias sem publicar. Preparei 3 conteúdos.

## Uso da logo

A logo é intocável, no site e no produto. Mesma regra que a IA segue nas artes dos clientes.

Logo colorida

Logo branca

Logo branca no escuro

**Faça**

- Colorida em fundo claro; branca em violeta e Noite.
- Área livre de 25% da altura em volta.
- Tamanho mínimo de 24 px na tela.

**Nunca**

- Esticar, girar, trocar as cores ou aplicar sombra e contorno.
- Colocar sobre fundo de baixo contraste (a lavanda não serve).
- Redesenhar ou passar por ferramenta de IA.

## Tokens para copiar

CSS variables prontas, com modo escuro. Em Next.js, cole em `app/globals.css` e carregue as fontes com `next/font`.

```
:root{
  --violet-50:#F8F6FE; --violet-100:#EFE8FD; --violet-200:#DCCEFB; --violet-300:#B390FA;
  --violet-400:#9A6BF4; --violet-500:#7440E0; --violet-600:#5926C8; --violet-700:#3B1A8C;
  --violet-800:#2A1366; --violet-900:#1A0F3C;

  --bg:#FFFFFF; --surface:#F8F6FE; --surface-2:#EFE8FD;
  --text:#1B1530; --muted:#5E5877; --border:#E2DDF0;
  --primary:#5926C8; --primary-hover:#3B1A8C; --on-primary:#FFFFFF;
  --accent:#B390FA; --focus:#7440E0;
  --success:#0E8A6B; --success-bg:#E3F6F0;
  --warning:#9A5B00; --warning-bg:#FFF1D6;
  --danger:#C7343A;  --danger-bg:#FDE8E8;

  --r-sm:6px; --r-md:12px; --r-lg:16px; --r-full:999px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px;
  --shadow-sm:0 1px 2px rgba(26,15,60,.08);
  --shadow-md:0 8px 24px rgba(26,15,60,.10);
  --font-display:'Sora', system-ui, sans-serif;
  --font-body:'Inter', system-ui, sans-serif;
}
@media (prefers-color-scheme:dark){ :root{
  --bg:#12092B; --surface:#1A0F3C; --surface-2:#2A1366;
  --text:#F4F0FF; --muted:#B9B0D6; --border:#3A2A72;
  --primary:#B390FA; --primary-hover:#CBB3FC; --on-primary:#1A0F3C;
  --focus:#CBB3FC;
  --success:#4FD1AE; --success-bg:#103B33;
  --warning:#F5B94D; --warning-bg:#3D2B0B;
  --danger:#FF8A8F;  --danger-bg:#431B22;
}}
```

### Tailwind (tailwind.config.ts)

```
theme: { extend: {
  colors: {
    violet: { 50:'#F8F6FE',100:'#EFE8FD',200:'#DCCEFB',300:'#B390FA',400:'#9A6BF4',
              500:'#7440E0',600:'#5926C8',700:'#3B1A8C',800:'#2A1366',900:'#1A0F3C' },
    primary: 'var(--primary)', surface: 'var(--surface)', muted: 'var(--muted)', line: 'var(--border)'
  },
  borderRadius: { sm:'6px', md:'12px', lg:'16px', full:'999px' },
  fontFamily: { display:['var(--font-sora)'], sans:['var(--font-inter)'] },
  boxShadow: { sm:'var(--shadow-sm)', md:'var(--shadow-md)' }
}}
```

## Voz da interface

Frases curtas, verbos simples e sentido de ação. Erros explicam o que houve e o que fazer; nunca prometem viralização.

| Em vez de | Escreva |
| --- | --- |
| Erro 422: asset inválido | Sua logo tem fundo branco. Envie uma versão transparente. |
| Inferência concluída com 4 saídas | Pronto! Veja suas 4 opções de arte. |
| Configure os parâmetros | Quer mais ousado ou mais clássico? |
| Seu post vai viralizar | Este formato costuma gerar mais salvamentos. É uma hipótese. |
| Enviar | Gerar arte · Salvar ideia · Agendar post |

A mesma ação mantém o mesmo nome em todo o fluxo: o botão "Publicar" gera o aviso "Publicado".
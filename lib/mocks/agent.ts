import type { PostArt } from "./home";

export type AgentConversationGroup =
  | "Hoje"
  | "Esta semana"
  | "Setembro"
  | "Outubro";

export type AgentConversation = {
  id: string;
  title: string;
  snippet: string;
  when: string;
  group: AgentConversationGroup;
  tag: "Campanha" | "Legendas" | "Ideias" | "Resultados" | "Marca";
  isPinned: boolean;
  isArchived: boolean;
};

export const mockAgentConversations: AgentConversation[] = [
  {
    id: "vendas-no-fim-de-semana",
    title: "Vendas no fim de semana",
    snippet:
      "Combinado. Troquei o carrossel de sexta: agora ele mostra o combo pela experiência.",
    when: "20h12",
    group: "Hoje",
    tag: "Campanha",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "legendas-combo-manha",
    title: "Legendas para o combo da manhã",
    snippet: "Três opções de legenda com tom acolhedor e sem preço em destaque.",
    when: "14h30",
    group: "Hoje",
    tag: "Legendas",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "plano-semana-do-cafe",
    title: "Plano para a Semana do Café",
    snippet: "Cinco posts, uma enquete e um sorteio de degustação.",
    when: "Seg",
    group: "Esta semana",
    tag: "Campanha",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "reels-de-bastidores",
    title: "Ideias de Reels de bastidores",
    snippet: "Roteiros curtos mostrando o preparo do pão e do café.",
    when: "Dom",
    group: "Esta semana",
    tag: "Ideias",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "resultados-setembro",
    title: "Resultados de setembro",
    snippet: "Os posts de bastidores geraram mais salvamentos.",
    when: "28 set",
    group: "Setembro",
    tag: "Resultados",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "diferenciar-da-concorrencia",
    title: "Como me diferenciar da concorrência",
    snippet: "Três pontos fortes do Aurora para destacar nos posts.",
    when: "22 set",
    group: "Setembro",
    tag: "Ideias",
    isPinned: false,
    isArchived: false,
  },
  {
    id: "tom-de-voz",
    title: "Tom de voz da marca",
    snippet: "Acolhedor e próximo, com frases curtas.",
    when: "9 set",
    group: "Setembro",
    tag: "Marca",
    isPinned: true,
    isArchived: false,
  },
  {
    id: "dia-do-cafe",
    title: "Ideias para o Dia do Café",
    snippet: "Rascunho de campanha, arquivado depois da data.",
    when: "2 out",
    group: "Outubro",
    tag: "Campanha",
    isPinned: false,
    isArchived: true,
  },
];

export const agentToneOptions = [
  "Acolhedor e próximo",
  "Descontraído",
  "Profissional",
  "Inspirador",
] as const;

export type AgentTone = (typeof agentToneOptions)[number];

export type AgentPreference = {
  id: string;
  label: string;
  meta: string;
  isFromCurrentConversation: boolean;
};

export type AgentContext = {
  business: string;
  audience: string;
  goal: string;
  tone: AgentTone;
  additionalContext: string;
  preferences: AgentPreference[];
};

export const mockAgentContext: AgentContext = {
  business: "Cafeteria de bairro",
  audience: "Moradores e quem trabalha perto",
  goal: "Mais movimento no fim de semana",
  tone: "Acolhedor e próximo",
  additionalContext: "",
  preferences: [
    {
      id: "no-discounts",
      label: "Não destacar descontos",
      meta: "Hoje · nesta conversa",
      isFromCurrentConversation: true,
    },
    {
      id: "real-photos",
      label: "Preferir fotos reais aos mockups",
      meta: "8 de outubro",
      isFromCurrentConversation: false,
    },
    {
      id: "three-posts-week",
      label: "Publicar 3 vezes por semana",
      meta: "2 de outubro",
      isFromCurrentConversation: false,
    },
  ],
};

export type AgentNextStep = {
  id: string;
  label: string;
  isDone: boolean;
  dueLabel?: string;
};

export const mockAgentNextSteps: AgentNextStep[] = [
  { id: "approve-wednesday", label: "Aprovar o post de quarta", isDone: true },
  {
    id: "send-counter-photos",
    label: "Enviar fotos do balcão pela manhã",
    isDone: false,
    dueLabel: "Até qui",
  },
  {
    id: "review-saturday",
    label: "Revisar a campanha de sábado",
    isDone: false,
  },
];

export type ApprovedMaterial = {
  id: string;
  title: string;
  art: PostArt;
};

const approvedMaterialTitles: [string, PostArt][] = [
  ["Novo blend de outono", "autumnBlend"],
  ["Como nasce o seu café", "roastingBackstage"],
  ["Combo café e pão de queijo", "weeklyCombo"],
  ["Bolo de fubá da casa", "autumnBlend"],
  ["Bastidores da torra", "roastingBackstage"],
  ["Café da manhã completo", "weeklyCombo"],
  ["Cappuccino cremoso", "autumnBlend"],
  ["Nosso barista", "roastingBackstage"],
  ["Promoção de terça", "weeklyCombo"],
  ["Pão de queijo quentinho", "autumnBlend"],
  ["Grãos selecionados", "roastingBackstage"],
  ["Lanche da tarde", "weeklyCombo"],
];

export const mockApprovedMaterials: ApprovedMaterial[] =
  approvedMaterialTitles.map(([title, art], index) => ({
    id: `material-${index + 1}`,
    title,
    art,
  }));

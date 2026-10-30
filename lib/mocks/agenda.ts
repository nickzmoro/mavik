import type { OptionTile } from "@/components/common/option-tile-group";

import type { ContentFormat, ContentGoal } from "@/lib/onboarding/constants";

export const agendaStatuses = [
  "idea",
  "production",
  "review",
  "approved",
  "published",
] as const;

export type AgendaStatus = (typeof agendaStatuses)[number];

export const agendaStatusLabels: Record<AgendaStatus, string> = {
  idea: "Ideia",
  production: "Em produção",
  review: "Em revisão",
  approved: "Aprovado",
  published: "Publicado",
};

export const agendaStatusNextActionLabels: Partial<
  Record<AgendaStatus, string>
> = {
  idea: "Enviar para produção",
  production: "Enviar para revisão",
  review: "Aprovar",
  approved: "Marcar como publicado",
};

export type AgendaMonth = "october" | "november";

export type AgendaItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  format: ContentFormat;
  goal: ContentGoal;
  status: AgendaStatus | "suggested";
  campaign: string;
  origin: string;
  caption: string;
};

export const mockAgendaToday = "2026-10-20";

export const agendaFocusWeekdays = [4, 5, 6];

const createAgendaItem = (
  id: string,
  date: string,
  time: string,
  title: string,
  format: ContentFormat,
  goal: ContentGoal,
  status: AgendaItem["status"],
  campaign = "",
  origin = "Plano do mês",
  caption = "",
): AgendaItem => ({
  id,
  date,
  time,
  title,
  format,
  goal,
  status,
  campaign,
  origin,
  caption,
});

export const mockAgendaItems: AgendaItem[] = [
  createAgendaItem(
    "o1",
    "2026-10-01",
    "18h",
    "Feliz Dia do Café",
    "reels",
    "engajar",
    "published",
    "",
    "Datas do setor",
  ),
  createAgendaItem(
    "o3",
    "2026-10-03",
    "9h",
    "Qual o seu pedido de sábado?",
    "story",
    "engajar",
    "published",
  ),
  createAgendaItem(
    "o8",
    "2026-10-08",
    "18h",
    "Novo blend de outono",
    "post",
    "vender",
    "published",
  ),
  createAgendaItem(
    "o9",
    "2026-10-09",
    "10h",
    "Como nasce o seu café",
    "carrossel",
    "atrair",
    "published",
  ),
  createAgendaItem(
    "o10",
    "2026-10-10",
    "9h",
    "Bom dia de sábado no balcão",
    "story",
    "engajar",
    "published",
  ),
  createAgendaItem(
    "o12",
    "2026-10-12",
    "8h",
    "Abertos no feriado",
    "story",
    "vender",
    "published",
    "",
    "Datas do setor",
  ),
  createAgendaItem(
    "o15",
    "2026-10-15",
    "18h",
    "Bastidores do forno",
    "reels",
    "atrair",
    "published",
  ),
  createAgendaItem(
    "o16",
    "2026-10-16",
    "10h",
    "Combo café e pão de queijo",
    "post",
    "vender",
    "published",
  ),
  createAgendaItem(
    "o17",
    "2026-10-17",
    "9h",
    "Pão quentinho às 8h",
    "story",
    "vender",
    "published",
  ),
  createAgendaItem(
    "o21",
    "2026-10-21",
    "10h",
    "Quem faz o seu café",
    "post",
    "fidelizar",
    "approved",
    "",
    "Biblioteca de ideias",
    "Esta é a [NOME], que prepara o seu café toda manhã.\nQual é o seu pedido de sempre?",
  ),
  createAgendaItem(
    "o22",
    "2026-10-22",
    "18h",
    "O pão saindo do forno",
    "reels",
    "engajar",
    "review",
    "Sábado começa no Aurora",
    "Conversa com o agente",
    "Da fornada das 7h direto para o balcão.\nSábado, o primeiro pão é seu.",
  ),
  createAgendaItem(
    "o23",
    "2026-10-23",
    "10h",
    "O combo da manhã de sábado",
    "carrossel",
    "vender",
    "production",
    "Sábado começa no Aurora",
    "Conversa com o agente",
  ),
  createAgendaItem(
    "o24",
    "2026-10-24",
    "8h",
    "Enquete: doce ou salgado hoje?",
    "story",
    "engajar",
    "approved",
    "Sábado começa no Aurora",
    "Biblioteca de ideias",
    "Hoje cedo: doce ou salgado? Você escolhe o destaque do balcão.",
  ),
  createAgendaItem(
    "o27",
    "2026-10-27",
    "12h",
    "3 sinais de que o seu café é fresco",
    "carrossel",
    "atrair",
    "idea",
    "",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "o28",
    "2026-10-28",
    "18h",
    "Cardápio de Halloween em 10 segundos",
    "reels",
    "vender",
    "production",
    "Halloween no Aurora",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "o30",
    "2026-10-30",
    "10h",
    "Qual café combina com cada doce",
    "carrossel",
    "engajar",
    "idea",
    "",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "o31",
    "2026-10-31",
    "9h",
    "Hoje é Halloween no Aurora",
    "story",
    "vender",
    "idea",
    "Halloween no Aurora",
  ),
  createAgendaItem(
    "n5",
    "2026-11-05",
    "18h",
    "Do grão à xícara em 15 segundos",
    "reels",
    "engajar",
    "suggested",
    "Sábado começa no Aurora",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "n6",
    "2026-11-06",
    "10h",
    "Qual café combina com cada doce",
    "carrossel",
    "engajar",
    "suggested",
    "",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "n7",
    "2026-11-07",
    "9h",
    "Enquete: doce ou salgado hoje?",
    "story",
    "vender",
    "suggested",
    "Sábado começa no Aurora",
  ),
  createAgendaItem(
    "n10",
    "2026-11-10",
    "12h",
    "3 sinais de que o seu café é fresco",
    "carrossel",
    "atrair",
    "suggested",
    "",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "n12",
    "2026-11-12",
    "18h",
    "Cold brew da casa: o primeiro gole",
    "reels",
    "vender",
    "suggested",
    "Chegou o calor",
    "Tendência do setor",
  ),
  createAgendaItem(
    "n13",
    "2026-11-13",
    "10h",
    "Seu café de reunião é aqui",
    "post",
    "atrair",
    "suggested",
    "",
    "Biblioteca de ideias",
  ),
  createAgendaItem(
    "n14",
    "2026-11-14",
    "9h",
    "Caixinha: qual bebida gelada você quer?",
    "story",
    "engajar",
    "suggested",
    "Chegou o calor",
  ),
  createAgendaItem(
    "n19",
    "2026-11-19",
    "10h",
    "Quem faz o seu café: [NOME]",
    "post",
    "fidelizar",
    "suggested",
  ),
  createAgendaItem(
    "n20",
    "2026-11-20",
    "8h",
    "Horário no feriado",
    "story",
    "vender",
    "suggested",
    "",
    "Datas do setor",
  ),
  createAgendaItem(
    "n21",
    "2026-11-21",
    "9h",
    "Sábado de manhã no Aurora",
    "reels",
    "atrair",
    "suggested",
  ),
  createAgendaItem(
    "n24",
    "2026-11-24",
    "12h",
    "Café especial: o que muda na xícara",
    "carrossel",
    "atrair",
    "suggested",
    "Semana Aurora",
  ),
  createAgendaItem(
    "n26",
    "2026-11-26",
    "18h",
    "Semana Aurora: o que preparamos",
    "reels",
    "engajar",
    "suggested",
    "Semana Aurora",
  ),
  createAgendaItem(
    "n27",
    "2026-11-27",
    "10h",
    "Sexta do café especial",
    "post",
    "vender",
    "suggested",
    "Semana Aurora",
    "Campanha: Semana Aurora",
  ),
  createAgendaItem(
    "n28",
    "2026-11-28",
    "9h",
    "Sábado da Semana Aurora",
    "story",
    "vender",
    "suggested",
    "Semana Aurora",
  ),
];

export const mockAgendaMarkers: Record<string, string> = {
  "2026-10-01": "Dia do Café",
  "2026-10-12": "Feriado",
  "2026-10-31": "Halloween",
  "2026-11-02": "Finados",
  "2026-11-15": "Proclamação",
  "2026-11-20": "Consciência Negra",
  "2026-11-27": "Black Friday",
};

export type AgendaCampaign = {
  name: string;
  period: string;
  note: string;
};

export const mockAgendaCampaigns: Record<AgendaMonth, AgendaCampaign[]> = {
  october: [
    {
      name: "Sábado começa no Aurora",
      period: "22 a 24 out",
      note: "3 conteúdos",
    },
    {
      name: "Halloween no Aurora",
      period: "28 a 31 out",
      note: "2 conteúdos, sem desconto",
    },
  ],
  november: [
    {
      name: "Sábado começa no Aurora",
      period: "5 a 7 nov",
      note: "2 conteúdos",
    },
    {
      name: "Chegou o calor",
      period: "12 a 14 nov",
      note: "Tendência: bebidas geladas",
    },
    {
      name: "Semana Aurora",
      period: "24 a 28 nov",
      note: "Black Friday sem descontos",
    },
  ],
};

export const agendaMonthSettings: Record<
  AgendaMonth,
  {
    monthIndex: number;
    weekStart: string;
    weeksInMonth: number;
    dateNote: string;
  }
> = {
  october: {
    monthIndex: 9,
    weekStart: "2026-10-18",
    weeksInMonth: 4.4,
    dateNote:
      "Halloween entra como campanha curta, sem desconto: o foco é a experiência no balcão.",
  },
  november: {
    monthIndex: 10,
    weekStart: "2026-11-22",
    weeksInMonth: 4.3,
    dateNote:
      "A Black Friday vira a Semana Aurora, sem descontos, como você prefere. Finados fica livre.",
  },
};

export const agendaQuickEdits = [
  "Reorganizar",
  "Reduzir frequência",
  "Ampliar plano",
];

export const mockAgendaLibraryIdeas: (OptionTile & {
  format: ContentFormat;
  goal: ContentGoal;
})[] = [
  {
    id: "do-grao-a-xicara",
    label: "Do grão à xícara em 15 segundos",
    description: "Reels · Engajar",
    format: "reels",
    goal: "engajar",
  },
  {
    id: "sinais-cafe-fresco",
    label: "3 sinais de que o seu café é fresco",
    description: "Carrossel · Atrair",
    format: "carrossel",
    goal: "atrair",
  },
  {
    id: "enquete-doce-ou-salgado",
    label: "Enquete: doce ou salgado amanhã?",
    description: "Story · Vender",
    format: "story",
    goal: "vender",
  },
  {
    id: "cafe-de-reuniao",
    label: "Seu café de reunião é aqui",
    description: "Post · Atrair",
    format: "post",
    goal: "atrair",
  },
];

export const mockNewContentSlots: (OptionTile & { time: string })[] = [
  {
    id: "2026-10-29",
    label: "Qui, 29 out · 18h",
    description: "Sugerido",
    time: "18h",
  },
  {
    id: "2026-10-30",
    label: "Sex, 30 out · 10h",
    description: "Dia de foco",
    time: "10h",
  },
  {
    id: "2026-10-31",
    label: "Sáb, 31 out · 9h",
    description: "Halloween",
    time: "9h",
  },
  {
    id: "2026-10-27",
    label: "Ter, 27 out · 12h",
    description: "Meio de semana",
    time: "12h",
  },
];

export const newContentCampaignOptions = [
  "Nenhuma",
  "Sábado começa no Aurora",
  "Halloween no Aurora",
] as const;

export const campaignCommercialDates = [
  "Nenhuma",
  "Black Friday",
  "Natal",
  "Início do verão",
] as const;

export const planMonthOptions = ["Novembro", "Dezembro"] as const;

export const planFrequencyOptions: OptionTile[] = [
  { id: "low", label: "2 por semana", description: "Leve" },
  {
    id: "recommended",
    label: "3 a 4 por semana",
    description: "Recomendado para você",
  },
  { id: "high", label: "5 por semana", description: "Intenso" },
];

export const agendaWeekdayLabels = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
] as const;

export const planDateOptions: OptionTile[] = [
  {
    id: "finados",
    label: "Finados · 2 nov",
    description: "Sugestão: deixar livre",
  },
  {
    id: "consciencia-negra",
    label: "Consciência Negra · 20 nov",
    description: "Feriado: avisar horário",
  },
  {
    id: "black-friday",
    label: "Black Friday · 27 nov",
    description: "Como Semana Aurora, sem descontos",
  },
];

export const planLibraryUsageOptions = [
  "Sim, priorizar salvas",
  "Não",
] as const;

export const planStrategyBase = [
  "Mais movimento no fim de semana",
  "Tom acolhedor",
  "Fotos reais",
  "Sem descontos",
];

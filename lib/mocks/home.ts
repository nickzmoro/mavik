export type UpcomingPostStatus = "approved" | "awaitingApproval" | "draft";

export type PostArt = "autumnBlend" | "roastingBackstage" | "weeklyCombo";

export type UpcomingPost = {
  id: string;
  art: PostArt;
  previewLabel: string;
  scheduleLabel: string;
  status: UpcomingPostStatus;
};

export const mockUpcomingPosts: UpcomingPost[] = [
  {
    id: "post-1",
    art: "autumnBlend",
    previewLabel: "Prévia do post: Novo blend de outono",
    scheduleLabel: "Qua, 10h · Instagram",
    status: "approved",
  },
  {
    id: "post-2",
    art: "roastingBackstage",
    previewLabel: "Prévia do post: Bastidores da torra",
    scheduleLabel: "Sex, 18h · Reels",
    status: "awaitingApproval",
  },
  {
    id: "post-3",
    art: "weeklyCombo",
    previewLabel: "Prévia do post: Combo da semana",
    scheduleLabel: "Dom, 9h · Instagram",
    status: "draft",
  },
];

export const mockAgentSuggestion = {
  title: "A loja está há 5 dias sem publicar.",
  description:
    "Preparei 3 ideias para esta semana. Você revisa e aprova antes de publicar.",
};

export const mockWeeklyStats = {
  periodLabel: "Últimos 7 dias",
  metrics: [
    { label: "Alcance", value: "12,4 mil", isHighlighted: false },
    { label: "Posts", value: "2 de 4", isHighlighted: false },
    { label: "Salvamentos", value: "+38%", isHighlighted: true },
  ],
  insight:
    "Carrosséis com receita costumam gerar mais salvamentos na sua loja. É uma hipótese.",
};

export const mockBrandSummary = {
  initials: "CA",
  colors: [
    { name: "café", hex: "#2e2a27" },
    { name: "caramelo", hex: "#c9a27e" },
    { name: "creme", hex: "#f4ede4" },
    { name: "sálvia", hex: "#8fa688" },
  ],
  tone: "acolhedor e próximo",
  completedSteps: 5,
  totalSteps: 6,
  missingStepHint:
    "Falta a fonte de destaque. Com ela, suas artes ficam ainda mais com a sua cara.",
};

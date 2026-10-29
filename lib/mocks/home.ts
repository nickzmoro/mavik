export type PostArt = "autumnBlend" | "roastingBackstage" | "weeklyCombo";

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

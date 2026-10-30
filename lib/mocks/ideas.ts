import type { OptionTile } from "@/components/common/option-tile-group";

export const ideaVersionApproaches = {
  "Mais leve": [
    "com humor do dia a dia",
    "em forma de pergunta",
    "com bastidores divertidos",
  ],
  "Mais direto": ["em 3 passos", "com convite para visitar", "antes e depois"],
  "Mais emocional": [
    "contada por um cliente",
    "pela memória afetiva",
    "por quem prepara",
  ],
} as const;

export type IdeaVersionTone = keyof typeof ideaVersionApproaches;

export const ideaVersionTones = Object.keys(
  ideaVersionApproaches,
) as IdeaVersionTone[];

export const mockScheduleDays: OptionTile[] = [
  { id: "Qui, 22 out", label: "Qui, 22 out", description: "Depois de amanhã" },
  { id: "Sex, 23 out", label: "Sex, 23 out", description: "Sugerido" },
  { id: "Sáb, 24 out", label: "Sáb, 24 out", description: "Mais movimento" },
  { id: "Dom, 25 out", label: "Dom, 25 out", description: "Agenda livre" },
];

export const mockScheduleTimes: OptionTile[] = [
  { id: "8h", label: "8h", description: "Antes do café" },
  { id: "12h", label: "12h", description: "Almoço" },
  { id: "18h", label: "18h", description: "Mais alcance" },
];

export const schedulePreparationOptions: OptionTile[] = [
  {
    id: "agent",
    label: "O agente cria tudo",
    description: "Arte e legenda para você aprovar",
  },
  {
    id: "photos",
    label: "Eu envio as fotos",
    description: "O agente escreve a legenda",
  },
];

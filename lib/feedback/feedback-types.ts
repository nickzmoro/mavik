import { Bug, CircleHelp, Lightbulb, type LucideIcon } from "lucide-react";

export const feedbackTypeValues = ["suggestion", "question", "bug"] as const;

export type FeedbackType = (typeof feedbackTypeValues)[number];

type FeedbackTypeConfig = {
  label: string;
  emailLabel: string;
  icon: LucideIcon;
  description: string;
  placeholder: string;
};

export const feedbackTypes: Record<FeedbackType, FeedbackTypeConfig> = {
  suggestion: {
    label: "Sugestão",
    emailLabel: "Sugestão",
    icon: Lightbulb,
    description: "Conte o que a Mavik poderia fazer por você.",
    placeholder: "Ex.: Queria poder agendar o mesmo post em duas redes.",
  },
  question: {
    label: "Dúvida",
    emailLabel: "Dúvida",
    icon: CircleHelp,
    description: "Pergunte o que quiser. Respondemos no seu e-mail.",
    placeholder: "Ex.: Como troco a logo que aparece nos meus posts?",
  },
  bug: {
    label: "Reportar bug",
    emailLabel: "Bug",
    icon: Bug,
    description: "Conte o que aconteceu e o que você esperava ver.",
    placeholder: "Ex.: Cliquei em “Gerar arte” e a tela travou.",
  },
};

export type StudioQuestion = {
  text: string;
  why: string;
  options: string[];
};

export const studioQuestions: StudioQuestion[] = [
  {
    text: "Sobre o que é o post?",
    why: "Assim eu escolho o layout certo da sua marca.",
    options: [
      "Produto",
      "Bastidores",
      "Data especial",
      "Aviso da loja",
      "Promoção",
    ],
  },
  {
    text: "Qual produto ou assunto aparece na arte?",
    why: "Se tiver uma foto real, anexe. Você prefere fotos reais aos mockups.",
    options: [
      "Novo blend de outono",
      "Combo café e pão de queijo",
      "Pão de queijo",
    ],
  },
  {
    text: "O que a pessoa deve fazer depois de ver?",
    why: "Isso define a chamada da arte e da legenda.",
    options: [
      "Visitar a loja",
      "Pedir pelo WhatsApp",
      "Salvar o post",
      "Comentar",
    ],
  },
  {
    text: "Que texto deve aparecer na arte?",
    why: "Pode deixar comigo: sigo o tom acolhedor e próximo da marca.",
    options: ["Escreva para mim", "Só o nome do produto"],
  },
];

export const skippedAnswer = "Deixo com a IA";

const writeForMeAnswer = "Escreva para mim";

export const buildGuidedPrompt = (answers: string[]) => {
  const [topic = "Produto", subject = "o produto", action = "Visitar a loja"] =
    answers;
  const artText =
    !answers[3] || answers[3] === writeForMeAnswer
      ? "escreva você, no tom acolhedor e próximo da marca"
      : answers[3];

  return `Post sobre ${topic.toLowerCase()}: ${subject}. Objetivo: ${action.toLowerCase()}. Texto da arte: ${artText}. Use foto real quando houver.`;
};

export const studioPromptStarters = [
  "Lançamento de produto",
  "Bastidores da cozinha",
  "Aviso de horário",
];

export const studioPromptMaxLength = 1500;

export type ArtFormatId = "square" | "portrait" | "story";

export type ArtFormat = {
  id: ArtFormatId;
  label: string;
  description: string;
  name: string;
  ratioLabel: string;
  aspectRatio: string;
  iconClassName: string;
  chipIconClassName: string;
};

export const artFormats: ArtFormat[] = [
  {
    id: "square",
    label: "Post quadrado",
    description: "1:1 · Feed",
    name: "Post 1:1",
    ratioLabel: "1:1",
    aspectRatio: "1 / 1",
    iconClassName: "h-4 w-4",
    chipIconClassName: "h-3 w-3",
  },
  {
    id: "portrait",
    label: "Post vertical",
    description: "4:5 · Feed, ocupa mais a tela",
    name: "Post 4:5",
    ratioLabel: "4:5",
    aspectRatio: "4 / 5",
    iconClassName: "h-4.5 w-3.5",
    chipIconClassName: "h-3.5 w-2.75",
  },
  {
    id: "story",
    label: "Story",
    description: "9:16 · Stories e Reels",
    name: "Story 9:16",
    ratioLabel: "9:16",
    aspectRatio: "9 / 16",
    iconClassName: "h-4.75 w-2.75",
    chipIconClassName: "h-3.5 w-2",
  },
];

export const maxVariationsPerGeneration = 3;

export const variationCountOptions = [1, 2, 3] as const;

export type StudioArtVariant = "dark" | "light" | "sage";

export type StudioArtStyle = {
  variant: StudioArtVariant;
  background: string;
  titleColor: string;
  logoBackground: string;
  logoColor: string;
};

export const studioArtStyles: StudioArtStyle[] = [
  {
    variant: "dark",
    background: "#2B2420",
    titleColor: "#F3ECE2",
    logoBackground: "#F3ECE2",
    logoColor: "#2B2420",
  },
  {
    variant: "light",
    background: "#F3ECE2",
    titleColor: "#2B2420",
    logoBackground: "#2B2420",
    logoColor: "#F3ECE2",
  },
  {
    variant: "sage",
    background: "#8FA98A",
    titleColor: "#1F1A17",
    logoBackground: "#2B2420",
    logoColor: "#F3ECE2",
  },
];

export const mockGeneratedArt = {
  title: "Novo blend de outono",
  subtitle: "Notas de caramelo e castanha. Passa aqui no sábado?",
};

export const brandRuleHighlights = [
  "Logo no canto inferior direito",
  "Só cores da paleta",
  "Sem termos proibidos",
];

export const generationSteps = [
  "Lendo o seu pedido",
  "Aplicando logo, cores e fontes do Brand Kit v3",
];

export const aiEditIdeas = [
  "Título maior",
  "Fundo mais claro",
  "Frase mais curta",
  "Usar a foto do balcão",
];

export const studioScheduleTimes = [
  { id: "8h", label: "8h", description: "Antes do café" },
  { id: "12h", label: "12h", description: "Almoço" },
  { id: "18h", label: "18h", description: "Mais alcance" },
];

export const studioPlans = [
  {
    id: "essential",
    name: "Essencial",
    price: "R$ 49",
    features: [
      "30 artes por mês",
      "Até 3 variações por geração",
      "Agenda e Resultados",
    ],
    badge: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 99",
    features: ["Artes ilimitadas", "Mais de uma loja", "Designer na equipe"],
    badge: "Mais completo",
  },
];

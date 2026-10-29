import { routes } from "@/lib/routes";

export const onboardingSteps = [
  {
    number: 1,
    label: "Sobre a empresa",
    href: `${routes.onboarding}?etapa=1`,
    duration: "cerca de 1 minuto",
  },
  {
    number: 2,
    label: "Brand Kit",
    href: `${routes.onboarding}?etapa=2`,
    duration: "cerca de 4 minutos",
  },
  {
    number: 3,
    label: "Voz e público",
    href: `${routes.onboarding}?etapa=3`,
    duration: "cerca de 3 minutos",
  },
  {
    number: 4,
    label: "Diagnóstico e plano",
    href: `${routes.onboarding}?etapa=4`,
    duration: "cerca de 2 minutos",
  },
] as const;

export type OnboardingStepNumber = (typeof onboardingSteps)[number]["number"];

export const segments = [
  "Estética e beleza",
  "Salão de beleza",
  "Barbearia",
  "Moda e acessórios",
  "Alimentação e restaurante",
  "Confeitaria e doces",
  "Cafeteria",
  "Academia e bem-estar",
  "Saúde e clínica",
  "Odontologia",
  "Psicologia e terapia",
  "Nutrição",
  "Advocacia e jurídico",
  "Contabilidade e finanças",
  "Imobiliária",
  "Educação e cursos",
  "Pet shop e veterinária",
  "Casa e decoração",
  "Tecnologia e serviços digitais",
  "Turismo e hotelaria",
  "Varejo e loja",
  "Outro",
];

const regulatedSegments = new Set([
  "Estética e beleza",
  "Saúde e clínica",
  "Odontologia",
  "Psicologia e terapia",
  "Nutrição",
  "Advocacia e jurídico",
  "Contabilidade e finanças",
]);

export function isRegulatedSegment(segment: string) {
  return regulatedSegments.has(segment);
}

export const businessGoals = [
  { value: "vender_mais", label: "Vender mais" },
  { value: "ganhar_seguidores", label: "Ganhar seguidores" },
  { value: "divulgar_lancamento", label: "Divulgar lançamento" },
  { value: "gerar_contatos", label: "Gerar contatos" },
] as const;

export type BusinessGoal = (typeof businessGoals)[number]["value"];

export const marketingLevels = [
  { value: "simples", label: "Estou começando", mode: "Modo Simples" },
  { value: "intermediario", label: "Já faço o básico", mode: "Intermediário" },
  { value: "avancado", label: "Sou da área", mode: "Modo Avançado" },
] as const;

export type MarketingLevel = (typeof marketingLevels)[number]["value"];

export const colorRoles = [
  { value: "primaria", label: "Primária" },
  { value: "secundaria", label: "Secundária" },
  { value: "destaque", label: "Destaque" },
  { value: "fundo", label: "Fundo" },
  { value: "texto", label: "Texto" },
] as const;

export type ColorRole = (typeof colorRoles)[number]["value"];

export const defaultBrandColors: Record<ColorRole, string> = {
  primaria: "#5926C8",
  secundaria: "#B390FA",
  destaque: "#F5A524",
  fundo: "#F8F6FE",
  texto: "#1B1530",
};

export const imageStyles = [
  { value: "fotografico", label: "Fotográfico" },
  { value: "ilustrado", label: "Ilustrado" },
  { value: "minimalista", label: "Minimalista" },
  { value: "3d", label: "3D" },
  { value: "outro", label: "Outros" },
] as const;

export type ImageStyle = (typeof imageStyles)[number]["value"];

export const contentKinds = [
  { value: "educativo", label: "Educativo" },
  { value: "comercial", label: "Comercial" },
  { value: "autoridade", label: "Autoridade" },
] as const;

export type ContentKind = (typeof contentKinds)[number]["value"];

export const contentFormats = ["post", "story", "reels", "carrossel"] as const;

export type ContentFormat = (typeof contentFormats)[number];

export const contentGoals = ["atrair", "engajar", "vender", "fidelizar"] as const;

export type ContentGoal = (typeof contentGoals)[number];

export const MAX_PRODUCTS = 5;
export const MAX_PERSONAS = 3;
export const MAX_COMPETITORS = 3;
export const LOGO_MIN_SIDE_PX = 1000;
export const LOGO_MAX_BYTES = 5 * 1024 * 1024;
export const MANUAL_MAX_BYTES = 5 * 1024 * 1024;
export const LOGO_MIME_TYPES = ["image/svg+xml", "image/png", "image/webp"];

export const DEFAULT_TITLE_FONT = "Poppins";
export const DEFAULT_BODY_FONT = "Inter";
export const MAX_FONT_NAME_LENGTH = 60;
export const MAX_RESTRICTIONS = 15;

export const fontSources = ["google", "nome"] as const;

export type FontSource = (typeof fontSources)[number];

export const MAX_POST_EXAMPLES = 5;
export const POST_EXAMPLE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

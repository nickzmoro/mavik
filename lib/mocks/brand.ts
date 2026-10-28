export const brandTabs = [
  { value: "logos", label: "Logos" },
  { value: "colors", label: "Cores" },
  { value: "fonts", label: "Fontes" },
  { value: "style", label: "Estilo" },
  { value: "layouts", label: "Layouts" },
  { value: "voice", label: "Voz" },
  { value: "rules", label: "Regras" },
] as const;

export type BrandTab = (typeof brandTabs)[number]["value"];

export const mockBrandInitials = "CA";

export const mockBrandTone = "acolhedor e próximo";

export type LogoSlotId = "light" | "dark" | "symbol" | "monochrome";

export type LogoSlot = {
  id: LogoSlotId;
  title: string;
  requirement: "Obrigatório" | "Recomendado" | "Opcional";
  status: string;
  previewBackground: string;
  markBackground: string;
  markColor: string;
  markSize: "lg" | "md";
  isGenerated: boolean;
};

export const mockLogoSlots: LogoSlot[] = [
  {
    id: "light",
    title: "Logo para fundo claro",
    requirement: "Obrigatório",
    status: "Validada · SVG",
    previewBackground: "#FFFFFF",
    markBackground: "#2B2420",
    markColor: "#F3ECE2",
    markSize: "lg",
    isGenerated: false,
  },
  {
    id: "dark",
    title: "Logo para fundo escuro",
    requirement: "Obrigatório",
    status: "Validada · SVG",
    previewBackground: "#2B2420",
    markBackground: "#F3ECE2",
    markColor: "#2B2420",
    markSize: "lg",
    isGenerated: false,
  },
  {
    id: "symbol",
    title: "Símbolo ou ícone",
    requirement: "Recomendado",
    status: "Legível a 24 px",
    previewBackground: "#F3ECE2",
    markBackground: "#2B2420",
    markColor: "#F3ECE2",
    markSize: "md",
    isGenerated: false,
  },
  {
    id: "monochrome",
    title: "Versões monocromáticas",
    requirement: "Opcional",
    status: "Geradas automaticamente",
    previewBackground: "linear-gradient(90deg,#1B1530 50%,#FFFFFF 50%)",
    markBackground: "transparent",
    markColor: "#FFFFFF",
    markSize: "md",
    isGenerated: true,
  },
];

export const logoValidationChecks = [
  { label: "Resolução", detail: "Acima de 1000 px" },
  { label: "Fundo", detail: "Transparente" },
  { label: "Margens e proporção", detail: "Sem sobras" },
  { label: "Contraste", detail: "Claro e escuro" },
  { label: "Aprovação", detail: "Aprovada pela dona" },
];

export type BrandColorRole =
  "primary" | "secondary" | "accent" | "background" | "text" | "extra";

export type BrandColor = {
  id: string;
  role: BrandColorRole;
  roleLabel: string;
  name: string;
  hex: string;
};

export const mockBrandPalette: BrandColor[] = [
  {
    id: "primary",
    role: "primary",
    roleLabel: "Primária",
    name: "Café",
    hex: "#2B2420",
  },
  {
    id: "secondary",
    role: "secondary",
    roleLabel: "Secundária",
    name: "Caramelo",
    hex: "#C9A27A",
  },
  {
    id: "accent",
    role: "accent",
    roleLabel: "Destaque",
    name: "Sálvia",
    hex: "#8FA98A",
  },
  {
    id: "background",
    role: "background",
    roleLabel: "Fundo",
    name: "Creme",
    hex: "#F3ECE2",
  },
  {
    id: "text",
    role: "text",
    roleLabel: "Texto",
    name: "Grafite café",
    hex: "#1F1A17",
  },
];

export const contrastPairs: {
  foreground: BrandColorRole;
  background: BrandColorRole;
}[] = [
  { foreground: "text", background: "background" },
  { foreground: "background", background: "primary" },
  { foreground: "text", background: "secondary" },
  { foreground: "text", background: "accent" },
  { foreground: "background", background: "accent" },
  { foreground: "background", background: "secondary" },
];

export const fontRoles = ["Títulos", "Parágrafos", "Destaque"] as const;

export type FontRole = (typeof fontRoles)[number];

export type BrandFont = {
  role: FontRole;
  family: string;
  displayName: string;
  sample: string;
  isRequired: boolean;
};

export const mockBrandFonts: BrandFont[] = [
  {
    role: "Títulos",
    family: "var(--font-dm-serif), Georgia, serif",
    displayName: "DM Serif Display",
    sample: "Novo blend de outono",
    isRequired: true,
  },
  {
    role: "Parágrafos",
    family: "var(--font-inter), system-ui, sans-serif",
    displayName: "Inter · 400, 500, 600",
    sample: "Café coado na hora e pão de queijo quentinho.",
    isRequired: true,
  },
];

export const legibilitySample =
  "Ação de outono: café, pão de queijo e um abraço quentinho.";

export const imageStyles = [
  { value: "photographic", label: "Fotográfico" },
  { value: "illustrated", label: "Ilustrado" },
  { value: "minimalist", label: "Minimalista" },
  { value: "3d", label: "3D" },
] as const;

export type ImageStyle = (typeof imageStyles)[number]["value"];

export type StyleReference = {
  id: string;
  caption: string;
  style: ImageStyle;
  imageUrl?: string;
};

export const mockStyleReferences: StyleReference[] = [
  { id: "vitrine", caption: "Vitrine com luz natural", style: "photographic" },
  { id: "xicara", caption: "Xícara em close", style: "photographic" },
  { id: "card-dica", caption: "Card de dica", style: "illustrated" },
  { id: "selo-preco", caption: "Selo de preço", style: "minimalist" },
];

export type LayoutElementId = "logo" | "title" | "stripe" | "photo";

export const layoutElements: { id: LayoutElementId; label: string }[] = [
  { id: "logo", label: "Logo: inferior direito" },
  { id: "title", label: "Título: topo" },
  { id: "stripe", label: "Faixa lateral" },
  { id: "photo", label: "Foto: metade de baixo" },
];

export const mockInitialLayoutModes: Record<LayoutElementId, boolean> = {
  logo: true,
  title: false,
  stripe: true,
  photo: false,
};

export type SavedLayout = {
  id: string;
  name: string;
  summary: string;
  thumbnail: "product" | "story" | "carousel";
};

export const mockSavedLayouts: SavedLayout[] = [
  {
    id: "post-produto",
    name: "Post de produto",
    summary: "Logo e faixa fixos",
    thumbnail: "product",
  },
  {
    id: "story-promocao",
    name: "Story de promoção",
    summary: "Logo fixo",
    thumbnail: "story",
  },
  {
    id: "capa-carrossel",
    name: "Capa de carrossel",
    summary: "Título e logo fixos",
    thumbnail: "carousel",
  },
];

export const layoutFlowSteps = [
  "Envia um post",
  "Revisa o que a IA entendeu",
  "Marca fixo ou flexível",
  "Salva como layout",
];

export const mockVoiceSliders = [
  {
    id: "formality",
    start: "Formal",
    end: "Descontraído",
    value: 72,
    label: "De formal a descontraído",
  },
  {
    id: "humor",
    start: "Sério",
    end: "Divertido",
    value: 55,
    label: "De sério a divertido",
  },
  {
    id: "complexity",
    start: "Técnico",
    end: "Simples",
    value: 85,
    label: "De técnico a simples",
  },
  {
    id: "intent",
    start: "Educativo",
    end: "Vendedor",
    value: 40,
    label: "De educativo a vendedor",
  },
];

export const mockLovedWords = [
  "aconchego",
  "feito na hora",
  "quentinho",
  "da casa",
];

export const mockBannedWords = ["barato", "gourmetizado"];

export type Persona = {
  id: string;
  name: string;
  age: number;
  description: string;
};

export const mockPersonas: Persona[] = [
  {
    id: "julia",
    name: "Júlia",
    age: 28,
    description:
      "Trabalha perto, passa no café antes do expediente e posta o que gosta.",
  },
  {
    id: "roberto",
    name: "Roberto",
    age: 52,
    description:
      "Morador do bairro, vem aos sábados com a família e valoriza atendimento.",
  },
];

export const maxPersonas = 3;

export type BrandRule = {
  id: string;
  label: string;
  source: string;
};

export const mockBrandRules: BrandRule[] = [
  {
    id: "logo-position",
    label: "Logo sempre no canto inferior direito",
    source: "Layouts",
  },
  { id: "palette-only", label: "Usar só as cores da paleta", source: "Cores" },
  { id: "title-font", label: "Títulos em DM Serif Display", source: "Fontes" },
  {
    id: "natural-light",
    label: "Fotos com luz natural, sem filtros fortes",
    source: "Estilo",
  },
  {
    id: "banned-words",
    label: "Nunca usar “barato” ou “gourmetizado”",
    source: "Voz",
  },
];

export const restrictionTypes = ["Cores", "Elementos", "Estilos"] as const;

export type RestrictionType = (typeof restrictionTypes)[number];

export const mockAvoidedColors = [
  { name: "Vermelho vivo", hex: "#E53935" },
  { name: "Verde neon", hex: "#39FF14" },
];

export const mockAvoidedElements = ["Clip-art", "Emojis na arte"];

export const mockAvoidedStyles = ["3D cartoon", "Fundo com textura forte"];

export const mockBrandVersions = [
  { id: "v3", label: "v3", date: "hoje" },
  { id: "v2", label: "v2", date: "12/09" },
  { id: "v1", label: "v1", date: "03/08" },
];

export const brandPermissions = [
  { label: "Alterar logo e cores", role: "Dono", variant: "secondary" },
  { label: "Sugerir mudanças", role: "Designer", variant: "outline" },
] as const;

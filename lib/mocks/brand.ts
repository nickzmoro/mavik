export const brandTabs = [
  { value: "logos", label: "Logos" },
  { value: "colors", label: "Cores" },
  { value: "fonts", label: "Fontes" },
  { value: "style", label: "Estilo" },
  { value: "layouts", label: "Layouts" },
  { value: "voice", label: "Voz" },
  { value: "rules", label: "Regras" },
  { value: "connections", label: "Conexões" },
] as const;

export type BrandTab = (typeof brandTabs)[number]["value"];

export const mockBrandInitials = "CA";

export type LogoSlotId = "light" | "dark" | "symbol" | "monochrome";

export type LogoSlot = {
  id: LogoSlotId;
  title: string;
  requirement: "Obrigatório" | "Recomendado" | "Opcional";
  previewBackground: string;
  isGenerated: boolean;
};

export const mockLogoSlots: LogoSlot[] = [
  {
    id: "light",
    title: "Logo para fundo claro",
    requirement: "Obrigatório",
    previewBackground: "#FFFFFF",
    isGenerated: false,
  },
  {
    id: "dark",
    title: "Logo para fundo escuro",
    requirement: "Obrigatório",
    previewBackground: "#2B2420",
    isGenerated: false,
  },
  {
    id: "symbol",
    title: "Símbolo ou ícone",
    requirement: "Recomendado",
    previewBackground: "#F3ECE2",
    isGenerated: false,
  },
  {
    id: "monochrome",
    title: "Versões monocromáticas",
    requirement: "Opcional",
    previewBackground: "linear-gradient(90deg,#1B1530 50%,#FFFFFF 50%)",
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

export const basePalette: BrandColor[] = [
  {
    id: "primary",
    role: "primary",
    roleLabel: "Primária",
    name: "Azul-marinho",
    hex: "#1B2A4A",
  },
  {
    id: "secondary",
    role: "secondary",
    roleLabel: "Secundária",
    name: "Cinza",
    hex: "#808080",
  },
  {
    id: "accent",
    role: "accent",
    roleLabel: "Destaque",
    name: "Azul",
    hex: "#1E6FD9",
  },
  {
    id: "background",
    role: "background",
    roleLabel: "Fundo",
    name: "Branco",
    hex: "#FFFFFF",
  },
  {
    id: "text",
    role: "text",
    roleLabel: "Texto",
    name: "Grafite",
    hex: "#2F2F2F",
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
  isDefault: boolean;
  assetId?: string;
  url?: string;
};

export const fontSamples: Record<FontRole, string> = {
  Títulos: "Novidade da semana",
  Parágrafos: "Um texto curto para ver como a fonte fica nas legendas.",
  Destaque: "Só hoje: 20% off",
};

export const defaultBrandFonts: BrandFont[] = [
  {
    role: "Títulos",
    family: "var(--font-poppins), system-ui, sans-serif",
    displayName: "Poppins",
    sample: fontSamples.Títulos,
    isRequired: true,
    isDefault: true,
  },
  {
    role: "Parágrafos",
    family: "var(--font-inter), system-ui, sans-serif",
    displayName: "Inter",
    sample: fontSamples.Parágrafos,
    isRequired: true,
    isDefault: true,
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
  imageUrl: string;
};

export type LayoutElementId = "logo" | "title" | "photo";

export const layoutElements: { id: LayoutElementId; label: string }[] = [
  { id: "logo", label: "Logo: inferior direito" },
  { id: "title", label: "Título: topo" },
  { id: "photo", label: "Foto: metade de baixo" },
];

export type LayoutModes = Record<LayoutElementId, boolean>;

export const emptyLayoutModes: LayoutModes = {
  logo: false,
  title: false,
  photo: false,
};

export const layoutFormats = [
  { id: "post", label: "Post" },
  { id: "story", label: "Story" },
] as const;

export type LayoutFormat = (typeof layoutFormats)[number]["id"];

export type SavedLayout = {
  id: string;
  name: string;
  format: LayoutFormat;
  layoutModes: LayoutModes;
  postImageUrl?: string;
  sourceAssetId?: string;
};

export const layoutFlowSteps = [
  "Envia um post",
  "Revisa o que a IA entendeu",
  "Marca fixo ou flexível",
  "Salva como layout",
];

export const voiceSliders = [
  {
    id: "formality",
    start: "Formal",
    end: "Descontraído",
    value: 50,
    label: "De formal a descontraído",
  },
  {
    id: "humor",
    start: "Sério",
    end: "Divertido",
    value: 50,
    label: "De sério a divertido",
  },
  {
    id: "complexity",
    start: "Técnico",
    end: "Simples",
    value: 50,
    label: "De técnico a simples",
  },
  {
    id: "intent",
    start: "Educativo",
    end: "Vendedor",
    value: 50,
    label: "De educativo a vendedor",
  },
];

export type Persona = {
  id: string;
  name: string;
  age: number;
  description: string;
};

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
  { id: "title-font", label: "Títulos na fonte da marca", source: "Fontes" },
  {
    id: "natural-light",
    label: "Fotos com luz natural, sem filtros fortes",
    source: "Estilo",
  },
  {
    id: "banned-words",
    label: "Nunca usar os termos proibidos",
    source: "Voz",
  },
];

export const restrictionTypes = ["Cores", "Elementos", "Estilos"] as const;

export type RestrictionType = (typeof restrictionTypes)[number];

export const mockBrandVersions = [
  { id: "v3", label: "v3", date: "hoje" },
  { id: "v2", label: "v2", date: "12/09" },
  { id: "v1", label: "v1", date: "03/08" },
];

export const brandPermissions = [
  { label: "Alterar logo e cores", role: "Dono", variant: "secondary" },
  { label: "Sugerir mudanças", role: "Designer", variant: "outline" },
] as const;

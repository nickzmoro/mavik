import {
  basePalette,
  defaultBrandFonts,
  mockBrandRules,
  voiceSliders,
  type BrandColor,
  type BrandColorRole,
  type BrandTab,
  type BrandFont,
  type FontRole,
  type ImageStyle,
  type Persona,
  type SavedLayout,
  type StyleReference,
} from "@/lib/mocks/brand";

export type UploadableLogoSlotId = "light" | "dark" | "symbol";

export type BrandFile = {
  assetId: string;
  url: string;
  fileName: string;
  isSvg: boolean;
};

export type AvoidedColor = { name: string; hex: string };

export type ArtRule = { id: string; rule: string; isActive: boolean };

export type BrandKitData = {
  logos: Partial<Record<UploadableLogoSlotId, BrandFile>>;
  palette: BrandColor[];
  fonts: BrandFont[];
  imageStyle: ImageStyle | null;
  references: StyleReference[];
  storyReferences: StyleReference[];
  layouts: SavedLayout[];
  voiceValues: Record<string, number>;
  lovedWords: string[];
  bannedWords: string[];
  personas: Persona[];
  activeRuleIds: string[];
  avoidedColors: AvoidedColor[];
  avoidedElements: string[];
  avoidedStyles: string[];
  artRules: ArtRule[];
};

export const defaultVoiceValues = Object.fromEntries(
  voiceSliders.map((slider) => [slider.id, slider.value]),
);

export const emptyBrandKitData: BrandKitData = {
  logos: {},
  palette: basePalette,
  fonts: defaultBrandFonts,
  imageStyle: null,
  references: [],
  storyReferences: [],
  layouts: [],
  voiceValues: defaultVoiceValues,
  lovedWords: [],
  bannedWords: [],
  personas: [],
  activeRuleIds: mockBrandRules.map((rule) => rule.id),
  avoidedColors: [],
  avoidedElements: [],
  avoidedStyles: [],
  artRules: [],
};

export const logoAssetKinds = {
  light: "logo_claro",
  dark: "logo_escuro",
  symbol: "simbolo",
} as const satisfies Record<UploadableLogoSlotId, string>;

export const colorRoleColumns = {
  primary: "primaria",
  secondary: "secundaria",
  accent: "destaque",
  background: "fundo",
  text: "texto",
  extra: "extra",
} as const satisfies Record<BrandColorRole, string>;

export const fontRoleColumns = {
  Títulos: "titulo",
  Parágrafos: "paragrafo",
  Destaque: "destaque",
} as const satisfies Record<FontRole, string>;

export const imageStyleColumns = {
  photographic: "fotografico",
  illustrated: "ilustrado",
  minimalist: "minimalista",
  "3d": "3d",
} as const satisfies Record<ImageStyle, string>;

export const ruleSourceColumns = {
  Layouts: "layouts",
  Cores: "cores",
  Fontes: "fontes",
  Estilo: "estilo",
  Voz: "voz",
} as const;

export const findKeyByValue = <TKey extends string, TValue extends string>(
  record: Record<TKey, TValue>,
  value: string,
) =>
  (Object.keys(record) as TKey[]).find((key) => record[key] === value) ?? null;

const loadedFontFamilies: Record<string, string> = {
  Poppins: "var(--font-poppins), system-ui, sans-serif",
  Inter: "var(--font-inter), system-ui, sans-serif",
  "DM Serif Display": "var(--font-dm-serif), Georgia, serif",
};

export const getGoogleFontFamily = (family: string) =>
  loadedFontFamilies[family] ?? `"${family}", system-ui, sans-serif`;

export const getUploadedFontFamily = (assetId: string) =>
  `"brand-font-${assetId}", system-ui, sans-serif`;

export type BrandStep = {
  tab: BrandTab;
  label: string;
  isDone: boolean;
};

type BrandStepSource = Pick<
  BrandKitData,
  "logos" | "palette" | "references" | "layouts" | "lovedWords" | "personas"
>;

export const getBrandSteps = (brandKit: BrandStepSource): BrandStep[] => [
  {
    tab: "logos",
    label: "enviar a logo",
    isDone: Boolean(brandKit.logos.light),
  },
  {
    tab: "colors",
    label: "ajustar as cores",
    isDone: brandKit.palette.some(
      (color) =>
        basePalette.find((baseColor) => baseColor.id === color.id)?.hex !==
        color.hex,
    ),
  },
  {
    tab: "style",
    label: "adicionar exemplos aprovados",
    isDone: brandKit.references.length > 0,
  },
  {
    tab: "layouts",
    label: "salvar um layout",
    isDone: brandKit.layouts.length > 0,
  },
  {
    tab: "voice",
    label: "definir palavras e personas",
    isDone: brandKit.lovedWords.length > 0 || brandKit.personas.length > 0,
  },
];

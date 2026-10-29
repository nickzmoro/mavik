export const CAPTION_LIMIT = 2200;
export const VISIBLE_WINDOW = 125;
export const MAX_HASHTAGS = 5;

export const CAPTION_CLICHES = [
  "descubra",
  "desbloqueie",
  "eleve",
  "mergulhe",
  "jornada",
  "transforme",
  "potencialize",
  "revolucione",
  "imperdível",
  "não perca",
  "venha conferir",
  "confira",
  "experiência única",
  "no mundo de",
  "o segredo",
  "próximo nível",
  "feito com carinho",
  "pensado para você",
  "qualidade e excelência",
  "mais do que um",
  "não é apenas",
];

const callsToAction = [
  /\bcomente\b|\bcomenta\b/,
  /\b(me |nos )?(chama|chame|mande|manda)\b.*\b(direct|dm|whats(app)?)\b/,
  /\b(salve|salva) (esse|este|o) post\b/,
  /\b(compartilhe|compartilha|marque|marca) (com )?(alguem|um|uma|quem)\b/,
  /\b(siga|segue|sigam)\b/,
  /\blink na bio\b/,
  /\b(arraste|arrasta|deslize|desliza)\b/,
  /\b(clique|clica|toque|toca) (no|na|aqui)\b/,
  /\b(conta|conte) (pra|para) (gente|mim|nos)\b/,
  /\b(fale|fala) com (a gente|a nossa equipe|nossa equipe)\b/,
  /\bchama a gente\b/,
];

const hashtagPattern = /(?:^|\s)#[\p{L}\p{N}_]+/u;

const typographicReplacements: [RegExp, string][] = [
  [/\s*—\s*/g, ", "],
  [/\s*–\s*(?=\d)/g, "-"],
  [/\s+–\s+/g, ", "],
  [/–/g, "-"],
  [/[‘’′]/g, "'"],
  [/[“”]/g, '"'],
  [/…/g, "..."],
  [/[•·]/g, "-"],
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const containsTerm = (foldedText: string, term: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${fold(term)}(?![\\p{L}\\p{N}])`, "u").test(
    foldedText,
  );

export function humanizeCaption(caption: string) {
  const withoutInvisible = caption
    .replace(/[      ]/g, " ")
    .replace(/[\p{Cf}᠎]/gu, "");

  return typographicReplacements
    .reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      withoutInvisible,
    )
    .replace(/,\s*([,.;:!?])/g, "$1")
    .replace(/,\s*\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

type LintCaptionOptions = {
  searchTerms?: string[];
  maxHashtags?: number;
};

export function lintCaption(
  caption: string,
  { searchTerms = [], maxHashtags = MAX_HASHTAGS }: LintCaptionOptions = {},
) {
  const text = caption.trim();
  const foldedText = fold(text);
  const window = text.slice(0, VISIBLE_WINDOW);
  const firstSentence = text.split(/(?<=[.!?])\s|\n/)[0] ?? "";
  const hashtags = text.match(new RegExp(hashtagPattern, "gu")) ?? [];
  const ctaCount = callsToAction.filter((pattern) =>
    pattern.test(foldedText),
  ).length;
  const cliches = CAPTION_CLICHES.filter((cliche) =>
    containsTerm(foldedText, cliche),
  );
  const terms = searchTerms.map((term) => term.trim()).filter(Boolean);

  const issues = [
    !text && "A legenda está vazia.",
    text.length > CAPTION_LIMIT &&
      `A legenda tem ${text.length} caracteres, o limite é ${CAPTION_LIMIT}.`,
    /^[#@]/.test(text) &&
      "A legenda começa com hashtag ou menção; a primeira linha precisa ser uma frase.",
    firstSentence.length > VISIBLE_WINDOW &&
      `A primeira frase tem ${firstSentence.length} caracteres e é cortada no "... mais"; use até ${VISIBLE_WINDOW}.`,
    hashtags.length > maxHashtags &&
      `A legenda tem ${hashtags.length} hashtags, o máximo é ${maxHashtags}.`,
    text.length > VISIBLE_WINDOW &&
      hashtagPattern.test(window) &&
      `Há hashtag nos primeiros ${VISIBLE_WINDOW} caracteres; deixe as hashtags no final.`,
    ctaCount > 1 && `A legenda tem ${ctaCount} chamadas para ação; use só uma.`,
    cliches.length > 0 && `Clichês proibidos: ${cliches.join(", ")}.`,
    terms.length > 0 &&
      !terms.some((term) => containsTerm(foldedText, term)) &&
      `Nenhum termo de busca aparece na legenda (${terms.join(", ")}).`,
  ].filter((issue): issue is string => Boolean(issue));

  return { isValid: issues.length === 0, issues };
}

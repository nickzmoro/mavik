export type ArtDirectionRule = {
  brandKitId: string;
  rule: string;
  isActive: boolean;
};

const maxAlternatives = 4;

function describeAlternativePick(variationIndex: number) {
  return Array.from({ length: maxAlternatives - 1 }, (_, index) => {
    const alternativeCount = index + 2;

    return `with ${alternativeCount} alternatives use alternative ${(variationIndex % alternativeCount) + 1}`;
  }).join("; ");
}

export function buildArtDirectionSection(
  brandKitId: string,
  rules: ArtDirectionRule[],
  variationIndex: number,
) {
  const activeRules = rules
    .filter((rule) => rule.brandKitId === brandKitId && rule.isActive)
    .map(({ rule }) => rule.trim())
    .filter(Boolean);

  if (activeRules.length === 0) {
    return null;
  }

  return [
    `ART DIRECTION RULES (mandatory, specific to this brand):\n- ${activeRules.join("\n- ")}`,
    `Variation for this post: when one of these rules lists alternatives (e.g. "fundo claro ou escuro"), alternate between them across posts in the order written, never at random: ${describeAlternativePick(variationIndex)}.`,
  ].join("\n");
}

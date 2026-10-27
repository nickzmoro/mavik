type Tone = {
  formalCasual: number;
  seriousFun: number;
  technicalSimple: number;
  educationalSales: number;
};

export function buildSampleCaption(tone: Tone, product?: string) {
  const subject = product?.toLowerCase() || "nosso serviço";
  const isCasual = tone.formalCasual >= 50;
  const isFun = tone.seriousFun >= 60;
  const isSimple = tone.technicalSimple >= 50;
  const isSales = tone.educationalSales >= 60;

  const opening = isSimple
    ? isCasual
      ? "Pele bonita começa com cuidado de verdade."
      : "Resultados consistentes começam com cuidado de verdade."
    : `Cada etapa de ${subject} segue um protocolo pensado para você.`;
  const closing = isSales
    ? isCasual
      ? `Garanta seu horário de ${subject} hoje.`
      : `Agende seu horário de ${subject}.`
    : isCasual
      ? "Agende sua avaliação."
      : "Agende uma avaliação e tire suas dúvidas.";

  return [opening, closing, isFun ? "Bora?" : ""].filter(Boolean).join(" ");
}

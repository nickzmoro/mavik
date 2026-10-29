export type SampleCaptionTone = {
  formalCasual: number;
  seriousFun: number;
  technicalSimple: number;
  educationalSales: number;
};

const openings = {
  formalTechnical:
    "Cada detalhe do nosso trabalho segue um padrão de qualidade pensado para você.",
  formalSimple:
    "Qualidade e cuidado em cada detalhe, para você ter a melhor experiência.",
  casualSimple: "A gente cuida de cada detalhe para você se sentir em casa.",
  casualTechnical:
    "Cada etapa foi pensada com carinho e método, do começo ao fim.",
};

const closings = {
  formalSales: "Fale com a nossa equipe e conheça as condições.",
  casualSales: "Chama a gente e vem conhecer!",
  formalEducational: "Conheça mais sobre o nosso trabalho e tire suas dúvidas.",
  casualEducational: "Quer saber mais? A gente te explica.",
};

export function buildSampleCaption(tone: SampleCaptionTone) {
  const isCasual = tone.formalCasual >= 50;
  const isSimple = tone.technicalSimple >= 50;
  const isSales = tone.educationalSales >= 50;

  const opening = isCasual
    ? isSimple
      ? openings.casualSimple
      : openings.casualTechnical
    : isSimple
      ? openings.formalSimple
      : openings.formalTechnical;
  const closing = isSales
    ? isCasual
      ? closings.casualSales
      : closings.formalSales
    : isCasual
      ? closings.casualEducational
      : closings.formalEducational;

  return `${opening} ${closing}`;
}

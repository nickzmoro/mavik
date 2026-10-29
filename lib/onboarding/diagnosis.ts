export type DiagnosisInput = {
  products: string[];
  hasWebsite: boolean;
  hasInstagram: boolean;
  hasMainGoal: boolean;
  colorCount: number;
  hasTitleFont: boolean;
  hasBodyFont: boolean;
  logoCount: number;
  hasImageStyle: boolean;
  hasVoice: boolean;
  isSampleApproved: boolean;
  lovedTermCount: number;
  forbiddenTermCount: number;
  confirmedPersonaCount: number;
  hasDifferentiators: boolean;
  hasObjections: boolean;
  competitorCount: number;
};

export type Diagnosis = {
  score: number;
  consistencyScore: number;
  contentScore: number;
  offerScore: number;
  strengths: string[];
  attentionPoints: string[];
  opportunities: string[];
};

type Criterion = {
  isMet: boolean;
  weight: number;
  strength: string;
  attention: string;
};

function scoreCriteria(criteria: Criterion[]) {
  const totalWeight = criteria.reduce((total, { weight }) => total + weight, 0);
  const metWeight = criteria
    .filter(({ isMet }) => isMet)
    .reduce((total, { weight }) => total + weight, 0);

  return Math.round((metWeight / totalWeight) * 100);
}

export function computeDiagnosis(input: DiagnosisInput): Diagnosis {
  const consistency: Criterion[] = [
    {
      isMet: input.colorCount >= 5,
      weight: 3,
      strength: "Paleta de cores completa",
      attention: "Consistência de cores",
    },
    {
      isMet: input.hasTitleFont && input.hasBodyFont,
      weight: 2,
      strength: "Fontes da marca definidas",
      attention: "Uso da fonte da marca",
    },
    {
      isMet: input.logoCount >= 2,
      weight: 3,
      strength: "Logos para fundo claro e escuro",
      attention: "Logo para fundo claro e escuro",
    },
    {
      isMet: input.hasImageStyle,
      weight: 1,
      strength: "Estilo de imagem escolhido",
      attention: "Estilo de imagem",
    },
  ];
  const content: Criterion[] = [
    {
      isMet: input.hasVoice && input.isSampleApproved,
      weight: 3,
      strength: "Tom de voz confirmado",
      attention: "Tom entre os posts",
    },
    {
      isMet: input.lovedTermCount > 0 && input.forbiddenTermCount > 0,
      weight: 1,
      strength: "Palavras da marca definidas",
      attention: "Palavras que a marca usa e evita",
    },
    {
      isMet: input.confirmedPersonaCount > 0,
      weight: 3,
      strength: "Público com personas confirmadas",
      attention: "Clareza sobre quem é o público",
    },
    {
      isMet: input.hasInstagram,
      weight: 1,
      strength: "Instagram informado",
      attention: "Presença no Instagram",
    },
  ];
  const offer: Criterion[] = [
    {
      isMet: input.products.length >= 2,
      weight: 2,
      strength: "Produtos e serviços listados",
      attention: "Produtos e serviços pouco detalhados",
    },
    {
      isMet: input.hasDifferentiators,
      weight: 3,
      strength: "Diferenciais claros",
      attention: "Diferenciais da marca",
    },
    {
      isMet: input.hasObjections,
      weight: 2,
      strength: "Objeções dos clientes mapeadas",
      attention: "Objeções dos clientes",
    },
    {
      isMet: input.hasMainGoal,
      weight: 1,
      strength: "Objetivo principal definido",
      attention: "Objetivo principal",
    },
  ];

  const consistencyScore = scoreCriteria(consistency);
  const contentScore = scoreCriteria(content);
  const offerScore = scoreCriteria(offer);
  const allCriteria = [...consistency, ...content, ...offer];

  const opportunities = [
    offerScore < 70 && "Apresentar melhor seus produtos e serviços",
    !input.hasWebsite && "Ter um site ou página de agendamento",
    input.logoCount < 2 && "Enviar logos para fundo claro e escuro",
    !input.hasImageStyle &&
      "Definir um estilo de imagem para manter a identidade visual",
    input.competitorCount === 0 && "Conhecer o que os concorrentes publicam",
    contentScore < 70 && "Publicar com mais frequência e constância",
  ].filter((opportunity): opportunity is string => Boolean(opportunity));

  return {
    score: Math.round((consistencyScore + contentScore + offerScore) / 3),
    consistencyScore,
    contentScore,
    offerScore,
    strengths: allCriteria
      .filter(({ isMet }) => isMet)
      .sort((first, second) => second.weight - first.weight)
      .map(({ strength }) => strength)
      .slice(0, 4),
    attentionPoints: allCriteria
      .filter(({ isMet }) => !isMet)
      .sort((first, second) => second.weight - first.weight)
      .map(({ attention }) => attention)
      .slice(0, 4),
    opportunities: opportunities.slice(0, 3),
  };
}

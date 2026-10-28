import type { OptionTile } from "@/components/common/option-tile-group";

export const ideaGoals = ["Atrair", "Engajar", "Vender", "Fidelizar"] as const;
export const ideaFormats = ["Post", "Story", "Reels", "Carrossel"] as const;
export const ideaTypes = [
  "Educativo",
  "Comercial",
  "Institucional",
  "Autoridade",
] as const;
export const ideaAudiences = ["Moradores", "Quem trabalha perto"] as const;
export const ideaStages = [
  "Descoberta",
  "Consideração",
  "Decisão",
  "Fidelização",
] as const;

export type IdeaGoal = (typeof ideaGoals)[number];
export type IdeaFormat = (typeof ideaFormats)[number];
export type IdeaType = (typeof ideaTypes)[number];
export type IdeaAudience = (typeof ideaAudiences)[number];
export type IdeaStage = (typeof ideaStages)[number];

export type IdeaDateKey =
  "halloween" | "black-friday" | "summer" | "christmas" | "cold-drinks-trend";

export type IdeaDate = {
  key: IdeaDateKey;
  day: string;
  name: string;
  when: string;
  isTrend: boolean;
};

export type Idea = {
  id: string;
  title: string;
  format: IdeaFormat;
  type: IdeaType;
  goal: IdeaGoal;
  stage: IdeaStage;
  audience: IdeaAudience;
  dateKey: IdeaDateKey | null;
  isRecommended: boolean;
  why: string;
  how: string;
  bestMoment: string;
  steps: string[];
  caption: string;
};

export const mockIdeaDates: IdeaDate[] = [
  {
    key: "halloween",
    day: "31 out",
    name: "Halloween",
    when: "em 11 dias",
    isTrend: false,
  },
  {
    key: "black-friday",
    day: "27 nov",
    name: "Black Friday",
    when: "em 38 dias",
    isTrend: false,
  },
  {
    key: "summer",
    day: "21 dez",
    name: "Início do verão",
    when: "em 62 dias",
    isTrend: false,
  },
  {
    key: "christmas",
    day: "25 dez",
    name: "Natal",
    when: "em 66 dias",
    isTrend: false,
  },
  {
    key: "cold-drinks-trend",
    day: "Tendência do setor",
    name: "Bebidas geladas no calor",
    when: "em alta agora",
    isTrend: true,
  },
];

export const mockIdeas: Idea[] = [
  {
    id: "do-grao-a-xicara",
    title: "Do grão à xícara em 15 segundos",
    format: "Reels",
    type: "Educativo",
    goal: "Engajar",
    stage: "Descoberta",
    audience: "Moradores",
    dateKey: null,
    isRecommended: true,
    why: "Mostra o cuidado no preparo e desperta curiosidade em quem ainda não conhece o Aurora. Bastidores foram o que mais gerou salvamentos em setembro.",
    how: "Grave na abertura, com luz natural da janela. Publique na quinta à tarde para aquecer o fim de semana.",
    bestMoment: "Quinta, 18h",
    steps: [
      "Filme 4 cenas curtas: grão, moagem, extração e a xícara no balcão.",
      "Use o som ambiente da cafeteria, sem música alta.",
      "Feche com o convite: “Sábado, a primeira xícara é com a gente.”",
    ],
    caption:
      "Da moagem à xícara, cada café do Aurora é feito na hora.\nVem provar no sábado de manhã?",
  },
  {
    id: "sinais-cafe-fresco",
    title: "3 sinais de que o seu café é fresco",
    format: "Carrossel",
    type: "Autoridade",
    goal: "Atrair",
    stage: "Consideração",
    audience: "Moradores",
    dateKey: null,
    isRecommended: false,
    why: "Posiciona o Aurora como quem entende de café e responde dúvidas reais. Carrosséis educativos costumam ser salvos e compartilhados.",
    how: "Uma dica por tela, com fotos reais do grão. Na última tela, convide para provar o blend da casa.",
    bestMoment: "Terça, 12h",
    steps: [
      "Capa com a pergunta: “Seu café é fresco mesmo?”",
      "Três telas com um sinal cada: aroma, data de torra e crema.",
      "Última tela: o blend da casa e o horário de funcionamento.",
    ],
    caption:
      "Aroma, data de torra e crema: três jeitos de saber se o café é fresco.\nSalva para lembrar na próxima compra.",
  },
  {
    id: "enquete-doce-ou-salgado",
    title: "Enquete: doce ou salgado amanhã?",
    format: "Story",
    type: "Comercial",
    goal: "Vender",
    stage: "Decisão",
    audience: "Quem trabalha perto",
    dateKey: null,
    isRecommended: true,
    why: "Deixa o público decidir e cria um compromisso de visita. Quem vota tende a voltar para ver o resultado.",
    how: "Publique às 11h. No dia seguinte, mostre o item vencedor saindo do forno, com o horário em que fica pronto.",
    bestMoment: "Sexta, 11h",
    steps: [
      "Story com duas fotos reais lado a lado e a figurinha de enquete.",
      "No dia seguinte, story com o vencedor e o horário.",
      "Responda quem votou com uma mensagem curta.",
    ],
    caption: "Amanhã cedo: doce ou salgado? Você escolhe o destaque do balcão.",
  },
  {
    id: "quem-faz-o-seu-cafe",
    title: "Quem faz o seu café",
    format: "Post",
    type: "Institucional",
    goal: "Fidelizar",
    stage: "Fidelização",
    audience: "Moradores",
    dateKey: null,
    isRecommended: false,
    why: "Rostos aproximam. Apresentar a equipe reforça o tom acolhedor e faz o cliente se sentir em casa.",
    how: "Foto real no balcão e legenda curta em primeira pessoa. Uma vez por mês, alternando quem aparece.",
    bestMoment: "Domingo, 10h",
    steps: [
      "Peça uma foto espontânea, sem pose.",
      "Escreva três linhas: nome, há quanto tempo está lá e o café favorito.",
      "Convide a comentar com o pedido de sempre.",
    ],
    caption:
      "Esta é a [NOME], que prepara o seu café toda manhã.\nQual é o seu pedido de sempre?",
  },
  {
    id: "cardapio-halloween",
    title: "Cardápio de Halloween em 10 segundos",
    format: "Reels",
    type: "Comercial",
    goal: "Vender",
    stage: "Decisão",
    audience: "Moradores",
    dateKey: "halloween",
    isRecommended: true,
    why: "Datas criam urgência sem precisar de desconto. Um cardápio temático dá um motivo para visitar nesta semana.",
    how: "Publique 3 dias antes da data e repita nos stories no dia 31, com o horário de funcionamento.",
    bestMoment: "Terça, 28 out, 18h",
    steps: [
      "Mostre os itens temáticos em cortes rápidos.",
      "Texto na tela: “Só até sexta, dia 31”.",
      "Repita nos stories no dia, com o horário.",
    ],
    caption: "Halloween no Aurora: [ITENS TEMÁTICOS] só até sexta, dia 31.",
  },
  {
    id: "cafe-com-cada-doce",
    title: "Qual café combina com cada doce",
    format: "Carrossel",
    type: "Autoridade",
    goal: "Engajar",
    stage: "Consideração",
    audience: "Moradores",
    dateKey: null,
    isRecommended: false,
    why: "Ensina algo útil e sugere combinações que aumentam o pedido sem parecer venda.",
    how: "Uma combinação por tela, com foto real. Peça para o público contar a combinação favorita nos comentários.",
    bestMoment: "Quarta, 15h",
    steps: [
      "Escolha 4 doces do balcão.",
      "Uma tela por par, com uma frase sobre o sabor.",
      "Pergunte a combinação favorita no fim.",
    ],
    caption:
      "Café coado com bolo de fubá? Espresso com brigadeiro? Conta a sua dupla favorita.",
  },
  {
    id: "cardapio-de-verao",
    title: "O que você quer no cardápio de verão?",
    format: "Story",
    type: "Institucional",
    goal: "Engajar",
    stage: "Fidelização",
    audience: "Moradores",
    dateKey: "summer",
    isRecommended: false,
    why: "Ouvir o cliente antes de lançar cria expectativa e faz o público se sentir parte do Aurora.",
    how: "Use a caixinha de perguntas no início de dezembro. Mostre as respostas mais votadas na semana seguinte.",
    bestMoment: "Segunda, 1º dez, 9h",
    steps: [
      "Story com a caixinha: “O que não pode faltar no verão?”",
      "Repost das melhores respostas.",
      "Anuncie o cardápio citando quem sugeriu.",
    ],
    caption: "O verão está chegando. O que não pode faltar no nosso cardápio?",
  },
  {
    id: "cafe-de-reuniao",
    title: "Seu café de reunião é aqui",
    format: "Post",
    type: "Comercial",
    goal: "Atrair",
    stage: "Descoberta",
    audience: "Quem trabalha perto",
    dateKey: null,
    isRecommended: true,
    why: "Apresenta o Aurora como opção para quem trabalha no bairro e precisa de um lugar tranquilo durante a semana.",
    how: "Mostre o espaço com fotos reais em horário calmo. Publique na segunda de manhã, quando a semana começa.",
    bestMoment: "Segunda, 8h",
    steps: [
      "Foto da mesa com notebook e café, em horário calmo.",
      "Liste o que o espaço oferece: [TOMADAS, WI-FI, MESAS].",
      "Convide para a primeira reunião da semana.",
    ],
    caption: "Reunião rápida, café bom e um cantinho tranquilo. Te esperamos.",
  },
  {
    id: "cold-brew-da-casa",
    title: "Cold brew da casa: o primeiro gole",
    format: "Reels",
    type: "Comercial",
    goal: "Vender",
    stage: "Consideração",
    audience: "Quem trabalha perto",
    dateKey: "cold-drinks-trend",
    isRecommended: true,
    why: "Bebidas geladas ganham procura com o calor. Mostrar o preparo transforma uma tendência do setor em motivo para visitar.",
    how: "Grave com luz da tarde e foco no gelo e na textura. Publique nos dias mais quentes da semana.",
    bestMoment: "Quarta, 14h",
    steps: [
      "Close do preparo e do copo gelando.",
      "Texto curto: “Pronto para o calor?”",
      "Fixe nos destaques enquanto durar o calor.",
    ],
    caption:
      "Calor pede cold brew. O nosso fica [HORAS] em infusão. Vem provar.",
  },
];

export const mockInitiallySavedIdeaIds = [
  "sinais-cafe-fresco",
  "cafe-com-cada-doce",
];

export const mockIdeaContextReasons = [
  "Tom acolhedor",
  "Prefere fotos reais",
  "Resultados de setembro",
];

export const ideaVersionApproaches = {
  "Mais leve": [
    "com humor do dia a dia",
    "em forma de pergunta",
    "com bastidores divertidos",
  ],
  "Mais direto": ["em 3 passos", "com convite para visitar", "antes e depois"],
  "Mais emocional": [
    "contada por um cliente",
    "pela memória afetiva",
    "por quem prepara",
  ],
} as const;

export type IdeaVersionTone = keyof typeof ideaVersionApproaches;

export const ideaVersionTones = Object.keys(
  ideaVersionApproaches,
) as IdeaVersionTone[];

export const mockScheduleDays: OptionTile[] = [
  { id: "Qui, 22 out", label: "Qui, 22 out", description: "Depois de amanhã" },
  { id: "Sex, 23 out", label: "Sex, 23 out", description: "Sugerido" },
  { id: "Sáb, 24 out", label: "Sáb, 24 out", description: "Mais movimento" },
  { id: "Dom, 25 out", label: "Dom, 25 out", description: "Agenda livre" },
];

export const mockScheduleTimes: OptionTile[] = [
  { id: "8h", label: "8h", description: "Antes do café" },
  { id: "12h", label: "12h", description: "Almoço" },
  { id: "18h", label: "18h", description: "Mais alcance" },
];

export const schedulePreparationOptions: OptionTile[] = [
  {
    id: "agent",
    label: "O agente cria tudo",
    description: "Arte e legenda para você aprovar",
  },
  {
    id: "photos",
    label: "Eu envio as fotos",
    description: "O agente escreve a legenda",
  },
];

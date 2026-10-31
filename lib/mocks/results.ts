import type { ContentFormat } from "@/lib/onboarding/constants";

export const mockIsInstagramConnected = true;

export const mockResultsPeriodStart = "2026-09-21";

export const mockDailyReach = [
  320, 340, 360, 690, 820, 760, 410, 350, 370, 380, 940, 880, 720, 430, 360,
  390, 400, 1180, 1020, 860, 470, 410, 430, 450, 1620, 1240, 980, 520, 440, 460,
];

export const mockPublishedByDay: Record<number, string> = {
  3: "Reels · Bastidores da moagem",
  4: "Post · Cardápio de primavera",
  5: "Story · Enquete de sábado",
  10: "Reels · Feliz Dia do Café",
  12: "Story · Qual o seu pedido de sábado?",
  17: "Post · Novo blend de outono",
  18: "Carrossel · Como nasce o seu café",
  19: "Story · Bom dia de sábado",
  21: "Story · Abertos no feriado",
  24: "Reels · Bastidores do forno",
  25: "Post · Combo café e pão de queijo",
  26: "Story · Pão quentinho às 8h",
};

export type EvidenceKind = "real" | "hypothesis";

export type ConclusionAction = "agenda" | "store-traffic" | "keep" | "test";

export type Conclusion = {
  id: string;
  kind: EvidenceKind;
  text: string;
  basisShort: string;
  basis: string;
  strength: 1 | 2 | 3;
  limit: string;
  cta: string;
  action: ConclusionAction;
};

export const mockConclusions: Record<string, Conclusion> = {
  c1: {
    id: "c1",
    kind: "real",
    text: "Reels de bastidores alcançaram 2,1 vezes mais pessoas que a média do perfil.",
    basisShort: "6 Reels · 30 dias",
    basis:
      "6 Reels publicados entre 21 de setembro e 20 de outubro, medidos no Instagram Insights 5 dias após cada publicação.",
    strength: 3,
    limit:
      "Mostra quantas pessoas viram, não quantas foram à loja. Para ligar alcance a clientes, precisamos do movimento dos sábados.",
    cta: "Adicionar 2 à agenda",
    action: "agenda",
  },
  c2: {
    id: "c2",
    kind: "real",
    text: "Quinta-feira foi o dia com mais alcance: 38% acima da média dos outros dias.",
    basisShort: "30 dias · 17 publicações",
    basis:
      "Alcance diário dos últimos 30 dias no Instagram. 4 quintas-feiras, todas com Reels.",
    strength: 2,
    limit:
      "Como todas as quintas tiveram Reels, parte do resultado pode ser do formato e não do dia.",
    cta: "Testar Reels em outro dia",
    action: "agenda",
  },
  c3: {
    id: "c3",
    kind: "hypothesis",
    text: "Os posts de quinta podem estar trazendo mais gente ao balcão no sábado.",
    basisShort: "Sem dados de movimento",
    basis:
      "O alcance sobe na quinta e o seu objetivo é o sábado, mas a Zaion ainda não tem nenhum dado de movimento da loja para comparar.",
    strength: 1,
    limit:
      "Informe quantos clientes vieram nos últimos sábados. Com 8 semanas, comparamos sábados com e sem campanha.",
    cta: "Informar movimento",
    action: "store-traffic",
  },
  c4: {
    id: "c4",
    kind: "real",
    text: "Enquetes no story tiveram 3 vezes mais respostas que os outros stories.",
    basisShort: "5 enquetes · 14 stories",
    basis:
      "14 stories publicados no período, 5 deles com enquete. Respostas contadas no Instagram.",
    strength: 2,
    limit:
      "Respostas mostram conversa, não venda. Mesmo assim, é um bom sinal para os stories de sábado.",
    cta: "Manter na agenda",
    action: "keep",
  },
  c5: {
    id: "c5",
    kind: "hypothesis",
    text: "Carrosséis educativos na terça podem atrair gente nova.",
    basisShort: "1 carrossel na terça",
    basis:
      "Só um carrossel educativo foi publicado numa terça. Ele foi bem salvo, mas uma publicação não é suficiente para concluir.",
    strength: 1,
    limit:
      "Publicar um carrossel educativo por terça durante 2 semanas e comparar com a média.",
    cta: "Testar por 2 semanas",
    action: "test",
  },
  c6: {
    id: "c6",
    kind: "hypothesis",
    text: "O som ambiente da cafeteria ajudou o Reels a parecer mais autêntico.",
    basisShort: "Interpretação do agente",
    basis:
      "Não existe métrica para autenticidade. É uma leitura do agente a partir do conteúdo e dos comentários.",
    strength: 1,
    limit:
      "Publicar dois Reels parecidos, um com som ambiente e outro com música, e comparar o tempo assistido.",
    cta: "Criar o teste na agenda",
    action: "test",
  },
};

export type TopContent = {
  id: string;
  rank: number;
  title: string;
  format: ContentFormat;
  date: string;
  topic: string;
  reach: string;
  engagement: string;
  multiplier: string;
  thumbColor: string;
  thumbAccentColor: string;
  metrics: { label: string; value: string }[];
  comparison: {
    label: string;
    percentage: number;
    averagePercentage: number;
    multiplier: string;
  }[];
  conclusionIds: string[];
};

export const mockTopContents: TopContent[] = [
  {
    id: "bastidores-do-forno",
    rank: 1,
    title: "Bastidores do forno",
    format: "reels",
    date: "15 out",
    topic: "Bastidores",
    reach: "4.870",
    engagement: "9,8%",
    multiplier: "2,6x",
    thumbColor: "#2e2a27",
    thumbAccentColor: "#c9a27e",
    metrics: [
      { label: "Alcance", value: "4.870" },
      { label: "Visualizações", value: "9.840" },
      { label: "Curtidas", value: "412" },
      { label: "Comentários", value: "38" },
      { label: "Salvamentos", value: "96" },
      { label: "Compartilh.", value: "51" },
      { label: "Toques no perfil", value: "44" },
    ],
    comparison: [
      {
        label: "Alcance",
        percentage: 100,
        averagePercentage: 38,
        multiplier: "2,6x",
      },
      {
        label: "Salvamentos",
        percentage: 100,
        averagePercentage: 32,
        multiplier: "3,1x",
      },
      {
        label: "Comentários",
        percentage: 56,
        averagePercentage: 40,
        multiplier: "1,4x",
      },
    ],
    conclusionIds: ["c1", "c6"],
  },
  {
    id: "feliz-dia-do-cafe",
    rank: 2,
    title: "Feliz Dia do Café",
    format: "reels",
    date: "1 out",
    topic: "Datas",
    reach: "2.910",
    engagement: "7,6%",
    multiplier: "1,6x",
    thumbColor: "#efe4d6",
    thumbAccentColor: "#7a5232",
    metrics: [
      { label: "Alcance", value: "2.910" },
      { label: "Visualizações", value: "6.120" },
      { label: "Curtidas", value: "268" },
      { label: "Comentários", value: "22" },
      { label: "Salvamentos", value: "31" },
      { label: "Compartilh.", value: "40" },
      { label: "Toques no perfil", value: "29" },
    ],
    comparison: [
      {
        label: "Alcance",
        percentage: 64,
        averagePercentage: 38,
        multiplier: "1,6x",
      },
      {
        label: "Compartilh.",
        percentage: 90,
        averagePercentage: 45,
        multiplier: "2,0x",
      },
      {
        label: "Salvamentos",
        percentage: 40,
        averagePercentage: 40,
        multiplier: "1,0x",
      },
    ],
    conclusionIds: ["c2"],
  },
  {
    id: "como-nasce-o-seu-cafe",
    rank: 3,
    title: "Como nasce o seu café",
    format: "carrossel",
    date: "9 out",
    topic: "Bastidores",
    reach: "2.240",
    engagement: "8,1%",
    multiplier: "1,4x",
    thumbColor: "#dde5da",
    thumbAccentColor: "#f4ede4",
    metrics: [
      { label: "Alcance", value: "2.240" },
      { label: "Visualizações", value: "5.010" },
      { label: "Curtidas", value: "190" },
      { label: "Comentários", value: "12" },
      { label: "Salvamentos", value: "88" },
      { label: "Compartilh.", value: "17" },
      { label: "Toques no perfil", value: "21" },
    ],
    comparison: [
      {
        label: "Alcance",
        percentage: 54,
        averagePercentage: 38,
        multiplier: "1,4x",
      },
      {
        label: "Salvamentos",
        percentage: 100,
        averagePercentage: 36,
        multiplier: "2,8x",
      },
      {
        label: "Comentários",
        percentage: 30,
        averagePercentage: 40,
        multiplier: "0,8x",
      },
    ],
    conclusionIds: ["c5"],
  },
  {
    id: "enquete-pedido-de-sabado",
    rank: 4,
    title: "Enquete: qual o seu pedido de sábado?",
    format: "story",
    date: "3 out",
    topic: "Conversa",
    reach: "1.120",
    engagement: "12,4%",
    multiplier: "3,0x resp.",
    thumbColor: "#5926c8",
    thumbAccentColor: "#b390fa",
    metrics: [
      { label: "Alcance", value: "1.120" },
      { label: "Respostas", value: "139" },
      { label: "Toques p/ frente", value: "210" },
      { label: "Saídas", value: "34" },
      { label: "Respostas no direct", value: "9" },
      { label: "Toques no perfil", value: "18" },
    ],
    comparison: [
      {
        label: "Respostas",
        percentage: 100,
        averagePercentage: 33,
        multiplier: "3,0x",
      },
      {
        label: "Alcance",
        percentage: 46,
        averagePercentage: 40,
        multiplier: "1,1x",
      },
      {
        label: "Saídas",
        percentage: 30,
        averagePercentage: 45,
        multiplier: "0,7x",
      },
    ],
    conclusionIds: ["c4"],
  },
];

export const mockFormatEngagement = [
  {
    label: "Reels",
    value: "8,9%",
    height: 100,
    colorClassName: "bg-primary",
    note: "6 publicações",
    isSmallSample: false,
  },
  {
    label: "Carrossel",
    value: "7,4%",
    height: 83,
    colorClassName: "bg-accent",
    note: "2 · amostra pequena",
    isSmallSample: true,
  },
  {
    label: "Post",
    value: "4,6%",
    height: 52,
    colorClassName: "bg-[#c9a27e]",
    note: "4 publicações",
    isSmallSample: false,
  },
  {
    label: "Story",
    value: "3,1%",
    height: 35,
    colorClassName: "bg-success",
    note: "14 stories",
    isSmallSample: false,
  },
];

export const mockTopicReach = [
  {
    label: "Bastidores",
    note: "5 posts",
    value: "1.380",
    percentage: 100,
    colorClassName: "bg-primary",
  },
  {
    label: "Datas",
    note: "3 posts",
    value: "820",
    percentage: 59,
    colorClassName: "bg-accent",
  },
  {
    label: "Produtos",
    note: "6 posts",
    value: "760",
    percentage: 55,
    colorClassName: "bg-[#c9a27e]",
  },
  {
    label: "Equipe",
    note: "2 posts · amostra pequena",
    value: "640",
    percentage: 46,
    colorClassName: "bg-success",
  },
];

export const mockAudienceSplit = [
  { label: "Não seguidores", percentage: 54, colorVariable: "var(--primary)" },
  { label: "Seguidores", percentage: 46, colorVariable: "var(--accent)" },
];

export const mockActivityHours = ["7h", "9h", "12h", "15h", "18h", "21h"];

export const mockActivityByDay = [
  { day: "Seg", values: [0.2, 0.3, 0.35, 0.2, 0.45, 0.3] },
  { day: "Ter", values: [0.2, 0.3, 0.3, 0.2, 0.5, 0.3] },
  { day: "Qua", values: [0.25, 0.35, 0.4, 0.25, 0.55, 0.35] },
  { day: "Qui", values: [0.6, 0.45, 0.45, 0.3, 0.95, 0.55], isFocus: true },
  { day: "Sex", values: [0.65, 0.5, 0.5, 0.35, 0.85, 0.6], isFocus: true },
  { day: "Sáb", values: [0.95, 0.8, 0.55, 0.35, 0.5, 0.3], isFocus: true },
  { day: "Dom", values: [0.35, 0.45, 0.4, 0.25, 0.3, 0.2] },
];

export const mockResultActions = [
  {
    conclusionId: "c1",
    title: "Faça mais Reels de bastidores na quinta",
    isPrimary: true,
  },
  {
    conclusionId: "c4",
    title: "Mantenha a enquete no story de sábado",
    isPrimary: false,
  },
  {
    conclusionId: "c5",
    title: "Teste um carrossel educativo na terça",
    isPrimary: false,
  },
  {
    conclusionId: "c3",
    title: "Comece a medir o movimento do sábado",
    isPrimary: false,
  },
];

export type DataSource = {
  id: "instagram" | "facebook" | "google";
  abbreviation: string;
  name: string;
  description: string;
  connectedDescription?: string;
  badgeClassName: string;
};

export const mockDataSources: DataSource[] = [
  {
    id: "instagram",
    abbreviation: "IG",
    name: "Instagram",
    description: "Alcance, visualizações, engajamento e cliques do seu perfil.",
    connectedDescription:
      "Alcance, visualizações, engajamento e cliques. Atualizado há 2 horas.",
    badgeClassName: "bg-[#5926c8] text-white",
  },
  {
    id: "facebook",
    abbreviation: "FB",
    name: "Página do Facebook",
    description: "Junta o alcance das duas redes num só número.",
    badgeClassName: "bg-[#1b4fa8] text-white",
  },
  {
    id: "google",
    abbreviation: "G",
    name: "Perfil da empresa no Google",
    description:
      "Pedidos de rota e ligações: o mais perto de medir visitas à loja.",
    badgeClassName: "bg-[#efe4d6] text-[#2e2a27]",
  },
];

export const mockSaturdayLabels = [
  "Sábado, 26 set",
  "Sábado, 3 out",
  "Sábado, 10 out",
  "Sábado, 17 out",
];

export const storeTrafficTargetWeeks = 8;

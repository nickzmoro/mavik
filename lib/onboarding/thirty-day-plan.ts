import type {
  BusinessGoal,
  ContentFormat,
  ContentGoal,
  ContentKind,
} from "./constants";

export type PlanItem = {
  day: number;
  kind: ContentKind;
  format: ContentFormat;
  goal: ContentGoal;
  title: string;
};

type TitleBuilder = (product: string, storeName: string) => string;

type PlanEntry = Omit<PlanItem, "title"> & { title: TitleBuilder };

const entry = (
  day: number,
  kind: ContentKind,
  format: ContentFormat,
  goal: ContentGoal,
  title: TitleBuilder,
): PlanEntry => ({ day, kind, format, goal, title });

const goalPlans: Record<BusinessGoal, PlanEntry[]> = {
  vender_mais: [
    entry(2, "comercial", "post", "vender", (p) => `${p}: como funciona e como contratar`),
    entry(4, "educativo", "carrossel", "atrair", (p) => `3 dúvidas comuns sobre ${p}`),
    entry(6, "autoridade", "post", "engajar", (_p, s) => `Bastidores de ${s}`),
    entry(9, "comercial", "story", "vender", (p) => `Oferta da semana em ${p}`),
    entry(11, "autoridade", "carrossel", "engajar", (_p, s) => `Histórias de clientes de ${s}`),
    entry(13, "educativo", "reels", "atrair", (p) => `Mitos e verdades sobre ${p}`),
    entry(16, "comercial", "post", "vender", (p) => `Por que escolher ${p} com a gente`),
    entry(18, "educativo", "carrossel", "atrair", (p) => `Como escolher ${p} sem errar`),
    entry(20, "comercial", "story", "vender", (p) => `Últimos dias: condições especiais em ${p}`),
    entry(23, "autoridade", "reels", "fidelizar", (_p, s) => `Quem está por trás de ${s}`),
    entry(25, "comercial", "post", "vender", (p) => `Perguntas frequentes sobre ${p}, respondidas`),
    entry(27, "educativo", "carrossel", "engajar", (p) => `Antes de contratar ${p}: o que perguntar`),
    entry(29, "comercial", "reels", "vender", (p) => `${p}: veja como funciona na prática`),
    entry(30, "autoridade", "story", "fidelizar", () => "Obrigado por mais um mês com você"),
  ],
  ganhar_seguidores: [
    entry(2, "educativo", "reels", "atrair", (p) => `3 dicas rápidas sobre ${p}`),
    entry(4, "autoridade", "carrossel", "engajar", (_p, s) => `Quem está por trás de ${s}`),
    entry(6, "educativo", "carrossel", "atrair", (p) => `Mitos e verdades sobre ${p}`),
    entry(8, "autoridade", "story", "engajar", (p) => `Pergunte o que quiser sobre ${p}`),
    entry(10, "educativo", "reels", "atrair", (p) => `Erros comuns em ${p} e como evitar`),
    entry(12, "comercial", "post", "vender", (p, s) => `Conheça ${p} em ${s}`),
    entry(14, "autoridade", "reels", "engajar", (_p, s) => `Um dia nos bastidores de ${s}`),
    entry(16, "educativo", "carrossel", "atrair", (p) => `Guia rápido: tudo sobre ${p}`),
    entry(18, "autoridade", "post", "engajar", () => "Marque alguém que precisa ver isto"),
    entry(20, "educativo", "reels", "atrair", (p) => `Você sabia? Curiosidades sobre ${p}`),
    entry(22, "autoridade", "story", "fidelizar", () => "Enquete: o que você quer ver por aqui?"),
    entry(24, "educativo", "carrossel", "atrair", (p) => `Passo a passo de ${p}`),
    entry(26, "comercial", "story", "vender", (p) => `Convite: conheça ${p}`),
    entry(28, "autoridade", "reels", "engajar", (p) => `Perguntas que mais recebemos sobre ${p}`),
    entry(30, "educativo", "post", "atrair", (_p, s) => `Resumo do mês com ${s}`),
  ],
  divulgar_lancamento: [
    entry(2, "autoridade", "story", "engajar", (_p, s) => `Algo novo vem aí em ${s}`),
    entry(4, "autoridade", "reels", "atrair", () => "Contagem regressiva: faltam poucos dias"),
    entry(6, "educativo", "carrossel", "atrair", (p) => `Por que criamos ${p}`),
    entry(8, "comercial", "reels", "vender", (p) => `Chegou! Conheça ${p}`),
    entry(9, "comercial", "post", "vender", (p) => `Tudo sobre ${p}: o que é e para quem é`),
    entry(11, "educativo", "carrossel", "atrair", (p) => `Como ${p} funciona, passo a passo`),
    entry(13, "autoridade", "story", "engajar", (p) => `Os primeiros a conhecer ${p}`),
    entry(15, "comercial", "post", "vender", (p) => `Por que escolher ${p}`),
    entry(17, "autoridade", "carrossel", "fidelizar", (p) => `O que estão dizendo sobre ${p}`),
    entry(19, "educativo", "reels", "atrair", (p) => `Perguntas frequentes sobre ${p}`),
    entry(21, "comercial", "story", "vender", () => "Condição de lançamento: garanta a sua"),
    entry(23, "autoridade", "post", "engajar", (p) => `Bastidores do lançamento de ${p}`),
    entry(25, "comercial", "reels", "vender", (p) => `${p} em ação: veja de perto`),
    entry(27, "comercial", "story", "vender", () => "Últimos dias do lançamento"),
    entry(29, "autoridade", "post", "fidelizar", () => "Obrigado por fazer parte deste lançamento"),
  ],
  gerar_contatos: [
    entry(2, "comercial", "post", "vender", (p, s) => `Fale com ${s} e tire suas dúvidas sobre ${p}`),
    entry(4, "educativo", "carrossel", "atrair", (p) => `O que saber antes de contratar ${p}`),
    entry(6, "autoridade", "story", "engajar", (p) => `Pergunte aqui: respondemos sobre ${p}`),
    entry(9, "comercial", "reels", "vender", (p) => `Como pedir orçamento de ${p} em 1 minuto`),
    entry(11, "educativo", "post", "atrair", (p) => `3 dúvidas comuns sobre ${p}`),
    entry(13, "autoridade", "carrossel", "engajar", (_p, s) => `Como é o atendimento de ${s}, passo a passo`),
    entry(16, "comercial", "story", "vender", (p) => `Chame no WhatsApp e conheça ${p}`),
    entry(18, "educativo", "reels", "atrair", (p) => `Mitos e verdades sobre ${p}`),
    entry(20, "autoridade", "post", "fidelizar", (_p, s) => `Quem está por trás de ${s}`),
    entry(23, "comercial", "post", "vender", (p) => `Atendimento aberto para ${p}`),
    entry(25, "educativo", "carrossel", "engajar", (p) => `Como escolher ${p} sem errar`),
    entry(27, "comercial", "story", "vender", () => "Última chamada do mês: fale com a gente"),
    entry(29, "comercial", "reels", "vender", (p) => `Entre em contato e conheça ${p}`),
  ],
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export function buildThirtyDayPlan(
  storeName: string,
  products: string[],
  mainGoal: BusinessGoal | null,
): PlanItem[] {
  const productNames = products.length > 0 ? products : ["seu serviço"];
  const entries = goalPlans[mainGoal ?? "vender_mais"];

  return entries.map(({ title, ...item }, index) => ({
    ...item,
    title: capitalize(
      title(productNames[index % productNames.length].toLowerCase(), storeName),
    ),
  }));
}

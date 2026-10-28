import { getWeekday } from "@/lib/agenda-dates";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";

export function getAgendaItemReason(item: ResolvedAgendaItem) {
  const weekday = getWeekday(item.date);

  if (item.date === "2026-10-01") {
    return "Dia Internacional do Café: uma data do setor que aproxima quem ama café da sua marca.";
  }

  if (item.date === "2026-11-20") {
    return "Feriado da Consciência Negra: avisar o horário evita viagem perdida e mostra cuidado. Confirme se a loja abre.";
  }

  if (item.campaign === "Semana Aurora") {
    return "A Black Friday vira a Semana Aurora: experiência em vez de desconto, como você prefere. Concentrada no fim de semana.";
  }

  if (item.campaign === "Halloween no Aurora") {
    return "Campanha curta perto da data cria um motivo para visitar nesta semana, sem precisar de desconto.";
  }

  if (weekday === 4) {
    return `Quinta é o dia de aquecer o fim de semana: o ${item.format} ganha alcance antes do sábado, que é o seu objetivo.`;
  }

  if (weekday === 5) {
    return "Sexta de manhã as pessoas planejam o fim de semana. Um conteúdo para salvar ajuda a decidir a visita no sábado.";
  }

  if (weekday === 6) {
    return "No sábado o story conversa com quem já está a caminho e ajuda a decidir a visita na hora.";
  }

  return "Conteúdo de meio de semana para manter o ritmo e atrair gente nova, sem disputar atenção com o fim de semana.";
}

export function getAgendaItemCaption(item: ResolvedAgendaItem) {
  if (item.caption) {
    return item.caption;
  }

  return item.status === "idea"
    ? "O agente escreve a legenda quando o conteúdo entrar em produção."
    : "Legenda em preparo pelo agente. Você revisa antes de aprovar.";
}

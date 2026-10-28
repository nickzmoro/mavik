const appTimeZone = "America/Sao_Paulo";

export function getGreeting(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: appTimeZone,
    }).format(date),
  );

  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }

  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

export function formatLongDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: appTimeZone,
  }).format(date);

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

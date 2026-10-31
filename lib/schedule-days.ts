const scheduleTimeZone = "America/Sao_Paulo";
const scheduleUtcOffset = "-03:00";
const dayInMs = 24 * 60 * 60 * 1000;

const dayLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: scheduleTimeZone,
});

const isoDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: scheduleTimeZone,
});

export function getScheduleDayOptions(daysCount = 4, now = new Date()) {
  return Array.from({ length: daysCount }, (_, index) => {
    const date = new Date(now.getTime() + (index + 1) * dayInMs);
    const label = dayLabelFormatter.format(date).replaceAll(".", "");

    return {
      id: isoDateFormatter.format(date),
      label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
      description: index === 0 ? "Amanhã" : "Disponível",
    };
  });
}

export function toScheduledAt(day: string, time: string) {
  const hour = time.replace(/\D/g, "").padStart(2, "0");

  return `${day}T${hour}:00:00${scheduleUtcOffset}`;
}

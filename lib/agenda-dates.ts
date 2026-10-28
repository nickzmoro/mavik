import { agendaWeekdayLabels } from "@/lib/mocks/agenda";

const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const longWeekdayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const padNumber = (value: number) => String(value).padStart(2, "0");

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;

export const parseIsoDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const addDays = (isoDate: string, days: number) => {
  const date = parseIsoDate(isoDate);

  return toIsoDate(
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + days),
  );
};

export const getWeekday = (isoDate: string) => parseIsoDate(isoDate).getDay();

export const getMonthName = (monthIndex: number) => monthNames[monthIndex];

export const formatShortDate = (isoDate: string) => {
  const date = parseIsoDate(isoDate);

  return `${agendaWeekdayLabels[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}`;
};

export const formatLongAgendaDate = (isoDate: string) => {
  const date = parseIsoDate(isoDate);

  return `${longWeekdayNames[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]}`;
};

export const buildMonthWeeks = (year: number, monthIndex: number) => {
  const firstDay = new Date(year, monthIndex, 1);
  const cursor = new Date(year, monthIndex, 1 - firstDay.getDay());
  const weeks: { isoDate: string; isInMonth: boolean; dayNumber: number }[][] =
    [];

  do {
    const week = Array.from({ length: 7 }, () => {
      const day = {
        isoDate: toIsoDate(cursor),
        isInMonth: cursor.getMonth() === monthIndex,
        dayNumber: cursor.getDate(),
      };

      cursor.setDate(cursor.getDate() + 1);

      return day;
    });

    weeks.push(week);
  } while (cursor.getMonth() === monthIndex);

  return weeks;
};

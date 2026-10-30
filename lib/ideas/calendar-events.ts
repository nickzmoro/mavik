type MonthDay = { month: number; day: number };

const fixed = (month: number, day: number) => (): MonthDay => ({ month, day });

const toUtcDate = (year: number, { month, day }: MonthDay) =>
  new Date(Date.UTC(year, month - 1, day));

const toMonthDay = (date: Date): MonthDay => ({
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
});

const addUtcDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const nthWeekdayOfMonth =
  (month: number, weekday: number, nth: number) => (year: number) => {
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const offset = (weekday - firstDay.getUTCDay() + 7) % 7;

    return { month, day: 1 + offset + (nth - 1) * 7 };
  };

const easter = (year: number): MonthDay => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  return {
    month: Math.floor((h + l - 7 * m + 114) / 31),
    day: ((h + l - 7 * m + 114) % 31) + 1,
  };
};

const blackFriday = (year: number) => {
  const thanksgiving = nthWeekdayOfMonth(11, 4, 4)(year);

  return { month: 11, day: thanksgiving.day + 1 };
};

const shiftFrom =
  (base: (year: number) => MonthDay, days: number) => (year: number) =>
    toMonthDay(addUtcDays(toUtcDate(year, base(year)), days));

export const calendarEvents = [
  {
    key: "ano-novo",
    name: "Ano Novo",
    kind: "feriado",
    synonyms: ["ano novo", "reveillon", "virada do ano"],
    getDate: fixed(1, 1),
  },
  {
    key: "carnaval",
    name: "Carnaval",
    kind: "feriado",
    synonyms: ["carnaval"],
    getDate: shiftFrom(easter, -47),
  },
  {
    key: "dia-da-mulher",
    name: "Dia da Mulher",
    kind: "data_comercial",
    synonyms: ["dia da mulher", "dia internacional da mulher"],
    getDate: fixed(3, 8),
  },
  {
    key: "dia-do-consumidor",
    name: "Dia do Consumidor",
    kind: "data_comercial",
    synonyms: ["dia do consumidor"],
    getDate: fixed(3, 15),
  },
  {
    key: "pascoa",
    name: "Páscoa",
    kind: "feriado",
    synonyms: ["pascoa", "domingo de pascoa"],
    getDate: easter,
  },
  {
    key: "dia-das-maes",
    name: "Dia das Mães",
    kind: "data_comercial",
    synonyms: ["dia das maes", "dia da mae"],
    getDate: nthWeekdayOfMonth(5, 0, 2),
  },
  {
    key: "dia-dos-namorados",
    name: "Dia dos Namorados",
    kind: "data_comercial",
    synonyms: ["dia dos namorados", "namorados"],
    getDate: fixed(6, 12),
  },
  {
    key: "dia-dos-pais",
    name: "Dia dos Pais",
    kind: "data_comercial",
    synonyms: ["dia dos pais", "dia do pai"],
    getDate: nthWeekdayOfMonth(8, 0, 2),
  },
  {
    key: "dia-do-cliente",
    name: "Dia do Cliente",
    kind: "data_comercial",
    synonyms: ["dia do cliente"],
    getDate: fixed(9, 15),
  },
  {
    key: "dia-das-criancas",
    name: "Dia das Crianças",
    kind: "data_comercial",
    synonyms: ["dia das criancas", "dia da crianca"],
    getDate: fixed(10, 12),
  },
  {
    key: "halloween",
    name: "Halloween",
    kind: "data_comercial",
    synonyms: ["halloween", "dia das bruxas"],
    getDate: fixed(10, 31),
  },
  {
    key: "black-friday",
    name: "Black Friday",
    kind: "data_comercial",
    synonyms: ["black friday", "blackfriday", "bf", "sexta negra"],
    getDate: blackFriday,
  },
  {
    key: "cyber-monday",
    name: "Cyber Monday",
    kind: "data_comercial",
    synonyms: ["cyber monday", "cybermonday"],
    getDate: shiftFrom(blackFriday, 3),
  },
  {
    key: "natal",
    name: "Natal",
    kind: "feriado",
    synonyms: ["natal", "noite de natal", "christmas"],
    getDate: fixed(12, 25),
  },
] as const satisfies readonly {
  key: string;
  name: string;
  kind: "feriado" | "data_comercial";
  synonyms: readonly string[];
  getDate: (year: number) => MonthDay;
}[];

export type CalendarEvent = (typeof calendarEvents)[number];
export type CalendarEventKey = CalendarEvent["key"];

export const calendarEventKeys = calendarEvents.map(({ key }) => key) as [
  CalendarEventKey,
  ...CalendarEventKey[],
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const containsWord = (foldedText: string, term: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${term}(?![\\p{L}\\p{N}])`, "u").test(
    foldedText,
  );

export function detectCalendarEvent(theme: string): CalendarEvent | null {
  const foldedTheme = fold(theme);

  return (
    calendarEvents.find((event) =>
      event.synonyms.some((synonym) => containsWord(foldedTheme, synonym)),
    ) ?? null
  );
}

const saoPauloDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
});

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export function getNextOccurrence(key: CalendarEventKey, from: Date) {
  const today = saoPauloDateFormatter.format(from);
  const year = Number(today.slice(0, 4));
  const event = calendarEvents.find(
    (calendarEvent) => calendarEvent.key === key,
  );

  if (!event) {
    throw new Error(`Data desconhecida: ${key}`);
  }

  const thisYear = toIsoDate(toUtcDate(year, event.getDate(year)));

  return thisYear >= today
    ? thisYear
    : toIsoDate(toUtcDate(year + 1, event.getDate(year + 1)));
}

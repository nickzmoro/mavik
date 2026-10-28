import { cn } from "@/lib/utils";

type InsightColumnsProps = {
  strengths: string[];
  attentionPoints: string[];
  opportunities: string[];
};

export function InsightColumns({
  strengths,
  attentionPoints,
  opportunities,
}: InsightColumnsProps) {
  const columns = [
    {
      title: "Pontos fortes",
      items: strengths,
      dotClassName: "bg-success",
      empty: "Ainda não identificamos.",
    },
    {
      title: "Pontos de atenção",
      items: attentionPoints,
      dotClassName: "bg-warning",
      empty: "Nada importante agora.",
    },
    {
      title: "Oportunidades",
      items: opportunities,
      dotClassName: "bg-primary",
      empty: "Nada urgente agora.",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {columns.map(({ title, items, dotClassName, empty }) => (
        <section
          key={title}
          className="rounded-(--r-lg) border border-border bg-bg p-5 shadow-(--shadow-sm)"
        >
          <h3 className="m-0 flex items-center gap-2 font-display text-base font-semibold text-text">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", dotClassName)}
            />
            {title}
          </h3>
          {items.length > 0 ? (
            <ul className="m-0 mt-3 flex list-disc flex-col gap-1 pl-5 text-sm text-text">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="m-0 mt-3 text-sm text-muted">{empty}</p>
          )}
        </section>
      ))}
    </div>
  );
}

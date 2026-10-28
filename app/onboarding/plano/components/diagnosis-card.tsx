type DiagnosisCardProps = {
  score: number;
  consistencyScore: number;
  contentScore: number;
  offerScore: number;
};

const RING_RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export function DiagnosisCard({
  score,
  consistencyScore,
  contentScore,
  offerScore,
}: DiagnosisCardProps) {
  const bars = [
    { label: "Consistência", value: consistencyScore },
    { label: "Conteúdo", value: contentScore },
    { label: "Oferta", value: offerScore },
  ];

  return (
    <section
      aria-labelledby="maturity-title"
      className="flex flex-col gap-6 rounded-(--r-lg) bg-[linear-gradient(135deg,var(--violet-900),var(--violet-700))] p-6 text-white shadow-(--shadow-md) sm:flex-row sm:items-center sm:p-8"
    >
      <div className="relative mx-auto size-32 flex-none sm:mx-0">
        <svg
          viewBox="0 0 120 120"
          className="size-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--violet-800)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--violet-300)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - score / 100)}
          />
        </svg>
        <p className="absolute inset-0 m-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl leading-none font-bold">
            {score}
          </span>
          <span className="text-xs text-(--violet-200)">de 100</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h2
            id="maturity-title"
            className="m-0 font-display text-xl font-semibold"
          >
            Maturidade de marketing
          </h2>
          <p className="m-0 mt-1 text-sm text-(--violet-200)">
            Calculada com as suas respostas. Vira o ponto de partida do antes e
            depois no painel.
          </p>
        </div>
        <dl className="m-0 flex flex-col gap-2">
          {bars.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-[96px_1fr_32px] items-center gap-3 text-sm"
            >
              <dt>{label}</dt>
              <dd className="m-0 h-1.5 overflow-hidden rounded-full bg-(--violet-800)">
                <span
                  className="block h-full rounded-full bg-(--violet-300)"
                  style={{ width: `${value}%` }}
                />
              </dd>
              <dd className="m-0 text-right text-(--violet-200)">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

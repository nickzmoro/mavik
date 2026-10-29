import { Progress } from "@/components/ui/progress";

type DiagnosisScoreCardProps = {
  score: number;
  metrics: { label: string; value: number }[];
};

const ringRadius = 66;
const ringCircumference = 2 * Math.PI * ringRadius;

export function DiagnosisScoreCard({
  score,
  metrics,
}: DiagnosisScoreCardProps) {
  return (
    <section
      aria-labelledby="diagnosis-score-title"
      className="flex flex-col items-center gap-6 rounded-3xl border border-white/20 bg-linear-to-br from-[#1a0f3c]/90 to-[#3b1a8c]/70 p-6 text-[#f4f0ff] shadow-[0_16px_40px_rgba(26,15,60,.25)] backdrop-blur-xl sm:flex-row sm:p-8"
    >
      <div className="relative size-40 shrink-0">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          role="img"
          aria-label={`Nota ${score} de 100`}
        >
          <circle
            cx="80"
            cy="80"
            r={ringRadius}
            fill="none"
            stroke="#3a2a72"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={ringRadius}
            fill="none"
            stroke="#b390fa"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * ringCircumference} ${ringCircumference}`}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <b className="font-display text-5xl leading-none font-bold">
            {score}
          </b>
          <small className="text-sm text-[#cbb3fc]">de 100</small>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <h2
          id="diagnosis-score-title"
          className="m-0 font-display text-xl leading-[1.3] font-semibold"
        >
          Maturidade de marketing
        </h2>
        <p className="m-0 text-sm leading-normal text-[#cbb3fc]">
          Calculada com site, perfil público e respostas. Vira o baseline do
          antes e depois no dashboard.
        </p>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {metrics.map(({ label, value }) => (
            <li
              key={label}
              className="grid grid-cols-[88px_minmax(0,1fr)_28px] items-center gap-3 text-sm"
            >
              <span>{label}</span>
              <Progress
                value={value}
                aria-label={`${label}: ${value} de 100`}
                className="bg-[#3a2a72]"
                indicatorClassName="bg-[#b390fa]"
              />
              <em className="text-right not-italic">{value}</em>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Progress } from "@/components/ui/progress";
import { studioQuestions } from "@/lib/mocks/studio";

type GuidedProgressProps = {
  step: number;
  answers: string[];
  onEditAnswer: (questionIndex: number) => void;
};

export function GuidedProgress({
  step,
  answers,
  onEditAnswer,
}: GuidedProgressProps) {
  const totalQuestions = studioQuestions.length;
  const answeredCount = Math.min(step, totalQuestions);
  const progressLabel =
    step >= totalQuestions
      ? "Todas as perguntas respondidas"
      : `Pergunta ${step + 1} de ${totalQuestions}`;

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] leading-[1.4] font-semibold text-muted">
          {progressLabel}
        </span>
        <Progress
          value={answeredCount}
          max={totalQuestions}
          aria-label="Progresso das perguntas"
        />
      </div>
      {answeredCount > 0 ? (
        <ol
          aria-label="Suas respostas"
          className="m-0 flex list-none flex-col gap-2 p-0"
        >
          {answers.slice(0, answeredCount).map((answer, questionIndex) => {
            const question = studioQuestions[questionIndex].text;

            return (
              <li
                key={question}
                className="tile flex items-center gap-3 rounded-(--r-lg) py-2.5 pr-2 pl-3.5"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-xs leading-[1.4] text-muted">
                    {question}
                  </span>
                  <span className="text-sm leading-[1.4] font-semibold break-words">
                    {answer}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Editar resposta: ${question}`}
                  onClick={() => onEditAnswer(questionIndex)}
                  className="min-h-9 shrink-0 cursor-pointer rounded-(--r-sm) border-0 bg-transparent px-2.5 text-[13px] font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
                >
                  Editar
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </>
  );
}

import { AuthBrandItem } from "@/components/auth/auth-brand-item";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

const steps = [
  {
    title: "Conte sobre sua marca",
    description: "Envie sua logo, cores e o tom que você quer usar.",
  },
  {
    title: "Receba suas artes",
    description: "A Mavik cria opções e você ajusta o que quiser.",
  },
  {
    title: "Revise e agende",
    description: "Nada é publicado sem a sua aprovação.",
  },
];

export function SignUpBrandPanel() {
  return (
    <AuthBrandPanel
      ariaLabel="Como a Mavik funciona"
      title="Seus primeiros posts em poucos minutos."
      description="Três passos e sua marca ganha uma rotina de conteúdo."
    >
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {steps.map((step, index) => (
          <AuthBrandItem
            key={step.title}
            icon={index + 1}
            title={step.title}
            description={step.description}
            isHighlighted={index === 0}
          />
        ))}
      </ol>
    </AuthBrandPanel>
  );
}

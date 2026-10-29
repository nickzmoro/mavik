import { Button } from "@/components/ui/button";

type StepFooterActionsProps = {
  submitLabel?: string;
  isSubmitting?: boolean;
  onExit: () => void;
};

export function StepFooterActions({
  submitLabel = "Continuar",
  isSubmitting = false,
  onExit,
}: StepFooterActionsProps) {
  return (
    <>
      <Button type="button" variant="ghost" onClick={onExit}>
        Sair e continuar depois
      </Button>
      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </>
  );
}

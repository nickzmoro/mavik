export type StepNavigationProps<TValues> = {
  defaultValues?: Partial<TValues>;
  onContinue: () => void;
  onBack?: () => void;
  onExit: () => void;
};

export function OnboardingStepSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando"
      className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-(--r-lg) bg-surface motion-reduce:animate-none"
          />
        ))}
      </div>
      <div className="hidden h-48 animate-pulse rounded-(--r-lg) bg-surface motion-reduce:animate-none lg:block" />
    </div>
  );
}

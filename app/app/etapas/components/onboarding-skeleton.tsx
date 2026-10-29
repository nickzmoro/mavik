export function OnboardingSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-1 flex-col">
      <div className="glass h-16 rounded-none border-x-0 border-t-0" />
      <div className="mx-auto flex w-full max-w-240 flex-col gap-6 px-4 pt-10 sm:px-6">
        <span className="h-9 w-72 animate-pulse rounded-full bg-text/10 motion-reduce:animate-none" />
        <span className="h-4 w-96 max-w-full animate-pulse rounded-full bg-text/10 motion-reduce:animate-none" />
        <span className="h-64 w-full animate-pulse rounded-3xl bg-text/10 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

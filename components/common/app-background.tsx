const glowClassName =
  "pointer-events-none absolute -z-10 rounded-full blur-[140px] dark:blur-[150px]";

export function AppBackground() {
  return (
    <div aria-hidden="true">
      <div
        className={`${glowClassName} -top-65 -right-30 size-160 bg-(--violet-200) opacity-55 dark:-top-70 dark:bg-(--violet-700) dark:opacity-45`}
      />
      <div
        className={`${glowClassName} top-95 left-45 size-130 bg-[#e7dccf] opacity-60 dark:top-105 dark:left-55 dark:bg-[#3a2a1f] dark:opacity-35`}
      />
      <div
        className={`${glowClassName} right-55 -bottom-50 size-120 bg-[#d9e4f2] opacity-70 dark:-bottom-55 dark:bg-[#1b2b52] dark:opacity-50`}
      />
    </div>
  );
}

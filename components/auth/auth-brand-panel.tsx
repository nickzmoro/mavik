import Image from "next/image";

type AuthBrandPanelProps = {
  ariaLabel: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthBrandPanel({
  ariaLabel,
  title,
  description,
  children,
}: AuthBrandPanelProps) {
  return (
    <aside
      aria-label={ariaLabel}
      className="theme-dark relative box-border flex max-w-160 flex-[0_0_44%] flex-col justify-between gap-12 overflow-hidden bg-(--violet-900) px-14 py-12 text-text max-[960px]:hidden"
    >
      <div
        aria-hidden="true"
        className="absolute -top-45 -right-55 size-140 rounded-full bg-(--violet-600) opacity-55 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-30 size-105 rounded-full bg-(--violet-400) opacity-35 blur-[120px]"
      />

      <div className="relative flex items-center">
        <Image
          src="/mavik-logo-dark.webp"
          alt="Mavik"
          width={2843}
          height={735}
          className="block h-8 w-auto"
        />
      </div>

      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="m-0 max-w-115 font-display text-[32px] leading-[1.2] font-bold text-text">
            {title}
          </h2>
          <p className="m-0 max-w-110 text-base leading-[1.6] text-muted">
            {description}
          </p>
        </div>

        {children}
      </div>

      <p className="relative m-0 text-xs leading-[1.4] font-medium text-muted">
        © 2026 Mavik. Todos os direitos reservados.
      </p>
    </aside>
  );
}

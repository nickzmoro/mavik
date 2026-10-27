import { CircleHelp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { legalInfo } from "@/lib/legal";
import { routes } from "@/lib/routes";

function getInitials(name: string) {
  const [firstName = "", lastName = ""] = name.trim().split(/\s+/);

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
}

export function OnboardingHeader({ userName }: { userName: string }) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-bg/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href={routes.home}
          className="rounded-(--r-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Image
            src="/mavik-logo-light.webp"
            alt="Mavik"
            width={2843}
            height={735}
            className="block h-6 w-auto"
          />
        </Link>
        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-border sm:block"
        />
        <span className="hidden text-sm text-muted sm:inline">
          Configuração da conta
        </span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`mailto:${legalInfo.contactEmail}`}
          className="flex min-h-11 items-center gap-2 rounded-full px-3 font-display text-sm font-semibold text-text no-underline transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <CircleHelp size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Precisa de ajuda?</span>
          <span className="sr-only sm:hidden">Precisa de ajuda?</span>
        </a>
        <span
          aria-label={userName ? `Conta de ${userName}` : "Sua conta"}
          className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-primary"
        >
          {getInitials(userName)}
        </span>
      </div>
    </header>
  );
}

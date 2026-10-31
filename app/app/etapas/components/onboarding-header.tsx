import { CircleHelp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { legalInfo } from "@/lib/legal";
import { routes } from "@/lib/routes";

type OnboardingHeaderProps = {
  userInitials: string;
};

export function OnboardingHeader({ userInitials }: OnboardingHeaderProps) {
  return (
    <header className="mx-auto w-full top-0 z-20 flex h-16 shrink-0 items-center gap-3 rounded-none border-x-0 border-t-0 px-4 sm:gap-4 sm:px-6">
      <div className="max-w-7xl flex mx-auto w-full shrink-0 items-center gap-3 rounded-none border-x-0 border-t-0 px-4 sm:gap-4 sm:px-6">
        <Link
          href={routes.authenticatedHome}
          aria-label="Zaion, ir para o início"
          className="flex rounded-(--r-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Image
            src="/zaion-logo-light.webp"
            alt="Zaion"
            width={2843}
            height={735}
            priority
            className="block h-6.5 w-auto dark:hidden"
          />
          <Image
            src="/zaion-logo-dark.webp"
            alt="Zaion"
            width={2843}
            height={735}
            priority
            className="hidden h-6.5 w-auto dark:block"
          />
        </Link>
        <span className="hidden text-sm text-muted sm:inline">
          Configuração da conta
        </span>
        <span className="flex-1" />
        <Button variant="ghost" asChild>
          <a href={`mailto:${legalInfo.contactEmail}`}>
            <CircleHelp aria-hidden="true" className="size-4.5" />
            <span className="max-sm:sr-only">Precisa de ajuda?</span>
          </a>
        </Button>
        <Avatar size="sm">
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

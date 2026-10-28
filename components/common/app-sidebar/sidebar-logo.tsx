import Image from "next/image";
import Link from "next/link";

import { routes } from "@/lib/routes";

type SidebarLogoProps = {
  onNavigate?: () => void;
};

export function SidebarLogo({ onNavigate }: SidebarLogoProps) {
  return (
    <Link
      href={routes.authenticatedHome}
      onClick={onNavigate}
      aria-label="Mavik, ir para o início"
      className="relative flex w-fit items-center rounded-(--r-sm) px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <Image
        src="/mavik-logo-dark.webp"
        alt="Mavik"
        width={2843}
        height={735}
        priority
        className="block h-6.5 w-auto"
      />
    </Link>
  );
}

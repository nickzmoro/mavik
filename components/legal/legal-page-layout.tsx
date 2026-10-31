import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TextLink } from "@/components/auth/text-link";
import { legalInfo } from "@/lib/legal";
import { routes } from "@/lib/routes";

import { LegalSection } from "./legal-section";

export type LegalSectionContent = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type LegalPageLayoutProps = {
  title: string;
  description: string;
  sections: LegalSectionContent[];
};

const legalNavLinks = [
  { label: "Termos de uso", href: routes.terms },
  { label: "Política de privacidade", href: routes.privacy },
];

export function LegalPageLayout({
  title,
  description,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="theme-light min-h-screen bg-bg font-sans text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href={routes.home}
            aria-label="Zaion, página inicial"
            className="rounded-(--r-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Image
              src="/zaion-logo-light.webp"
              alt="Zaion"
              width={124}
              height={32}
              className="block h-8 w-auto"
              priority
            />
          </Link>
          <TextLink
            href={routes.home}
            className="inline-flex min-h-11 items-center gap-2 text-sm leading-normal font-medium no-underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </TextLink>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-12 pb-20">
        <p className="m-0 text-sm leading-normal text-muted">
          Última atualização: {legalInfo.lastUpdated}
        </p>
        <h1 className="mt-3 mb-4 font-display text-[32px] leading-[1.2] font-bold text-text sm:text-[40px]">
          {title}
        </h1>
        <p className="m-0 text-base leading-[1.7] text-muted">{description}</p>

        <nav
          aria-label="Nesta página"
          className="mt-10 rounded-(--r-lg) border border-border bg-surface p-6"
        >
          <p className="m-0 mb-3 font-display text-sm font-semibold text-text">
            Nesta página
          </p>
          <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-sm leading-normal">
            {sections.map((section) => (
              <li key={section.id} className="text-muted">
                <TextLink
                  href={`#${section.id}`}
                  className="no-underline hover:underline"
                >
                  {section.title}
                </TextLink>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-12">
          {sections.map((section, index) => (
            <LegalSection
              key={section.id}
              id={section.id}
              number={index + 1}
              title={section.title}
            >
              {section.content}
            </LegalSection>
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 text-sm leading-normal text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © 2026 {legalInfo.companyName}. Todos os direitos reservados.
          </p>
          <nav aria-label="Links legais" className="flex gap-6">
            {legalNavLinks.map((link) => (
              <TextLink
                key={link.href}
                href={link.href}
                className="text-muted no-underline hover:text-text"
              >
                {link.label}
              </TextLink>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

import { routes } from "@/lib/routes";

import { TextLink } from "./text-link";

const legalLinks = [
  { label: "Termos", href: routes.terms },
  { label: "Privacidade", href: routes.privacy },
  { label: "Suporte", href: "#" },
];

export function AuthLegalNav() {
  return (
    <nav aria-label="Links legais" className="flex gap-6 text-sm leading-normal">
      {legalLinks.map((link) => (
        <TextLink
          key={link.label}
          href={link.href}
          className="text-muted no-underline hover:text-muted"
        >
          {link.label}
        </TextLink>
      ))}
    </nav>
  );
}

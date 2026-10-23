import { TextLink } from "./text-link";

const legalLinks = [
  { label: "Termos", href: "#" },
  { label: "Privacidade", href: "#" },
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

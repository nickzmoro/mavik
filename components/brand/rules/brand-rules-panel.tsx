import { BookOpen } from "lucide-react";
import Link from "next/link";

import { SideNote } from "@/components/onboarding/side-note";
import { logoRules } from "@/lib/brand/logo-rules";
import { routes } from "@/lib/routes";

type BrandRulesPanelProps = {
  rules: { id: string; rule: string }[];
  manualFileName?: string;
};

export function BrandRulesPanel({
  rules,
  manualFileName,
}: BrandRulesPanelProps) {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-(--r-lg) border border-border bg-bg p-6 shadow-(--shadow-sm)">
        <h2 className="m-0 font-display text-xl font-semibold text-text">
          O que a IA segue em toda arte
        </h2>
        {rules.length > 0 ? (
          <ul className="m-0 mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-normal text-text">
            {rules.map(({ id, rule }) => (
              <li key={id}>{rule}</li>
            ))}
          </ul>
        ) : (
          <p className="m-0 mt-3 text-sm text-muted">
            {manualFileName
              ? "Lemos o manual na próxima arte que você gerar. As regras aparecem aqui."
              : "Envie o manual da marca na aba Brand Kit para a IA seguir as regras dele."}
          </p>
        )}
        <h2 className="m-0 mt-8 font-display text-xl font-semibold text-text">
          Regras da logo
        </h2>
        <ul className="m-0 mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-normal text-text">
          {logoRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <aside className="flex flex-col gap-4">
        <SideNote title="Manual da marca">
          <p className="flex items-center gap-2">
            <BookOpen size={16} aria-hidden="true" />
            {manualFileName ?? "Nenhum manual enviado"}
          </p>
          <p className="mt-2">
            Para trocar o manual, use a aba{" "}
            <Link
              href={`${routes.brand}?aba=brand-kit`}
              className="text-primary underline"
            >
              Brand Kit
            </Link>
            . As regras são lidas de novo na próxima arte.
          </p>
        </SideNote>
      </aside>
    </div>
  );
}

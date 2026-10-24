import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/legal/legal-page-layout";

import { termsSections } from "./components/terms-sections";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Regras de uso da Mavik: conta, planos, pagamentos, conteúdo gerado por IA e responsabilidades.",
  alternates: { canonical: "/termos" },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Termos de uso"
      description="Estas são as regras para usar a Mavik. Escrevemos de forma direta para que você entenda o que pode esperar da gente e o que esperamos de você."
      sections={termsSections}
    />
  );
}

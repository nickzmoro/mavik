import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/legal/legal-page-layout";

import { privacySections } from "./components/privacy-sections";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a Mavik coleta, usa, compartilha e protege seus dados pessoais, de acordo com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Política de privacidade"
      description="Sua confiança importa. Aqui explicamos, de forma clara, como tratamos seus dados pessoais e quais são os seus direitos."
      sections={privacySections}
    />
  );
}

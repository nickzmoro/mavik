import type { Metadata } from "next";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GoogleButton } from "@/components/auth/google-button";
import { TextLink } from "@/components/auth/text-link";

import { SignUpBrandPanel } from "./components/sign-up-brand-panel";
import { SignUpForm } from "./components/sign-up-form";

export const metadata: Metadata = {
  title: "Criar conta",
  alternates: { canonical: "/criar-conta" },
};

export default function SignUpPage() {
  return (
    <AuthLayout brandPanel={<SignUpBrandPanel />} className="gap-7">
      <AuthHeader
        title="Crie sua conta"
        description="Comece grátis. Leva menos de um minuto."
      />

      <GoogleButton>Cadastrar com Google</GoogleButton>

      <AuthDivider>ou use seu e-mail</AuthDivider>

      <SignUpForm />

      <p className="m-0 text-center text-sm leading-normal text-muted">
        Já tem conta?{" "}
        <TextLink href="/login" className="font-semibold underline">
          Entrar
        </TextLink>
      </p>
    </AuthLayout>
  );
}

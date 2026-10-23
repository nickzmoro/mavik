import type { Metadata } from "next";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GoogleButton } from "@/components/auth/google-button";
import { TextLink } from "@/components/auth/text-link";

import { LoginBrandPanel } from "./components/login-brand-panel";
import { LoginForm } from "./components/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthLayout brandPanel={<LoginBrandPanel />}>
      <AuthHeader
        title="Bem-vindo de volta"
        description="Entre para continuar criando seus posts."
      />

      <LoginForm />

      <AuthDivider>ou</AuthDivider>

      <GoogleButton>Continuar com Google</GoogleButton>

      <p className="m-0 text-center text-sm leading-normal text-muted">
        Ainda não tem conta?{" "}
        <TextLink href="/criar-conta" className="font-semibold underline">
          Criar conta grátis
        </TextLink>
      </p>
    </AuthLayout>
  );
}

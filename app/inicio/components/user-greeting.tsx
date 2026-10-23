import { redirect } from "next/navigation";

import { routes } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { SignOutButton } from "./sign-out-button";

export async function UserGreeting() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect(routes.login);
  }

  const userName =
    typeof claims.user_metadata?.full_name === "string"
      ? claims.user_metadata.full_name
      : "";

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="m-0 font-display text-[32px] leading-[1.2] font-bold text-text">
        {userName ? `Olá, ${userName}!` : "Olá!"}
      </h1>
      <p className="m-0 text-base leading-[1.6] text-muted">
        Você entrou na sua conta. Seu painel chega em breve.
      </p>
      <SignOutButton />
    </div>
  );
}

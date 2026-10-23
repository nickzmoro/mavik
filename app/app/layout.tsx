import { redirect } from "next/navigation";
import { Suspense } from "react";

import { routes } from "@/lib/routes";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

async function RequireAuth() {
  const claims = await getCurrentUserClaims();

  if (!claims) {
    redirect(routes.login);
  }

  return null;
}

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <RequireAuth />
      </Suspense>
      {children}
    </>
  );
}

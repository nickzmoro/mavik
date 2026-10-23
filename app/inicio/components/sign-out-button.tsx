"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/mutations/use-sign-out";

export function SignOutButton() {
  const router = useRouter();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    const result = await signOutMutation.mutateAsync();

    if (result.isSuccess) {
      router.replace(result.data.redirectTo);
      router.refresh();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      loading={signOutMutation.isPending}
    >
      Sair
    </Button>
  );
}

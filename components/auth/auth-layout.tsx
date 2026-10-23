import { cn } from "@/lib/utils";

import { AuthLegalNav } from "./auth-legal-nav";

type AuthLayoutProps = {
  brandPanel?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function AuthLayout({
  brandPanel,
  className,
  children,
}: AuthLayoutProps) {
  return (
    <div className="theme-light flex min-h-screen max-sm:pb-12 bg-bg font-sans text-text">
      {brandPanel}

      <main className="box-border flex min-w-0 flex-auto flex-col items-center justify-between gap-10 px-6 pt-12 pb-8">
        <div aria-hidden="true" className="h-px" />

        <div className={cn("flex w-full max-w-100 flex-col gap-8", className)}>
          {children}
        </div>

        <AuthLegalNav />
      </main>
    </div>
  );
}

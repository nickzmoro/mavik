"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { routes } from "@/lib/routes";

const isAppPath = (pathname: string) =>
  pathname === routes.appRoot || pathname.startsWith(`${routes.appRoot}/`);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={isAppPath(pathname) ? undefined : "dark"}
    >
      {children}
    </NextThemesProvider>
  );
}

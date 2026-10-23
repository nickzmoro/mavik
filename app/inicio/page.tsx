import type { Metadata } from "next";
import { Suspense } from "react";

import { UserGreeting } from "./components/user-greeting";

export const metadata: Metadata = {
  title: "Início",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <main className="theme-light flex min-h-screen items-center justify-center bg-bg px-6 font-sans text-text">
      <Suspense fallback={null}>
        <UserGreeting />
      </Suspense>
    </main>
  );
}

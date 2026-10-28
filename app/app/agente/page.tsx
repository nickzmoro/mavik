import type { Metadata } from "next";
import { Suspense } from "react";

import { AgentChat } from "./components/agent-chat";
import { AgentContextPanel } from "./components/agent-context-panel";
import { AgentHeader } from "./components/agent-header";
import { AgentHistoryProvider } from "./components/agent-history-provider";
import {
  AgentWelcomeTitle,
  AgentWelcomeTitleFallback,
} from "./components/agent-welcome-title";

export const metadata: Metadata = {
  title: "Agente",
  robots: { index: false, follow: false },
};

export default function AgentPage() {
  return (
    <AgentHistoryProvider>
      <div className="flex flex-col gap-5 xl:-mb-4 xl:h-[calc(100dvh-4rem)] xl:min-h-160">
        <AgentHeader />
        <div className="flex min-h-0 flex-1 flex-col gap-6 xl:flex-row">
          <AgentChat
            welcomeTitle={
              <Suspense fallback={<AgentWelcomeTitleFallback />}>
                <AgentWelcomeTitle />
              </Suspense>
            }
          />
          <AgentContextPanel />
        </div>
      </div>
    </AgentHistoryProvider>
  );
}

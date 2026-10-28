"use client";

import { createContext, useContext, useState } from "react";

import { ConversationHistoryDialog } from "./conversation-history-dialog";

type AgentHistoryContextValue = {
  openHistory: () => void;
};

const AgentHistoryContext = createContext<AgentHistoryContextValue | null>(
  null,
);

export function AgentHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <AgentHistoryContext.Provider
      value={{ openHistory: () => setIsHistoryOpen(true) }}
    >
      {children}
      <ConversationHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </AgentHistoryContext.Provider>
  );
}

export function useAgentHistory() {
  const context = useContext(AgentHistoryContext);

  if (!context) {
    throw new Error("useAgentHistory must be used within AgentHistoryProvider");
  }

  return context;
}

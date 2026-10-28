import type { Metadata } from "next";

import { AgendaWorkspace } from "./components/agenda-workspace";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

export default function AgendaPage() {
  return (
    <div className="flex flex-col gap-5">
      <AgendaWorkspace />
    </div>
  );
}

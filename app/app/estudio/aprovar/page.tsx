import type { Metadata } from "next";

import { CopyApprovalWorkspace } from "./components/copy-approval-workspace";

export const metadata: Metadata = {
  title: "Aprovar textos",
  robots: { index: false, follow: false },
};

export default function CopyApprovalPage() {
  return (
    <div className="flex flex-col gap-5">
      <CopyApprovalWorkspace />
    </div>
  );
}

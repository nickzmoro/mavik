import type { AgendaStatus } from "@/lib/mocks/agenda";

export const agendaStatusCardClassNames: Record<AgendaStatus, string> = {
  idea: "border border-dashed border-[#b7b0cc] bg-white/75 text-[#1b1530] dark:border-white/28 dark:bg-white/4 dark:text-[#f4f0ff]",
  production:
    "border border-[#9bbbe8] bg-[#e6effc] text-[#12305c] dark:border-[rgba(91,148,240,.5)] dark:bg-[rgba(91,148,240,.18)] dark:text-[#d6e5ff]",
  review:
    "border border-[#f0c66e] bg-[#fff1d6] text-[#5c3600] dark:border-[rgba(245,185,77,.5)] dark:bg-[rgba(245,185,77,.16)] dark:text-[#ffe2a8]",
  approved:
    "border border-[#86d1bb] bg-[#e3f6f0] text-[#0b4d3c] dark:border-[rgba(79,209,174,.5)] dark:bg-[rgba(79,209,174,.15)] dark:text-[#c6f5e7]",
  published:
    "border border-[#5926c8] bg-[#5926c8] text-white dark:border-[#b390fa] dark:bg-[#b390fa] dark:text-[#1a0f3c]",
};

export const agendaStatusDotClassNames: Record<AgendaStatus, string> = {
  idea: "bg-[#6f6990] dark:bg-[#b9b0d6]",
  production: "bg-[#2f6fd0] dark:bg-[#7fb0ff]",
  review: "bg-[#b46d00] dark:bg-[#f5b94d]",
  approved: "bg-[#0e8a6b] dark:bg-[#4fd1ae]",
  published: "bg-[#5926c8] dark:bg-[#b390fa]",
};

export const agendaDayCellClassName =
  "border border-white/90 bg-white/55 dark:border-white/7 dark:bg-white/3.5";

export const agendaFocusDayCellClassName =
  "border-[rgba(179,144,250,.35)] bg-[rgba(239,232,253,.75)] dark:border-[rgba(179,144,250,.25)] dark:bg-[rgba(179,144,250,.08)]";

import { createLucideIcon } from "lucide-react";

export const SparklesIcon = createLucideIcon("zaion-sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "sparkle",
    },
  ],
  ["path", { d: "M20 3v4", key: "vertical" }],
  ["path", { d: "M22 5h-4", key: "horizontal" }],
]);

export const LayersIcon = createLucideIcon("zaion-layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "top",
    },
  ],
  [
    "path",
    { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "bottom" },
  ],
  [
    "path",
    { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "middle" },
  ],
]);

export const CalendarCheckIcon = createLucideIcon("zaion-calendar-check", [
  ["path", { d: "M8 2v4", key: "left-ring" }],
  ["path", { d: "M16 2v4", key: "right-ring" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "body" }],
  ["path", { d: "M3 10h18", key: "header" }],
  ["path", { d: "m9 16 2 2 4-4", key: "check" }],
]);

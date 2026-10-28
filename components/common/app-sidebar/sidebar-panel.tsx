import { cn } from "@/lib/utils";

type SidebarPanelProps = React.ComponentProps<"div">;

export function SidebarPanel({
  className,
  children,
  ...props
}: SidebarPanelProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-white/14 bg-[#4C2AA8E6] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_12px_32px_rgba(59,26,140,.22)] dark:bg-[#4C2AA880] dark:shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_16px_40px_rgba(89,38,200,.28)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-35 -left-30 -z-10 size-80 rounded-full bg-[#7a55e0] opacity-45 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-35 -bottom-30 -z-10 size-70 rounded-full bg-[#2f1680] opacity-50 blur-[80px]"
      />
      {children}
    </div>
  );
}

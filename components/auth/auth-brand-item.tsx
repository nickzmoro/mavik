import { cn } from "@/lib/utils";

type AuthBrandItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isHighlighted?: boolean;
};

export function AuthBrandItem({
  icon,
  title,
  description,
  isHighlighted = false,
}: AuthBrandItemProps) {
  return (
    <li className="flex items-start gap-4 rounded-(--r-lg) border border-border bg-white/5 px-5 py-4">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-10 flex-none items-center justify-center rounded-full font-display text-base font-bold",
          isHighlighted
            ? "bg-accent text-(--violet-900)"
            : "bg-surface-2 text-accent",
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-base leading-[1.4] font-semibold text-text">
          {title}
        </span>
        <span className="text-sm leading-normal text-muted">{description}</span>
      </div>
    </li>
  );
}

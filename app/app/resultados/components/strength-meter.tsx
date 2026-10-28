import { cn } from "@/lib/utils";

const strengthLabels = ["baixa", "média", "alta"];

type StrengthMeterProps = {
  strength: 1 | 2 | 3;
  size: "sm" | "lg";
};

export function StrengthMeter({ strength, size }: StrengthMeterProps) {
  return (
    <span
      role="img"
      aria-label={`Força da evidência: ${strengthLabels[strength - 1]}`}
      className={cn(
        size === "sm"
          ? "inline-flex items-center gap-0.75"
          : "grid grid-cols-3 gap-1.5",
      )}
    >
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          className={cn(
            size === "sm" ? "h-1.5 w-3.5 rounded-[3px]" : "h-2.5 rounded-full",
            level <= strength ? "bg-primary" : "bg-[rgba(127,117,160,.25)]",
          )}
        />
      ))}
    </span>
  );
}

import { Separator } from "@/components/ui/separator";

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1">
        <Separator />
      </div>
      <span className="text-sm leading-normal whitespace-nowrap text-muted">
        {children}
      </span>
      <div className="flex flex-1">
        <Separator />
      </div>
    </div>
  );
}

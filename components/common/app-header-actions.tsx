import { Bell, CircleHelp, Search, type LucideIcon } from "lucide-react";

type HeaderAction = {
  label: string;
  icon: LucideIcon;
  hasIndicator?: boolean;
};

const headerActions: HeaderAction[] = [
  { label: "Buscar", icon: Search },
  { label: "Notificações, 2 novas", icon: Bell, hasIndicator: true },
  { label: "Ajuda", icon: CircleHelp },
];

export function AppHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      {headerActions.map(({ label, icon: Icon, hasIndicator }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="glass relative flex size-11 cursor-pointer items-center justify-center rounded-full p-0 text-text transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none dark:hover:bg-white/12"
        >
          <Icon aria-hidden="true" className="size-4.5" />
          {hasIndicator ? (
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.75 size-2 rounded-full border-2 border-white bg-primary dark:border-[#0f0a1f]"
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}

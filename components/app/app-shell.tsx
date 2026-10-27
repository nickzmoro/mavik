import { AppSidebar } from "./app-sidebar";

type AppShellProps = {
  activeHref: string;
  section: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AppShell({
  activeHref,
  section,
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <div className="theme-light min-h-screen bg-[radial-gradient(circle_at_top_right,var(--violet-100),var(--surface)_55%)] p-4 font-sans text-text lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
      <AppSidebar activeHref={activeHref} />

      <main className="mx-auto w-full max-w-[1120px] pt-8 pb-12 lg:pt-6">
        <header>
          <p className="m-0 text-xs leading-[1.4] font-medium text-muted">
            {section}
          </p>
          <h1 className="m-0 mt-1 font-display text-[32px] leading-[1.2] font-bold text-text">
            {title}
          </h1>
          {description && (
            <p className="m-0 mt-2 max-w-[60ch] text-base leading-[1.6] text-muted">
              {description}
            </p>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}

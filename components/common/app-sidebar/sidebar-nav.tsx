"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { sidebarNavGroups, type SidebarNavItem } from "./sidebar-nav-items";

type SidebarNavProps = {
  onNavigate?: () => void;
};

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function SidebarNavLink({
  item,
  isActive,
  onNavigate,
}: {
  item: SidebarNavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-(--r-md) px-3 text-sm no-underline transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none",
        isActive
          ? "bg-white/16 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)]"
          : "font-medium text-(--violet-200)",
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badgeCount ? (
        <span
          aria-label={item.badgeLabel}
          className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-(--violet-900)"
        >
          {item.badgeCount}
        </span>
      ) : null}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação" className="relative flex flex-col gap-4.5">
      {sidebarNavGroups.map((group, groupIndex) => (
        <div key={group.label ?? groupIndex} className="flex flex-col gap-1.5">
          {group.label ? (
            <span className="px-3 text-xs leading-[1.4] font-semibold text-(--violet-200)">
              {group.label}
            </span>
          ) : null}
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {group.items.map((item) => (
              <li key={item.href}>
                <SidebarNavLink
                  item={item}
                  isActive={isActivePath(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

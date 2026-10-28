"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarContent } from "./sidebar-content";
import { SidebarLogo } from "./sidebar-logo";
import { SidebarPanel } from "./sidebar-panel";

type SidebarMobileProps = {
  account: React.ReactNode;
};

export function SidebarMobile({ account }: SidebarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SidebarPanel className="flex min-h-16 items-center justify-between gap-3 py-2 pr-2 pl-2 lg:hidden">
        <SidebarLogo />
        <SheetTrigger
          aria-label="Abrir menu"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-white transition-colors duration-150 hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          <Menu aria-hidden="true" className="size-5" />
        </SheetTrigger>
      </SidebarPanel>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        closeLabel="Fechar menu"
        className="w-[min(18rem,calc(100vw-2rem))] p-4"
        closeClassName="top-7 right-7 text-(--violet-200) hover:bg-white/14 hover:text-white focus-visible:outline-white"
      >
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarPanel className="h-full">
          <SidebarContent account={account} onNavigate={closeMenu} />
        </SidebarPanel>
      </SheetContent>
    </Sheet>
  );
}

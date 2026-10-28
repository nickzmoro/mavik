import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { getCurrentUserProfile } from "@/lib/supabase/get-current-user-profile";

import { SidebarAccountMenu } from "./sidebar-account-menu";
import Image from "next/image";

export async function SidebarAccount() {
  const { fullName, email, avatar } = await getCurrentUserProfile();

  return (
    <div className="flex items-center gap-2.5 px-1 pt-1.5 pb-0.5">
      {avatar ? (
        <Avatar size="sm" className="bg-white/16">
          <Image src={avatar} alt={fullName} width={100} height={100} />
        </Avatar>
      ) : (
        <Avatar size="sm" className="bg-white/16">
          <AvatarFallback className="text-(--violet-200)">
            {getInitials(fullName || email)}
          </AvatarFallback>
        </Avatar>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm leading-[1.4] font-semibold">
          {fullName || "Sua conta"}
        </span>
        <span className="truncate text-xs leading-[1.4] text-(--violet-200)">
          {email}
        </span>
      </span>
      <SidebarAccountMenu />
    </div>
  );
}

export function SidebarAccountSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2.5 px-1 pt-1.5 pb-0.5"
    >
      <span className="size-8 shrink-0 animate-pulse rounded-full bg-white/16 motion-reduce:animate-none" />
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="h-3.5 w-24 animate-pulse rounded-full bg-white/16 motion-reduce:animate-none" />
        <span className="h-3 w-36 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
      </span>
    </div>
  );
}

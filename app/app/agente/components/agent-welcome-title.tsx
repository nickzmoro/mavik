import { getCurrentUserProfile } from "@/lib/supabase/get-current-user-profile";

const titleClassName =
  "m-0 font-display text-[22px] leading-[1.25] font-bold sm:text-[28px]";

export async function AgentWelcomeTitle() {
  const { fullName } = await getCurrentUserProfile();
  const firstName = fullName.split(/\s+/)[0];

  return (
    <h2 className={titleClassName}>
      {firstName ? `Olá, ${firstName}.` : "Olá!"} Por onde começamos?
    </h2>
  );
}

export function AgentWelcomeTitleFallback() {
  return <h2 className={titleClassName}>Olá! Por onde começamos?</h2>;
}

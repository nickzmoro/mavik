import { getRequiredEnv } from "@/lib/get-required-env";

export const supabaseUrl = new URL(
  getRequiredEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
).origin;

export const supabasePublishableKey = getRequiredEnv(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

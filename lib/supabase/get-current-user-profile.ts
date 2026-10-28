import "server-only";

import { cache } from "react";

import { getCurrentUserClaims } from "./get-current-user-claims";

export const getCurrentUserProfile = cache(async () => {
  const claims = await getCurrentUserClaims();
  const fullName = claims?.user_metadata?.full_name;
  const email = claims?.email;
  const avatar = claims?.user_metadata?.avatar_url;

  return {
    fullName: typeof fullName === "string" ? fullName.trim() : "",
    email: typeof email === "string" ? email : "",
    avatar: typeof avatar === "string" ? avatar : "",
  };
});

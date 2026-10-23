import { secureCookieOptions } from "./session-cookies";

export const PASSWORD_RECOVERY_COOKIE = "mavik-password-recovery";

export const passwordRecoveryCookieOptions = {
  ...secureCookieOptions,
  maxAge: 15 * 60,
};

"use client";

import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef } from "react";

const CAPTCHA_TIMEOUT_MS = 30_000;

export function useCaptcha() {
  const captchaRef = useRef<TurnstileInstance>(undefined);

  const getCaptchaToken = useCallback(async () => {
    try {
      return (
        (await captchaRef.current?.getResponsePromise(CAPTCHA_TIMEOUT_MS)) ?? ""
      );
    } catch {
      return "";
    }
  }, []);

  const resetCaptcha = useCallback(() => {
    captchaRef.current?.reset();
  }, []);

  return { captchaRef, getCaptchaToken, resetCaptcha };
}

"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

type CaptchaWidgetProps = {
  ref: React.Ref<TurnstileInstance | undefined>;
};

export function CaptchaWidget({ ref }: CaptchaWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      className="empty:hidden"
      options={{
        theme: "light",
        size: "flexible",
        appearance: "interaction-only",
        language: "pt-br",
      }}
    />
  );
}

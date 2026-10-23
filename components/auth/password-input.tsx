"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { IconInput } from "./icon-input";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof IconInput>,
  "icon" | "trailing" | "type"
>;

export function PasswordInput(props: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const ToggleIcon = isPasswordVisible ? EyeOff : Eye;

  return (
    <IconInput
      icon={Lock}
      type={isPasswordVisible ? "text" : "password"}
      trailing={
        <button
          type="button"
          aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
          className="absolute top-1/2 right-1 z-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ToggleIcon size={18} aria-hidden="true" />
        </button>
      }
      {...props}
    />
  );
}

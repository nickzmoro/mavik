"use client";

import { Check, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

const toastDurationInMs = 3500;

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastState = {
  id: number;
  message: string;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setToast(null),
      toastDurationInMs,
    );

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message: string) => setToast({ id: Date.now(), message });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-60 flex justify-center px-4"
      >
        {toast ? (
          <div
            key={toast.id}
            className="toast-surface pointer-events-auto box-border flex max-w-full items-center gap-2.5 rounded-full py-2 pr-2 pl-4 font-sans text-sm leading-[1.4] font-medium"
          >
            <Check aria-hidden="true" className="size-4 shrink-0" />
            <span>{toast.message}</span>
            <button
              type="button"
              aria-label="Dispensar aviso"
              onClick={() => setToast(null)}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

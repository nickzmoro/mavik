"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { LOADER_MESSAGE_INTERVAL_MS, loaderMessages } from "./loader-messages";

const orbitingDots = [
  { id: "large", sizeClassName: "size-2.5", duration: 2.4, opacity: 1 },
  { id: "medium", sizeClassName: "size-2", duration: 3.6, opacity: 0.7 },
  { id: "small", sizeClassName: "size-1.5", duration: 5, opacity: 0.45 },
];

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
} as const;

const breatheTransition = {
  duration: 2.4,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

type ZaionLoaderProps = {
  className?: string;
};

export function ZaionLoader({ className }: ZaionLoaderProps) {
  const shouldAnimate = !useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setMessageIndex((index) => (index + 1) % loaderMessages.length),
      LOADER_MESSAGE_INTERVAL_MS,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-7", className)}
    >
      <div
        aria-hidden="true"
        className="relative flex size-32 items-center justify-center"
      >
        <motion.span
          animate={
            shouldAnimate
              ? { scale: [0.8, 1.15, 0.8], opacity: [0.3, 0.6, 0.3] }
              : undefined
          }
          transition={breatheTransition}
          className="absolute inset-3 rounded-full bg-accent/40 blur-2xl"
        />

        <motion.svg
          viewBox="0 0 128 128"
          animate={shouldAnimate ? { rotate: 360 } : undefined}
          transition={{ ...spinTransition, duration: 1.6 }}
          className="absolute inset-0 size-full"
        >
          <defs>
            <linearGradient id="zaion-loader-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary-brand)" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#zaion-loader-ring)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="240 130"
          />
        </motion.svg>

        {orbitingDots.map(({ id, sizeClassName, duration, opacity }) => (
          <motion.span
            key={id}
            animate={shouldAnimate ? { rotate: -360 } : undefined}
            transition={{ ...spinTransition, duration }}
            className="absolute inset-4 flex justify-center"
          >
            <span
              style={{ opacity }}
              className={cn("rounded-full bg-accent", sizeClassName)}
            />
          </motion.span>
        ))}

        <motion.span
          animate={shouldAnimate ? { scale: [1, 1.08, 1] } : undefined}
          transition={breatheTransition}
          className="relative flex size-14 items-center justify-center"
        >
          <Image
            src="/zaion-logo-favicon-bgremove.webp"
            alt=""
            width={80}
            height={80}
            className="size-14 rounded-full"
          />
        </motion.span>
      </div>

      <div className="flex h-7 items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: 0.25 }}
            className="m-0 font-display text-base font-medium text-text"
          >
            {loaderMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

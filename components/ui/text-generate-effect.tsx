"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.4,
  as: Component = "h2",
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.25 });
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration || 0.4,
          delay: stagger(0.06),
        },
      );
    }
  }, [isInView, animate, duration, filter]);

  return (
    <Component ref={scope} className={cn("leading-tight", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0 inline-block"
          style={{
            filter: filter ? "blur(8px)" : "none",
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </Component>
  );
};

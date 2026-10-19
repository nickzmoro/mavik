"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  variant = "brand",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    variant?: "brand" | "light" | "default";
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, #B390FA 0%, rgba(179, 144, 250, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, #B390FA 0%, rgba(179, 144, 250, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, #B390FA 0%, rgba(179, 144, 250, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.19% at 100% 50%, #B390FA 0%, rgba(179, 144, 250, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #B390FA 0%, rgba(179, 144, 250, 0) 100%)";

  useEffect(() => {
    const rotateDirection = (currentDirection: Direction): Direction => {
      const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const index = directions.indexOf(currentDirection);
      const nextIndex = clockwise
        ? (index - 1 + directions.length) % directions.length
        : (index + 1) % directions.length;
      return directions[nextIndex];
    };

    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  const innerBg =
    variant === "light" ? "bg-white text-[#1B1530]" : "bg-[#1A0F3C] text-white";

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-[#5926C8]/40 content-center items-center flex-col flex-nowrap justify-center overflow-visible p-px box-decoration-clone w-fit cursor-pointer transition-all duration-300",
        containerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto z-10 px-5 py-2 rounded-[inherit] font-display text-xs font-semibold flex items-center justify-center gap-2",
          innerBg,
          className,
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]",
        )}
        style={{
          filter: "blur(3px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div
        className={cn(
          "absolute z-1 flex-none inset-px rounded-[100px]",
          innerBg,
        )}
      />
    </Tag>
  );
}

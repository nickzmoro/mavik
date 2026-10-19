"use client";

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  company: string;
  color: string;
  initials: string;
  hover?: boolean;
}

export const AnimatedTooltip = ({ items }: { items: TooltipItem[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  // Rotate the tooltip based on mouse x coordinate
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // Translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center -space-x-2.5">
        {items.map((item) => (
          <div
            className="group relative -mr-2"
            key={item.id}
            onMouseEnter={() => setHoveredIndex(item.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence mode="popLayout">
              {hoveredIndex === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 10,
                    },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{
                    translateX: translateX,
                    rotate: rotate,
                    whiteSpace: "nowrap",
                  }}
                  className={`absolute -top-16 -left-30 translate-x-1/2 z-50 flex flex-col items-center justify-center rounded-xl bg-[#1A0F3C]/95 backdrop-blur-xl px-3 py-1.5 text-xs shadow-2xl border border-[#3A2A72] ${item.hover ? "" : "hidden"}`}
                >
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-linear-to-r from-transparent via-[#B390FA] to-transparent" />
                  <div className="absolute left-10 -bottom-px z-30 h-px w-[40%] bg-linear-to-r from-transparent via-[#7440E0] to-transparent" />
                  <div className="font-bold text-[#F4F0FF] relative z-30 text-xs font-display">
                    {item.name}
                  </div>
                  <div className="text-[#B9B0D6] text-[10px]">
                    {item.designation} ·{" "}
                    <strong className="text-[#B390FA]">{item.company}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              onMouseMove={handleMouseMove}
              className={`relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#12092B] text-white font-bold text-xs select-none shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:z-30 cursor-pointer ${item.color}`}
            >
              {item.initials}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

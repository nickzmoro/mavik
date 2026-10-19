"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.9], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    },
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full max-w-6xl mx-auto h-full", className)}
    >
      <div className="absolute -left-4 md:-left-12 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          className="ml-6.75 h-4 w-4 rounded-full border border-[#5926C8] shadow-sm flex items-center justify-center bg-white"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            className="h-2 w-2 rounded-full border border-[#B390FA] bg-[#5926C8]"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.95} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#E2DDF0"
            strokeOpacity="0.8"
            strokeWidth="2"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.95} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient-tracing)"
            strokeWidth="2.5"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id="gradient-tracing"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#5926C8" stopOpacity="0"></stop>
              <stop stopColor="#5926C8"></stop>
              <stop offset="0.325" stopColor="#B390FA"></stop>
              <stop offset="1" stopColor="#B390FA" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef} className="pt-2">
        {children}
      </div>
    </motion.div>
  );
};

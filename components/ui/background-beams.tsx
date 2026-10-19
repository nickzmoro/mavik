"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden mask-[radial-gradient(ellipse_at_center,white,transparent_80%)]",
        className,
      )}
    >
      {/* SVG Light Paths */}
      <svg
        className="absolute left-0 top-0 h-full w-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <path
          d="M-200 100 C 300 200, 600 -100, 1600 300"
          stroke="url(#beam-gradient-1)"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          className="animate-[dash_30s_linear_infinite]"
        />
        <path
          d="M-100 400 C 400 300, 800 600, 1500 200"
          stroke="url(#beam-gradient-2)"
          strokeWidth="1"
        />
        <path
          d="M100 800 C 500 500, 900 700, 1600 400"
          stroke="url(#beam-gradient-1)"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <defs>
          <linearGradient
            id="beam-gradient-1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5926C8" stopOpacity="0" />
            <stop offset="50%" stopColor="#B390FA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#5926C8" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="beam-gradient-2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1A0F3C" stopOpacity="0" />
            <stop offset="50%" stopColor="#4FD1AE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B390FA" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Radial soft glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-linear-to-tr from-[#5926C8]/20 via-[#B390FA]/15 to-transparent blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};

"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    className,
    background,
    minSize = 0.6,
    maxSize = 2,
    particleColor = "#B390FA",
    particleDensity = 40,
  } = props;

  // Gerar partículas com cálculo determinístico evitando setState em useEffect
  const particles = useMemo(() => {
    return Array.from({ length: particleDensity }, (_, i) => {
      // Usar pseudo-aleatoriedade com semente fixa para evitar disparidade SSR/CSR
      const seedX = ((i * 37 + 13) % 100);
      const seedY = ((i * 49 + 29) % 100);
      const size = minSize + (((i * 17) % 10) / 10) * (maxSize - minSize);
      const duration = 2.5 + ((i % 5) * 0.5);
      const delay = (i % 4) * 0.4;
      return {
        x: seedX,
        y: seedY,
        size,
        duration,
        delay,
      };
    });
  }, [maxSize, minSize, particleDensity]);

  return (
    <div
      className={cn("w-full h-full absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={{ background: background || "transparent" }}
    >
      {particles.map((p, idx) => (
        <motion.span
          key={idx}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
            boxShadow: `0 0 6px ${particleColor}`,
          }}
          animate={{
            opacity: [0.15, 0.85, 0.15],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

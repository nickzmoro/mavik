"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CompareProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  firstLabel?: string;
  secondLabel?: string;
  className?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
}

export const Compare: React.FC<CompareProps> = ({
  firstContent,
  secondContent,
  firstLabel = "Antes",
  secondLabel = "Agora",
  className,
  initialSliderPercentage = 50,
  slideMode = "drag",
  showHandlebar = true,
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging && slideMode === "drag") return;
      handleMove(e.touches[0].clientX);
    },
    [handleMove, isDragging, slideMode]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (slideMode === "hover" || isDragging) {
        handleMove(e.clientX);
      }
    },
    [handleMove, isDragging, slideMode]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging || slideMode === "hover") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, isDragging, slideMode]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden select-none cursor-ew-resize rounded-2xl shadow-xl touch-pan-y",
        className
      )}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Second Content (Agora - Direita / Base) */}
      <div className="w-full h-full relative z-0">
        {secondContent}
        {secondLabel && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none transition-opacity duration-200">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0E8A6B] text-white shadow-md border border-white/20">
              {secondLabel}
            </span>
          </div>
        )}
      </div>

      {/* First Content (Antes - Esquerda / Clipped) */}
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        {firstContent}
        {firstLabel && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none transition-opacity duration-200">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C7343A] text-white shadow-md border border-white/20">
              {firstLabel}
            </span>
          </div>
        )}
      </div>

      {/* Slider Bar & Handle */}
      {showHandlebar && (
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(89,38,200,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#5926C8] text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-[#5926C8]/25">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l-3 3m0 0l3 3m-3-3h14m-3-6l3 3m0 0l-3 3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

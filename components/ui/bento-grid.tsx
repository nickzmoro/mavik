"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-72 grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  featured = false,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  featured?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-xl transition-all duration-200 shadow-sm p-6 justify-between flex flex-col space-y-4 relative overflow-hidden",
        featured
          ? "bg-[#1A0F3C] text-white border-2 border-[#B390FA]/60 md:col-span-2 md:row-span-2 shadow-2xl shadow-[#5926C8]/20"
          : "bg-white text-[#1B1530] border border-[#E2DDF0] hover:border-[#B390FA]",
        className,
      )}
    >
      {/* Background glow on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B390FA]/10 rounded-full blur-2xl group-hover/bento:scale-150 transition-transform duration-500 pointer-events-none" />

      {header && (
        <div className="w-full flex-1 min-h-24 relative z-10">{header}</div>
      )}

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center justify-between mb-2">
          {icon && (
            <div
              className={cn(
                "p-2.5 rounded-xl w-fit",
                featured
                  ? "bg-[#2A1366] text-[#B390FA]"
                  : "bg-[#EFE8FD] text-[#5926C8]",
              )}
            >
              {icon}
            </div>
          )}
          {badge && (
            <span
              className={cn(
                "text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                featured
                  ? "bg-[#2A1366] text-[#B390FA] border border-[#B390FA]/30"
                  : "bg-[#EFE8FD] text-[#5926C8]",
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-display font-semibold tracking-[5px] text-lg mb-2",
            featured ? "text-white text-xl lg:text-2xl" : "text-[#1B1530]",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "font-sans text-sm leading-relaxed",
            featured ? "text-[#B9B0D6] text-base" : "text-[#5E5877]",
          )}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

"use client";

import { useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TruncatedTextProps = {
  children: string;
  className?: string;
};

export function TruncatedText({ children, className }: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    const textElement = textRef.current;
    const isTruncated =
      !!textElement && textElement.scrollWidth > textElement.clientWidth;

    setIsTooltipOpen(isOpen && isTruncated);
  };

  return (
    <Tooltip open={isTooltipOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <span ref={textRef} className={cn("block truncate", className)}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

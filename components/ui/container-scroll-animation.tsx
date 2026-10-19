"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.95, 1] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.45], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.45], [0, -40]);

  return (
    <div
      className="h-240 md:h-288 flex items-center justify-center relative p-2 md:p-10"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: isMobile ? "none" : "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card
          rotate={isMobile ? 0 : rotate}
          translate={translate}
          scale={scale}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number> | number;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl mt-4 sm:mt-10 mx-auto h-115 sm:h-128 md:h-160 w-full border-2 sm:border-4 border-[#3A2A72] p-1.5 sm:p-4 md:p-6 bg-[#160B33] rounded-3xl sm:rounded-[30px] shadow-2xl relative"
    >
      <div className="bg-[#1A0F3C] h-full w-full rounded-xl sm:rounded-2xl overflow-hidden p-1 sm:p-2 md:p-4 border border-[#3A2A72]/60">
        {children}
      </div>
    </motion.div>
  );
};

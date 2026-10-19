"use client";

import React, { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    tag?: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLength = content.length;

  // Rastreia o scroll da página enquanto o container pai (h-[300vh]) atravessa a viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Mapeia suavemente de 0 a 1 em 4 passos (0, 1, 2, 3)
    const step = Math.min(
      cardLength - 1,
      Math.max(0, Math.floor(latest * cardLength)),
    );
    setActiveCard(step);
  });

  return (
    <div ref={containerRef} className="relative w-full h-[280vh]">
      {/* Contêiner Sticky fixo na viewport inteira e perfeitamente centralizado */}
      <div className="sticky top-0 max-sm:h-[110vh] h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-16 sm:pt-20 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mx-auto">
          {/* Header da Seção Centralizado e Compacto */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20 mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5926C8] animate-pulse" />
              Regra {activeCard + 1} de {cardLength} · Scroll contínuo
            </span>
            <TextGenerateEffect
              words="Quatro regras que a IA não pode quebrar."
              className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#1B1530] tracking-[-2px]"
            />
          </div>

          {/* Desktop Pinned Layout (2 Colunas Centralizadas) */}
          <div className="hidden md:grid md:grid-cols-12 gap-8 items-center">
            {/* Coluna da Esquerda: 4 regras com indicador ativo e altura balanceada */}
            <div className="md:col-span-6 space-y-3">
              {content.map((item, index) => {
                const isActive = activeCard === index;
                return (
                  <motion.div
                    key={item.title + index}
                    onClick={() => setActiveCard(index)}
                    animate={{
                      opacity: isActive ? 1 : 0.4,
                      scale: isActive ? 1.01 : 0.99,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-4 rounded-xl cursor-pointer transition-all border relative",
                      isActive
                        ? "bg-[#F8F6FE] border-[#5926C8] shadow-md shadow-[#5926C8]/5"
                        : "bg-white/60 border-[#E2DDF0]/60 hover:opacity-75 hover:bg-white",
                    )}
                  >
                    {/* Barra de destaque lateral na regra ativa */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator-bar"
                        className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-[#5926C8] rounded-r-full"
                      />
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                          isActive
                            ? "bg-[#5926C8] text-white"
                            : "bg-[#EFE8FD] text-[#5926C8]",
                        )}
                      >
                        {item.tag || `Regra #0${index + 1}`}
                      </span>

                      {isActive && (
                        <span className="text-[10px] text-[#5926C8] font-bold">
                          Ativa
                        </span>
                      )}
                    </div>

                    <h3 className="text-base lg:text-lg font-display font-bold text-[#1B1530]">
                      {item.title}
                    </h3>

                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-[#5E5877] mt-1.5 leading-relaxed font-sans"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Coluna da Direita: Card Visual com Morphing Centralizado */}
            <div className="md:col-span-6 flex justify-center items-center">
              <div
                className={cn(
                  "w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl relative",
                  contentClassName,
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {content[activeCard]?.content ?? null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Indicador de Bolinhas Inferior */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-6">
            {content.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeCard === idx ? "w-8 bg-[#5926C8]" : "w-2 bg-[#E2DDF0]",
                )}
              />
            ))}
          </div>

          {/* Mobile Fallback: Navegação Rápida com Botões */}
          <div className="md:hidden flex flex-col gap-4 mt-2">
            <div className="p-4 rounded-xl bg-[#F8F6FE] border border-[#5926C8]">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5926C8] text-white">
                {content[activeCard]?.tag}
              </span>
              <h3 className="text-base font-bold text-[#1B1530] mt-1.5">
                {content[activeCard]?.title}
              </h3>
              <p className="text-xs text-[#5E5877] mt-1">
                {content[activeCard]?.description}
              </p>
            </div>
            <div className="w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-[#3A2A72]/50 bg-[#1A0F3C]">
              {content[activeCard]?.content}
            </div>
            <div className="flex justify-between items-center px-1">
              <button
                disabled={activeCard === 0}
                onClick={() => setActiveCard((prev) => Math.max(0, prev - 1))}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] disabled:opacity-30"
              >
                ← Anterior
              </button>
              <span className="text-xs text-[#5E5877] font-medium">
                {activeCard + 1} de {cardLength}
              </span>
              <button
                disabled={activeCard === cardLength - 1}
                onClick={() =>
                  setActiveCard((prev) => Math.min(cardLength - 1, prev + 1))
                }
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#5926C8] text-white disabled:opacity-30"
              >
                Próxima →
              </button>
            </div>
          </div>

          {/* CTA Chamativo das 4 Regras */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link href="#experimentar" className="group">
              <HoverBorderGradient
                variant="brand"
                className="bg-white text-[#5926C8] hover:bg-[#f4f0ff] border border-[#5926C8]/25 transition-colors py-3 px-7 text-sm font-bold shadow-lg shadow-[#5926C8]/25"
              >
                <span>Criar posts com regras blindadas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </HoverBorderGradient>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

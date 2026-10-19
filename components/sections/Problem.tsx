"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Compare } from "@/components/ui/compare";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

export function Problem() {
  return (
    <section
      id="problema"
      data-theme="light"
      className="relative w-full bg-white text-[#1B1530] overflow-hidden pt-20 pb-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tag de destaque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-5"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5926C8]" />
            Fidelidade visual absoluta
          </span>
        </motion.div>

        {/* Título com Text Generate Effect */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl tracking-[-2px] sm:text-4xl lg:text-5xl font-display font-bold text-[#1B1530] leading-tight">
            <TextGenerateEffect words="Sua logo nunca mais vai sair torta." />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base sm:text-lg text-[#5E5877] max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Outras ferramentas redesenham a sua marca a cada arte: a logo
            engrossa, muda de cor, vira outra. Aqui, ela entra direto do arquivo
            original, do jeito que você criou.
          </motion.p>
        </div>

        {/* Componente Compare (Slider Antes vs Agora) */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-4xl mx-auto"
        >
          <Compare
            className="w-full h-117.5 sm:h-120 rounded-2xl border border-[#E2DDF0] shadow-2xl"
            slideMode="drag"
            initialSliderPercentage={50}
            firstLabel="Antes"
            secondLabel="Agora"
            /* Lado Esquerdo (Antes - Distorcido e Genérico) */
            firstContent={
              <div className="w-full h-full bg-[#FAFAFA] flex flex-col justify-between p-4 sm:p-8 pt-14 sm:pt-6 relative font-sans border-r-2 border-red-400">
                {/* Header do Post Ruim */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    {/* Logo distorcida / esticada propositalmente */}
                    <div className="w-20 sm:w-24 h-6 sm:h-7 bg-red-100 rounded border border-red-300 flex items-center justify-center scale-x-125 rotate-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-red-700 tracking-widest uppercase italic font-mono">
                        M A V I K ?
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> Logo
                      esticada
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 hidden xs:inline sm:inline">
                    @marca_aleatoria
                  </span>
                </div>

                {/* Conteúdo Genérico do Post Ruim */}
                <div className="my-auto py-3 sm:py-6 space-y-3">
                  <div className="inline-block bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs px-2.5 py-0.5 rounded font-medium">
                    Texto genérico sem contexto
                  </div>
                  <h3 className="text-base sm:text-2xl font-serif text-gray-700 leading-snug line-clamp-3 sm:line-clamp-none">
                    Alavanque sua sinergia corporativa hoje mesmo com soluções
                    inovadoras
                  </h3>
                  <div className="h-18 sm:h-28 rounded-lg bg-gray-200/80 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-[10px] sm:text-xs italic text-center px-2">
                    [Espaço vazio e ilustração desconexa da marca]
                  </div>
                </div>

                {/* Footer do Post Ruim */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-[10px] sm:text-xs text-gray-500">
                  <span className="line-through text-red-500">
                    CTA que ninguém clica
                  </span>
                  <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium">
                    Arte genérica de banco
                  </span>
                </div>
              </div>
            }
            /* Lado Direito (Agora - Mavik: Impecável, Logo Oficial, Design System) */
            secondContent={
              <div className="w-full h-full bg-linear-to-br from-[#1A0F3C] via-[#2A1366] to-[#160B33] text-white flex flex-col justify-between p-4 sm:p-8 pt-14 sm:pt-6 relative font-sans">
                {/* Header do Post Impecável */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#3A2A72]/60">
                  <div className="flex items-center gap-2">
                    {/* Logo Oficial Intocável */}
                    <div className="px-2.5 py-1 rounded-lg bg-[#12092B]/80 border border-[#B390FA]/40 shadow-xs">
                      <Image
                        src="/mavik-logo-dark.webp"
                        alt="Logo Mavik Oficial"
                        width={75}
                        height={20}
                        className="h-4 sm:h-5 w-auto object-contain"
                        priority
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-[#4FD1AE] bg-[#103B33] px-2 py-0.5 rounded-full border border-[#4FD1AE]/30 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 shrink-0" /> Vetor 100%
                      Original
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#B390FA] font-medium bg-[#5926C8]/30 px-2 py-0.5 rounded-full border border-[#5926C8]/40 hidden xs:inline sm:inline">
                    Sua Paleta Oficial
                  </span>
                </div>

                {/* Conteúdo Estratégico Mavik */}
                <div className="my-auto py-3 sm:py-4 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#B390FA]/20 text-[#B390FA] border border-[#B390FA]/30">
                    <Wand2 className="w-3 h-3 text-[#B390FA]" />
                    Estratégia de Conteúdo #04
                  </div>
                  <h3 className="text-base sm:text-2xl font-display font-bold text-white leading-snug">
                    Como transformar seguidores em clientes fiéis em 3 etapas
                    simples
                  </h3>
                  <p className="text-[11px] sm:text-sm text-[#B9B0D6] leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                    Construído com a tipografia Sora da sua marca, espaçamentos
                    milimétricos e contraste visual acessível.
                  </p>
                </div>

                {/* Footer do Post Impecável */}
                <div className="flex items-center justify-between pt-3 border-t border-[#3A2A72]/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4FD1AE]"></span>
                    <span className="text-[11px] sm:text-xs text-[#B9B0D6]">
                      Pronto para publicação
                    </span>
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#5926C8] hover:bg-[#3B1A8C] text-white text-[11px] sm:text-xs font-semibold transition-colors shadow-sm">
                    Salvar Carrossel
                  </button>
                </div>
              </div>
            }
          />
          {/* Dica visual de arrastar no mobile */}
          <div className="flex sm:hidden items-center justify-center gap-2 mt-3 text-xs text-[#5E5877] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5926C8] animate-pulse"></span>
            <span>Arraste para comparar o Antes e Agora</span>
          </div>
        </motion.div>

        {/* 3 Frases curtas em linha abaixo do Compare */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            "Sem Photoshop para consertar.",
            "Sem espaço vazio na arte.",
            "Sem texto solto, sem sentido.",
          ].map((phrase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: 0.1 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] shadow-xs hover:border-[#B390FA]/50 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-[#5926C8] shrink-0" />
              <span className="text-sm font-semibold text-[#1B1530]">
                {phrase}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Chamativo da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
        >
          <Link href="#experimentar" className="group">
            <HoverBorderGradient
              variant="brand"
              className="bg-white text-[#5926C8] hover:bg-[#f4f0ff] border border-[#5926C8]/25 transition-colors py-3 px-7 text-sm font-bold shadow-lg shadow-[#5926C8]/25"
            >
              <span>Testar grátis com sua logo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

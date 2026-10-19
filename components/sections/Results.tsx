"use client";

import React, { useEffect, useRef } from "react";
import {
  TrendingUp,
  Bookmark,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Info,
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

// Componente Contador com Motion
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    return springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(value % 1 !== 0 ? 1 : 0)}${suffix}`;
      }
    });
  }, [springVal, prefix, suffix, value]);

  return (
    <span ref={ref} className="font-display">
      {prefix}0{suffix}
    </span>
  );
}

export function Results() {
  return (
    <section
      id="metricas"
      data-theme="dark"
      className="relative w-full bg-[#1A0F3C] text-white py-24 overflow-hidden"
    >
      {/* Grid de fundo sutil */}
      <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2A1366] text-[#B390FA] border border-[#B390FA]/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B390FA]" />
              Métricas transparentes
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-[#103B33] text-[#4FD1AE] border border-[#4FD1AE]/30">
              <Info className="w-3 h-3" /> Exemplo ilustrativo
            </span>
          </div>

          <TextGenerateEffect
            words="Marketing que você consegue provar."
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-[-2px] leading-tight"
          />
          <p className="mt-4 text-base sm:text-lg text-[#B9B0D6] max-w-2xl mx-auto leading-relaxed font-sans">
            Compare o antes e o depois com os números do seu Instagram, sem
            planilha.
          </p>
        </motion.div>

        {/* 4 Indicadores com CardSpotlight e Contador Animado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Indicador 1: Alcance */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <CardSpotlight
              className="p-6 rounded-2xl bg-[#12092B] border border-[#3A2A72] flex flex-col justify-between h-full"
              color="#5926C8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#2A1366] text-[#B390FA]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#4FD1AE] flex items-center gap-0.5 bg-[#103B33] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +240%
                </span>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={240} prefix="+" suffix="%" />
                </div>
                <p className="text-xs text-[#B9B0D6] font-medium">
                  Alcance orgânico estimado
                </p>
                <span className="text-[10px] text-white/40 block mt-2">
                  Exemplo ilustrativo
                </span>
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Indicador 2: Salvamentos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <CardSpotlight
              className="p-6 rounded-2xl bg-[#12092B] border border-[#3A2A72] flex flex-col justify-between h-full"
              color="#5926C8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#2A1366] text-[#B390FA]">
                  <Bookmark className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#4FD1AE] flex items-center gap-0.5 bg-[#103B33] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" /> 4.8x
                </span>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={4.8} suffix="x" />
                </div>
                <p className="text-xs text-[#B9B0D6] font-medium">
                  Mais salvamentos de post
                </p>
                <span className="text-[10px] text-white/40 block mt-2">
                  Exemplo ilustrativo
                </span>
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Indicador 3: Horas Economizadas */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <CardSpotlight
              className="p-6 rounded-2xl bg-[#12092B] border border-[#3A2A72] flex flex-col justify-between h-full"
              color="#5926C8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#2A1366] text-[#B390FA]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#B390FA] bg-[#2A1366] px-2 py-0.5 rounded-full">
                  Semanal
                </span>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={18} suffix="h" />
                </div>
                <p className="text-xs text-[#B9B0D6] font-medium">
                  Economizadas por semana
                </p>
                <span className="text-[10px] text-white/40 block mt-2">
                  Exemplo ilustrativo
                </span>
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Indicador 4: Consistência Visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <CardSpotlight
              className="p-6 rounded-2xl bg-[#12092B] border border-[#3A2A72] flex flex-col justify-between h-full"
              color="#5926C8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-[#2A1366] text-[#B390FA]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#4FD1AE] bg-[#103B33] px-2 py-0.5 rounded-full">
                  Marca 100%
                </span>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={99.4} suffix="%" />
                </div>
                <p className="text-xs text-[#B9B0D6] font-medium">
                  Consistência de Brand Kit
                </p>
                <span className="text-[10px] text-white/40 block mt-2">
                  Exemplo ilustrativo
                </span>
              </div>
            </CardSpotlight>
          </motion.div>
        </div>

        {/* Dashboard Ilustrativo com Gráfico de Linha */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-3xl bg-[#12092B] border border-[#3A2A72] shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3A2A72]/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#B390FA] uppercase tracking-wider">
                  Visão Geral de Engajamento
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#103B33] text-[#4FD1AE] font-medium border border-[#4FD1AE]/30">
                  Exemplo ilustrativo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                Evolução Comparativa (Antes vs. Depois da Mavik)
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#5E5877]" />
                <span className="text-[#B9B0D6]">Antes (Processo manual)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#B390FA]" />
                <span className="text-white font-semibold">Com a Mavik</span>
              </div>
            </div>
          </div>

          {/* Gráfico de Linha em SVG Responsivo */}
          <div className="py-6 sm:py-8">
            <svg
              className="w-full h-48 sm:h-64 overflow-visible"
              viewBox="0 0 800 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="mavikFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B390FA" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#5926C8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="mavikStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5926C8" />
                  <stop offset="50%" stopColor="#B390FA" />
                  <stop offset="100%" stopColor="#4FD1AE" />
                </linearGradient>
              </defs>

              {/* Linhas de Grade Horizontal */}
              <line
                x1="0"
                y1="40"
                x2="800"
                y2="40"
                stroke="#3A2A72"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
              <line
                x1="0"
                y1="100"
                x2="800"
                y2="100"
                stroke="#3A2A72"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
              <line
                x1="0"
                y1="160"
                x2="800"
                y2="160"
                stroke="#3A2A72"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
              <line
                x1="0"
                y1="220"
                x2="800"
                y2="220"
                stroke="#3A2A72"
                strokeOpacity="0.6"
              />

              {/* Curva Antes (Manual - Estagnada) */}
              <path
                d="M 0 190 Q 200 180, 400 185 T 800 175"
                fill="none"
                stroke="#5E5877"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Área Sombreada Mavik */}
              <path
                d="M 0 200 Q 200 160, 400 110 T 800 40 L 800 220 L 0 220 Z"
                fill="url(#mavikFill)"
              />

              {/* Curva Mavik (Crescimento Acentuado) */}
              <path
                d="M 0 200 Q 200 160, 400 110 T 800 40"
                fill="none"
                stroke="url(#mavikStroke)"
                strokeWidth="4"
              />

              {/* Ponto de Destaque Final */}
              <circle
                cx="800"
                cy="40"
                r="6"
                fill="#4FD1AE"
                stroke="#12092B"
                strokeWidth="2"
              />
            </svg>

            {/* Eixo X com Semanas */}
            <div className="flex justify-between text-xs text-[#B9B0D6] pt-3 px-1">
              <span>Semana 1</span>
              <span>Semana 2</span>
              <span>Semana 3</span>
              <span>Semana 4 (Consistência Diária)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#3A2A72]/60 text-xs text-[#B9B0D6]">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4FD1AE]" />
              Conexão oficial com a API do Instagram Graph para leitura de
              métricas.
            </p>
            <span className="text-[11px] text-white/50">
              * Rótulo de conformidade: Todos os dados apresentados são exemplos
              ilustrativos.
            </span>
          </div>
        </motion.div>

        {/* CTA Chamativo da Seção Resultados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center relative z-20"
        >
          <Link href="#experimentar" className="group">
            <HoverBorderGradient
              variant="brand"
              className="bg-[#1A0F3C] text-white hover:bg-[#2A1366] transition-colors py-3 px-8 text-sm font-bold shadow-xl shadow-[#5926C8]/40"
            >
              <span>Começar a gerar conteúdo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

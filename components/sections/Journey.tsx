"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Building2,
  Palette,
  CalendarCheck2,
  CheckCircle2,
  BarChart,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

export function Journey() {
  const steps = [
    {
      badge: "Passo 01 · 1 minuto",
      title: "Conte sobre a empresa (1 minuto)",
      description:
        "Descreva seu segmento, público-alvo e tom de voz preferido. A IA calibra o contexto completo do seu negócio sem questionários burocráticos.",
      mockup: (
        <div className="w-full p-3.5 sm:p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] space-y-3 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[#E2DDF0]">
            <span className="font-semibold text-[#1B1530] flex items-center gap-1.5 text-xs sm:text-sm">
              <Building2 className="w-4 h-4 text-[#5926C8] shrink-0" />{" "}
              Onboarding Rápido
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#0E8A6B] bg-[#EFE8FD] px-2 py-0.5 rounded font-medium">
              3 perguntas simples
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] sm:text-[11px] text-[#5E5877] block mb-1">
                Qual é a sua proposta de valor?
              </label>
              <div className="p-2 rounded-lg bg-white border border-[#E2DDF0] text-[#1B1530] font-medium text-[11px] sm:text-xs">
                &ldquo;Consultoria de marketing e aceleração para e-commerces de
                moda sustentável.&rdquo;
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#EFE8FD] text-[#5926C8] font-semibold text-[10px] sm:text-[11px]">
                Tom: Sofisticado & Direto
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white text-[#5E5877] border border-[#E2DDF0] text-[10px] sm:text-[11px]">
                Público: B2C / D2C
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Passo 02 · 2 minutos",
      title: "Monte o seu Brand Kit",
      description:
        "Suba sua logo oficial em alta resolução, defina suas cores primárias e secundárias e suas fontes. Uma única vez, para sempre.",
      mockup: (
        <div className="w-full p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2DDF0] space-y-3 font-sans text-xs shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[#E2DDF0]">
            <span className="font-semibold text-[#1B1530] flex items-center gap-1.5 text-xs sm:text-sm">
              <Palette className="w-4 h-4 text-[#5926C8] shrink-0" /> Identidade
              Visual Salva
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#0E8A6B] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Arquivo Original
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#1A0F3C] border border-[#3A2A72] shrink-0">
              <Image
                src="/zaion-logo-dark.webp"
                alt="Brand Kit Logo"
                width={56}
                height={16}
                className="h-3.5 sm:h-4 w-auto"
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#5926C8] border-2 border-white shadow-xs"
                title="#5926C8"
              />
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B390FA] border-2 border-white shadow-xs"
                title="#B390FA"
              />
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1A0F3C] border-2 border-white shadow-xs"
                title="#1A0F3C"
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#5E5877] font-medium sm:ml-auto">
              Fontes: Sora + Inter
            </span>
          </div>
        </div>
      ),
    },
    {
      badge: "Passo 03 · Instantâneo",
      title: "Receba o plano de 30 dias",
      description:
        "A IA estrutura uma grade completa de publicações dividida por pilares: autoridade, conversão, engajamento e relacionamento.",
      mockup: (
        <div className="w-full p-3.5 sm:p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] space-y-2 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="font-semibold text-[#1B1530] flex items-center gap-1.5 text-xs sm:text-sm">
              <CalendarCheck2 className="w-4 h-4 text-[#5926C8] shrink-0" />{" "}
              Calendário Estratégico
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5926C8] font-bold">
              30 dias gerados
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-white border border-[#E2DDF0] text-center sm:text-left min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#5926C8] font-bold block truncate">
                Pilar 1
              </span>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#1B1530] truncate">
                Autoridade
              </p>
              <span className="text-[8px] sm:text-[9px] text-[#5E5877] block truncate">
                8 posts
              </span>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-white border border-[#E2DDF0] text-center sm:text-left min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#0E8A6B] font-bold block truncate">
                Pilar 2
              </span>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#1B1530] truncate">
                Conversão
              </p>
              <span className="text-[8px] sm:text-[9px] text-[#5E5877] block truncate">
                10 posts
              </span>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-white border border-[#E2DDF0] text-center sm:text-left min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#9A6BF4] font-bold block truncate">
                Pilar 3
              </span>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#1B1530] truncate">
                Engajamento
              </p>
              <span className="text-[8px] sm:text-[9px] text-[#5E5877] block truncate">
                12 posts
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Passo 04 · Sob seu controle",
      title: "Gere, ajuste e aprove",
      description:
        "Visualize as artes criadas no estúdio de camadas reais. Quer trocar um termo ou uma cor? Peça por texto ou edite você mesmo em segundos.",
      mockup: (
        <div className="w-full p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2DDF0] space-y-3 font-sans text-xs shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[#E2DDF0]">
            <span className="font-semibold text-[#1B1530] text-xs sm:text-sm">
              Revisão com 1 Clique
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#0E8A6B] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Pronto para
              aprovar
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-linear-to-br from-[#1A0F3C] to-[#5926C8] p-1 sm:p-1.5 flex flex-col justify-between shrink-0">
                <span className="text-[8px] text-[#B390FA] font-bold">
                  Zaion
                </span>
                <span className="text-[8px] text-white leading-tight">
                  Post #12
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1B1530] line-clamp-2">
                  &ldquo;3 Métricas que o seu concorrente não quer que você
                  veja&rdquo;
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#5E5877] truncate">
                  Aprovado pelo diretor sem retrabalho.
                </p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-3.5 py-1.5 rounded-full bg-[#5926C8] text-white text-xs font-semibold hover:bg-[#3B1A8C] transition-colors shrink-0 text-center">
              Aprovar Arte
            </button>
          </div>
        </div>
      ),
    },
    {
      badge: "Passo 05 · No piloto assistido",
      title: "Agende e acompanhe os resultados",
      description:
        "Defina os horários de pico e a Zaion cuida da publicação automática. Acompanhe métricas limpas sem planilhas complexas.",
      mockup: (
        <div className="w-full p-3.5 sm:p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] space-y-3 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-[#E2DDF0]">
            <span className="font-semibold text-[#1B1530] flex items-center gap-1.5 text-xs sm:text-sm">
              <BarChart className="w-4 h-4 text-[#5926C8] shrink-0" />{" "}
              Publicação & Desempenho
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5926C8] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" /> Programado para 18:30
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
            <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-[#E2DDF0]">
              <span className="text-[10px] text-[#5E5877]">
                Taxa de Entrega
              </span>
              <span className="text-sm sm:text-base font-display font-bold text-[#0E8A6B] block">
                99.8%
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-[#E2DDF0]">
              <span className="text-[10px] text-[#5E5877]">Tempo Poupado</span>
              <span className="text-sm sm:text-base font-display font-bold text-[#5926C8] block">
                18h/sem
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="como-funciona"
      data-theme="light"
      className="relative w-full bg-white text-[#1B1530] py-20 sm:py-24 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5926C8]" />
            Da ideia à publicação
          </span>
          <TextGenerateEffect
            words="Do cadastro ao post publicado em uma tarde."
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#1B1530] tracking-[-2px] leading-tight"
          />
          <p className="mt-4 text-base sm:text-lg text-[#5E5877] max-w-2xl mx-auto leading-relaxed font-sans">
            Um processo direto, transparente e sem atrito para que você nunca
            mais fique sem conteúdo relevante.
          </p>
        </motion.div>

        {/* Tracing Beam com Timeline de Passos */}
        <TracingBeam className="px-4 sm:px-6">
          <div className="space-y-28 sm:space-y-16 pl-6 sm:pl-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative p-4 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2DDF0] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Textos do Passo */}
                  <div className="flex-1 space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20">
                      {step.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1B1530]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#5E5877] leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>

                  {/* Mockup do Passo em HTML/CSS */}
                  <div className="w-full md:w-[320px] lg:w-90 shrink-0">
                    {step.mockup}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TracingBeam>

        {/* CTA Chamativo da Seção Jornada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center relative z-20"
        >
          <Link href="#experimentar" className="group">
            <HoverBorderGradient
              variant="brand"
              className="bg-white text-[#5926C8] hover:bg-[#f4f0ff] border border-[#5926C8]/25 transition-colors py-3 px-7 text-sm font-bold shadow-lg shadow-[#5926C8]/25"
            >
              <span>Começar teste grátis de 7 dias</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

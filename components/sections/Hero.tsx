"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CardsFan } from "../common/CardsFan";
import { AnimatedTooltip, TooltipItem } from "../ui/animated-tooltip";
import { BackgroundBeams } from "../ui/background-beams";

const companyAvatars: TooltipItem[] = [
  {
    id: 1,
    name: "Camila Duarte",
    designation: "Head de Marketing",
    company: "Nubank",
    color: "bg-gradient-to-tr from-[#820AD1] to-[#9B30FF]",
    initials: "NU",
    hover: true,
  },
  {
    id: 2,
    name: "Rafael Martins",
    designation: "Growth Lead",
    company: "Vtex",
    color: "bg-gradient-to-tr from-[#F71963] to-[#FF4D8D]",
    initials: "VT",
    hover: true,
  },
  {
    id: 3,
    name: "Beatriz Lima",
    designation: "Creative Director",
    company: "Stone",
    color: "bg-gradient-to-tr from-[#00A868] to-[#12D18E]",
    initials: "ST",
    hover: true,
  },
  {
    id: 4,
    name: "Thiago Rocha",
    designation: "Content Strategist",
    company: "Hotmart",
    color: "bg-gradient-to-tr from-[#F04E23] to-[#FF754F]",
    initials: "HM",
    hover: true,
  },
  {
    id: 5,
    name: "Larissa Souza",
    designation: "Brand Manager",
    company: "Loft",
    color: "bg-gradient-to-tr from-[#FF5A00] to-[#FFA24C]",
    initials: "LF",
    hover: true,
  },
  {
    id: 6,
    name: "",
    designation: "",
    company: "",
    color: "bg-gradient-to-tr from-[#1A0F3C] to-[#1A0F3C]",
    initials: "+99",
    hover: false,
  },
];

export function Hero() {
  // Hook de Scroll: Fade-out suave da parte superior (badge, título, cursores)
  // à medida que os cards sobem e se aproximam do topo da tela.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [60, 260], [1, 0]);
  const heroY = useTransform(scrollY, [60, 260], [0, -40]);
  const heroScale = useTransform(scrollY, [60, 260], [1, 0.94]);
  const heroPointerEvents = useTransform(scrollY, (v) =>
    v > 240 ? "none" : "auto",
  );

  return (
    <section
      id="hero"
      data-theme="dark"
      className="relative overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 flex flex-col items-center justify-start"
    >
      {/* Background Atmosphere: Grids, Ambient Glow, Stars & Aceternity Beams */}
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-25"></div>
      <div className="absolute inset-0 hero-stars pointer-events-none opacity-45"></div>
      <BackgroundBeams />

      {/* ========================================================= */}
      {/* CONTEÚDO CENTRAL (COM EFEITO DE FADE-OUT NO SCROLL) */}
      {/* ========================================================= */}
      <motion.div
        style={{
          opacity: heroOpacity,
          y: heroY,
          scale: heroScale,
          pointerEvents:
            heroPointerEvents as unknown as React.CSSProperties["pointerEvents"],
        }}
        className="relative mt-15 z-30 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center"
      >
        {/* Avatares de Empresas que já usam o serviço (Aceternity Animated Tooltip) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex items-center justify-center p-2 rounded-full"
        >
          <AnimatedTooltip items={companyAvatars} />
        </motion.div>

        {/* Cursors Colaborativos Flutuantes BEM AFASTADOS do Título */}
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Cursor Esquerdo: Sofia · Bem afastado para a extrema esquerda */}
          <motion.div
            initial={{ opacity: 0, x: -70, rotate: -12 }}
            animate={{ opacity: 1, x: 0, rotate: -12 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-12 sm:-left-24 md:-left-36 lg:-left-56 -top-6 sm:-top-8 z-40 hidden sm:flex items-center gap-2 animate-float-cursor-1 pointer-events-none select-none"
          >
            <svg
              className="w-5 h-5 text-[#4FD1AE] drop-shadow-xl"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.5 3.21a1 1 0 0 0-1.41 1.41l4.7 14.86a1 1 0 0 0 1.83.12l2.67-5.34 5.34-2.67a1 1 0 0 0 .12-1.83L5.5 3.21z" />
            </svg>
            <div className="px-3.5 py-1.5 rounded-full bg-[#103B33] text-[#4FD1AE] border border-[#0E8A6B]/70 text-xs font-semibold shadow-2xl shadow-black/70">
              Sofia · Revisando arte
            </div>
          </motion.div>

          {/* Cursor Direito: Lucas · Bem afastado para a extrema direita */}
          <motion.div
            initial={{ opacity: 0, x: 70, rotate: -12 }}
            animate={{ opacity: 1, x: 0, rotate: -12 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-12 sm:-right-24 md:-right-36 lg:-right-56 -bottom-2 sm:bottom-0 z-40 hidden sm:flex items-center gap-2 animate-float-cursor-2 pointer-events-none select-none"
          >
            <svg
              className="w-5 h-5 text-[#E879F9] drop-shadow-xl"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.5 3.21a1 1 0 0 0-1.41 1.41l4.7 14.86a1 1 0 0 0 1.83.12l2.67-5.34 5.34-2.67a1 1 0 0 0 .12-1.83L5.5 3.21z" />
            </svg>
            <div className="px-3.5 py-1.5 rounded-full bg-[#2A1366] text-[#DCCEFB] border border-[#B390FA]/60 text-xs font-semibold shadow-2xl shadow-black/70">
              Lucas · Agendando carrossel
            </div>
          </motion.div>

          {/* Headline com Entrada Animada (H1 Sora Bold em 2 Linhas Limpas) */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] tracking-tight text-[#F4F0FF] leading-[1.12] mb-5"
          >
            <span className="sm:whitespace-nowrap tracking-[-2px]">
              Sua equipe de marketing
            </span>{" "}
            <br />
            <span className="italic font-light text-[#B390FA] tracking-[-2px] drop-shadow-[0_0_35px_rgba(179,144,250,0.45)]">
              em um só estúdio
            </span>
          </motion.h1>
        </div>

        {/* Subtítulo com Entrada Animada */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base sm:text-lg md:text-xl text-[#B9B0D6] max-w-155 leading-relaxed mb-6 font-normal"
        >
          Crie artes com IA no padrão da sua marca, edite no estúdio visual e
          agende semanas de conteúdo em minutos.
        </motion.p>

        {/* Garantias de Marca & Micro-provas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#B9B0D6] pt-1"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1AE]"></span>
            Brandbook 100% blindado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B390FA]"></span>
            IA treinada no tom da sua voz
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1AE]"></span>
            Sem risco de alucinação visual
          </span>
        </motion.div>
      </motion.div>

      {/* ========================================================= */}
      {/* LEQUE DE CARDS 3D NA PARTE INFERIOR (ANIMADO POR SCROLL) */}
      {/* ========================================================= */}
      <div className="w-full relative z-20 mt-4 sm:mt-6">
        <CardsFan />
      </div>
    </section>
  );
}

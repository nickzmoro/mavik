"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bell, ArrowUpRight, Check, Layers, Wand2 } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export function CardsFan() {
  const [, setActiveCard] = useState<number | null>(3);
  const [generatedCount, setGeneratedCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hook de Scroll Desktop: à medida que o usuário rola a página para baixo,
  // os cards que já começam aparecendo parcialmente sobem e revelam-se inteiros.
  const { scrollY } = useScroll();

  const fanY = useTransform(scrollY, [0, 350], [20, -240]);
  const fanScale = useTransform(scrollY, [0, 350], [0.98, 1.02]);

  // Desdobramento dos ângulos no desktop
  const rotateLeft1 = useTransform(scrollY, [0, 350], [-16, -11]);
  const rotateLeft2 = useTransform(scrollY, [0, 350], [-8, -5]);
  const rotateRight4 = useTransform(scrollY, [0, 350], [8, 5]);
  const rotateRight5 = useTransform(scrollY, [0, 350], [16, 11]);

  const handleGenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCount((prev) => (prev === 4 ? 8 : 4));
    }, 400);
  };

  // =========================================================
  // CARD 1: DIAGNÓSTICO DE PERFIL (Violeta Sólido)
  // =========================================================
  const renderCard1 = () => (
    <CardSpotlight
      color="#B390FA"
      className="w-full h-full rounded-[30px] bg-linear-to-b from-[#561DC9] via-[#4816B8] to-[#390F9B] p-5 sm:p-6 border border-[#7440E0]/60 shadow-[0_25px_50px_rgba(20,5,50,0.8)] flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-sm">
          Diagnóstico de Perfil
        </h3>
        <p className="text-xs text-[#DCCEFB] font-semibold mt-1">
          Análise do agente
        </p>
      </div>

      <div className="rounded-2xl p-4 bg-[#180B32] border border-white/10 mb-4 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <Bell className="w-4 h-4 text-[#F5B94D] fill-[#F5B94D]" />
          <span className="text-xs font-bold text-[#F5B94D]">
            Dica do agente
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-white font-medium leading-relaxed">
          Faz 5 dias sem publicar. Preparei 3 conteúdos.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-14 rounded-2xl bg-[#341175] border border-white/10 flex items-center justify-center text-[10px] text-[#DCCEFB] font-mono font-bold">
          01
        </div>
        <div className="h-14 rounded-2xl bg-[#341175] border border-white/10 flex items-center justify-center text-[10px] text-[#DCCEFB] font-mono font-bold">
          02
        </div>
        <div className="h-14 rounded-2xl bg-[#341175] border border-white/10 flex items-center justify-center text-[10px] text-[#DCCEFB] font-mono font-bold">
          03
        </div>
      </div>
    </CardSpotlight>
  );

  // =========================================================
  // CARD 2: PAUTA & IDEIAS (Rosa / Mauve Degradê)
  // =========================================================
  const renderCard2 = () => (
    <CardSpotlight
      color="#FFFFFF"
      className="w-full h-full rounded-[30px] bg-linear-to-b from-[#E982A9] via-[#DE6B98] to-[#C94D7F] p-5 sm:p-6 border border-white/35 shadow-[0_25px_50px_rgba(50,10,30,0.7)] flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1E0524] tracking-tight leading-tight">
          Pauta & Ideias
        </h3>
        <p className="text-xs text-[#521C3C] font-semibold mt-1">
          Sugestões da semana
        </p>
      </div>

      <div className="rounded-2xl p-4 bg-white shadow-xl text-left">
        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#F2ECFD] text-[#692FD3] mb-2.5">
          Carrossel
        </span>
        <h4 className="font-display font-bold text-[#1B1530] text-sm sm:text-base leading-snug mb-1.5">
          3 erros ao escolher um produto
        </h4>
        <p className="text-xs text-[#5E5877] mb-3 leading-relaxed">
          Educativo, para quem compara opções.
        </p>
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#38210A] text-[#F5B94D]">
          Em revisão
        </span>
      </div>
    </CardSpotlight>
  );

  // =========================================================
  // CARD 3: CENTRO EM DESTAQUE - ESTÚDIO DE CRIAÇÃO IA
  // =========================================================
  const renderCard3 = () => (
    <CardSpotlight
      color="#B390FA"
      className="w-full h-full rounded-[34px] bg-linear-to-b from-[#561DC9] via-[#4A14B8] to-[#380D96] p-5 sm:p-6 border-2 border-[#B390FA] shadow-[0_30px_70px_-15px_rgba(89,38,200,0.8),0_0_50px_rgba(179,144,250,0.35)] flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-sm">
            Estúdio de <br /> Criação IA
          </h2>
        </div>

        <button
          onClick={handleGenerate}
          className="group inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-[#B390FA] hover:bg-[#CBB3FC] text-[#1A0F3C] font-display font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 cursor-pointer"
        >
          <span>{isGenerating ? "Criando..." : "Gerar arte"}</span>
          <div className="w-6 h-6 rounded-full bg-[#1A0F3C] text-white flex items-center justify-center transition-transform group-hover:scale-105">
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-white shadow-2xl text-left mb-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#5926C8] mb-2">
          <Layers size={13} strokeWidth={2.5} />
          <span>3 camadas</span>
        </div>
        <h3 className="font-display font-bold text-[#1B1530] text-base sm:text-lg leading-snug mb-4">
          Novidade da semana: chegou a coleção de outono
        </h3>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#5926C8]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#B390FA]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#1A0F3C]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#0E8A6B]"></div>
        </div>
      </div>

      <div className="rounded-full py-2.5 px-4 bg-[#1C0B40] border border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-3.5 h-3.5 text-[#B390FA]" />
          <span className="text-xs text-white font-medium">
            Pronto! Veja suas {generatedCount} opções de arte.
          </span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1AE] animate-ping"></span>
      </div>
    </CardSpotlight>
  );

  // =========================================================
  // CARD 4: VALIDAÇÃO DE MARCA (Verde Esmeralda Sólido)
  // =========================================================
  const renderCard4 = () => (
    <CardSpotlight
      color="#4FD1AE"
      className="w-full h-full rounded-[30px] bg-linear-to-b from-[#138A5F] via-[#0E7752] to-[#085C3E] p-5 sm:p-6 border border-[#4FD1AE]/50 shadow-[0_25px_50px_rgba(5,35,25,0.8)] flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-sm">
          Validação de Marca
        </h3>
        <p className="text-xs text-[#A1E9D2] font-semibold mt-1">
          Checagem automática
        </p>
      </div>

      <div className="rounded-2xl p-4 bg-[#093226] border border-[#1FB481]/40 space-y-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#138A5F] text-[#A1E9D2] flex items-center justify-center shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-[13px] text-white font-medium">
            Contraste do título 7:1 (AAA)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#138A5F] text-[#A1E9D2] flex items-center justify-center shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-[13px] text-white font-medium">
            Cores da paleta da marca
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#138A5F] text-[#A1E9D2] flex items-center justify-center shrink-0">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-[13px] text-white font-medium">
            Fonte Sora aplicada
          </span>
        </div>
      </div>

      <div className="rounded-xl py-2 px-3 bg-[#082B20] border border-[#1FB481]/30 text-center">
        <p className="text-xs text-[#7BE4C4] font-medium">
          Logo com fundo transparente aplicada
        </p>
      </div>
    </CardSpotlight>
  );

  // =========================================================
  // CARD 5: CALENDÁRIO & PUBLICAÇÃO (Azul Royal Sólido)
  // =========================================================
  const renderCard5 = () => (
    <CardSpotlight
      color="#6B96F8"
      className="w-full h-full rounded-[30px] bg-linear-to-b from-[#2B57C7] via-[#2143A6] to-[#142E7F] p-5 sm:p-6 border border-[#6B96F8]/50 shadow-[0_25px_50px_rgba(10,20,60,0.8)] flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight drop-shadow-sm">
          Calendário & Publicação
        </h3>
        <p className="text-xs text-[#BAD0FC] font-semibold mt-1">Semana 42</p>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
            <span key={i} className="text-[10px] font-bold text-[#BAD0FC]">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
          <div className="h-8 rounded-lg bg-[#C5A7FC] text-[#1A0F3C] font-bold text-xs flex items-center justify-center shadow-md">
            ✓
          </div>
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
          <div className="h-8 rounded-lg bg-[#1B388D] border border-white/10 flex items-center justify-center text-[10px] text-white/50"></div>
        </div>
      </div>

      <div className="rounded-2xl p-3 bg-[#082D22] border border-[#1FB481]/40">
        <p className="text-xs font-bold text-[#4FD1AE]">Arte aprovada</p>
        <p className="text-xs text-white font-medium mt-0.5">
          Agendada para quinta, 10h
        </p>
      </div>
    </CardSpotlight>
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto pt-1 sm:pt-2 pb-4 sm:pb-6 px-4 sm:px-6">
      {/* ========================================================= */}
      {/* VERSÃO MOBILE: Cards empilhados um acima do outro (sem abas) */}
      {/* ========================================================= */}
      <div className="flex md:hidden flex-col gap-6 w-full max-w-sm sm:max-w-md mx-auto items-center mt-4">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5 }}
          className="crisp-card w-full select-none"
        >
          {renderCard1()}
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="crisp-card w-full select-none"
        >
          {renderCard2()}
        </motion.div>

        {/* Card 3 (Destaque) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="crisp-card w-full select-none"
        >
          {renderCard3()}
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="crisp-card w-full select-none"
        >
          {renderCard4()}
        </motion.div>

        {/* Card 5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="crisp-card w-full select-none"
        >
          {renderCard5()}
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* VERSÃO DESKTOP: Leque 3D Animado por Scroll */}
      {/* ========================================================= */}
      <motion.div
        style={{ y: fanY, scale: fanScale }}
        className="cards-fan-container relative hidden md:flex items-end justify-center min-h-125 sm:min-h-132.5 lg:min-h-140 w-full"
      >
        {/* CARD 1: DIAGNÓSTICO */}
        <motion.div
          style={{ rotate: rotateLeft1 }}
          whileHover={{ rotate: -7, y: -20, scale: 1.03 }}
          onClick={() => setActiveCard(1)}
          className="crisp-card cursor-pointer absolute md:left-[1%] lg:left-[3%] bottom-0 w-70 sm:w-76.25 lg:w-81.25 z-10 select-none"
        >
          {renderCard1()}
        </motion.div>

        {/* CARD 2: PAUTA & IDEIAS */}
        <motion.div
          style={{ rotate: rotateLeft2 }}
          whileHover={{ rotate: -2, y: -20, scale: 1.03 }}
          onClick={() => setActiveCard(2)}
          className="crisp-card cursor-pointer absolute md:left-[15%] lg:left-[17%] bottom-0 w-71.25 sm:w-77.5 lg:w-82.5 z-20 select-none"
        >
          {renderCard2()}
        </motion.div>

        {/* CARD 3: CENTRO EM DESTAQUE - ESTÚDIO DE CRIAÇÃO IA */}
        <motion.div
          whileHover={{ y: -18, scale: 1.09 }}
          onClick={() => setActiveCard(3)}
          className="crisp-card relative w-full max-w-85 sm:max-w-97.5 lg:max-w-103.75 z-30 select-none scale-105"
        >
          {renderCard3()}
        </motion.div>

        {/* CARD 4: VALIDAÇÃO DE MARCA */}
        <motion.div
          style={{ rotate: rotateRight4 }}
          whileHover={{ rotate: 2, y: -20, scale: 1.03 }}
          onClick={() => setActiveCard(4)}
          className="crisp-card cursor-pointer absolute md:right-[15%] lg:right-[17%] bottom-0 w-71.25 sm:w-77.5 lg:w-82.5 z-20 select-none"
        >
          {renderCard4()}
        </motion.div>

        {/* CARD 5: CALENDÁRIO & PUBLICAÇÃO */}
        <motion.div
          style={{ rotate: rotateRight5 }}
          whileHover={{ rotate: 7, y: -20, scale: 1.03 }}
          onClick={() => setActiveCard(5)}
          className="crisp-card cursor-pointer absolute md:right-[1%] lg:right-[3%] bottom-0 w-70 sm:w-76.25 lg:w-81.25 z-10 select-none"
        >
          {renderCard5()}
        </motion.div>
      </motion.div>
    </div>
  );
}

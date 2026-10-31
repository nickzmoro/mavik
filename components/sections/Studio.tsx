"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Layers,
  Sparkles,
  Type,
  Image as ImageIcon,
  Check,
  Send,
  History,
  Undo2,
  Redo2,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

export function Studio() {
  const [promptText, setPromptText] = useState(
    "Deixe o título com 15% a mais de destaque e adicione o selo da campanha",
  );
  const [selectedLayer, setSelectedLayer] = useState("headline");

  return (
    <section
      id="estudio"
      data-theme="dark"
      className="relative w-full bg-[#1A0F3C] text-white overflow-hidden py-20"
    >
      {/* Grid de fundo sutil */}
      <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2A1366] text-[#B390FA] border border-[#B390FA]/30 mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B390FA]" />
                Edição profissional sem complicação
              </span>
              <TextGenerateEffect
                words="Não é uma imagem pronta. É um estúdio."
                className="text-3xl sm:text-4xl tracking-[-2px] lg:text-5xl font-display font-bold text-white leading-tight"
              />
              <p className="mt-4 text-base sm:text-lg text-[#B9B0D6] max-w-2xl mx-auto leading-relaxed font-sans">
                Cada arte nasce em camadas reais: fundo, textos, selos e logo.
                Troque o título, mude a foto, peça um ajuste por texto. Tudo
                editável, sem sair da plataforma.
              </p>
            </motion.div>
          }
        >
          {/* Mockup Real do Editor Zaion */}
          <div className="relative w-full h-full flex flex-col justify-between bg-[#12092B] rounded-xl overflow-hidden font-sans border border-[#3A2A72]/80">
            {/* Topbar do Editor */}
            <div className="h-10 sm:h-12 border-b border-[#3A2A72]/60 px-3 sm:px-4 flex items-center justify-between bg-[#1A0F3C]/90 text-xs">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[#B9B0D6] border-l border-[#3A2A72] pl-2 sm:pl-3 font-medium text-[11px] sm:text-xs truncate max-w-32.5 sm:max-w-none">
                  Campanha_Feed_01.zaion
                </span>
              </div>

              {/* Botões de Ação na barra */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button className="hidden sm:inline-flex p-1.5 text-[#B9B0D6] hover:text-white rounded hover:bg-[#2A1366]">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button className="hidden sm:inline-flex p-1.5 text-[#B9B0D6] hover:text-white rounded hover:bg-[#2A1366]">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#103B33] text-[#4FD1AE] text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />{" "}
                  <span className="hidden xs:inline">Auto-salvo</span>
                </span>
                <button className="px-2.5 py-1 sm:px-3 sm:py-1 bg-[#5926C8] hover:bg-[#3B1A8C] text-white rounded-full font-semibold text-[11px] sm:text-xs shadow-xs">
                  Exportar
                </button>
              </div>
            </div>

            {/* Corpo do Editor: Canvas Central + Painel de Camadas à Direita */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Chips Flutuantes de Destaque sobre o Mockup */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex flex-wrap gap-1.5 sm:gap-2 pointer-events-none">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#5926C8]/90 text-white border border-[#B390FA]/40 shadow-lg backdrop-blur-md flex items-center gap-1 sm:gap-1.5">
                  <Layers className="w-3 h-3 text-[#B390FA]" />
                  Camadas editáveis
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1366]/90 text-[#B390FA] border border-[#B390FA]/30 shadow-lg backdrop-blur-md items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Edição por texto
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#12092B]/90 text-[#4FD1AE] border border-[#4FD1AE]/30 shadow-lg backdrop-blur-md items-center gap-1.5">
                  <History className="w-3 h-3" />
                  Versões ilimitadas
                </span>
              </div>

              {/* Canvas Central */}
              <div className="flex-1 bg-[#0D0620] flex items-center justify-center p-2.5 sm:p-6 overflow-hidden relative">
                {/* O Post sendo editado no Canvas */}
                <div className="w-full max-w-67.5 sm:max-w-md aspect-square rounded-xl bg-linear-to-tr from-[#1A0F3C] via-[#2A1366] to-[#5926C8]/40 border-2 border-[#B390FA]/40 p-3.5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  {/* Grid de alinhamento visual */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[20px_20px]" />

                  {/* Camada 1: Topo com Logo e Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-[#12092B]/80 border border-[#B390FA]/30">
                      <Image
                        src="/zaion-logo-dark.webp"
                        alt="Logo Zaion"
                        width={60}
                        height={18}
                        className="h-3.5 sm:h-4 w-auto object-contain"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#B390FA]/20 text-[#B390FA] border border-[#B390FA]/30">
                      SELO #01
                    </span>
                  </div>

                  {/* Camada 2: Headline Selecionada com Bounding Box */}
                  <div className="relative z-10 my-auto p-2 sm:p-3 rounded-lg border border-dashed border-[#B390FA] bg-[#B390FA]/5">
                    <div className="absolute -top-2 left-2 bg-[#5926C8] text-white text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded font-mono">
                      Headline (Editável)
                    </div>
                    <h3 className="text-xs sm:text-2xl font-display font-bold text-white leading-tight">
                      Marketing que gera resultados comprovados
                    </h3>
                    <p className="text-[9px] sm:text-xs text-[#B9B0D6] mt-1 sm:mt-2 font-sans line-clamp-2 sm:line-clamp-none">
                      Ajuste qualquer texto ou deixe a IA refinar o tom de voz
                      com 1 clique.
                    </p>
                  </div>

                  {/* Camada 3: CTA do Post */}
                  <div className="relative z-10 flex items-center justify-between pt-1 sm:pt-2">
                    <span className="text-[9px] sm:text-[11px] text-[#B9B0D6]">
                      @suamarca
                    </span>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#5926C8] text-white text-[9px] sm:text-xs font-semibold">
                      Arrasta pro lado →
                    </span>
                  </div>
                </div>
              </div>

              {/* Painel Lateral Direito: Camadas */}
              <div className="hidden sm:flex w-64 border-l border-[#3A2A72]/60 bg-[#160B33] flex-col justify-between">
                <div>
                  <div className="p-3 border-b border-[#3A2A72]/60 flex items-center justify-between text-xs font-semibold text-[#B9B0D6]">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#B390FA]" />
                      Camadas da Arte
                    </span>
                    <span className="text-[10px] text-white/50">4 camadas</span>
                  </div>

                  <div className="p-2 space-y-1.5 text-xs">
                    <div
                      onClick={() => setSelectedLayer("logo")}
                      className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        selectedLayer === "logo"
                          ? "bg-[#2A1366] border border-[#B390FA] text-white"
                          : "bg-[#1A0F3C] border border-[#3A2A72] text-[#B9B0D6] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-[#4FD1AE]" />
                        Logo Oficial (.PNG)
                      </span>
                      <span className="text-[10px] text-[#4FD1AE]">
                        {selectedLayer === "logo" ? "Ativa" : "Travada"}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedLayer("headline")}
                      className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        selectedLayer === "headline"
                          ? "bg-[#2A1366] border border-[#B390FA] text-white shadow-xs"
                          : "bg-[#1A0F3C] border border-[#3A2A72] text-[#B9B0D6] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-[#B390FA]" />
                        Título & Copy
                      </span>
                      <span className="text-[10px] text-[#B390FA] font-medium">
                        {selectedLayer === "headline" ? "Ativa" : "Padrão"}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedLayer("badge")}
                      className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        selectedLayer === "badge"
                          ? "bg-[#2A1366] border border-[#B390FA] text-white"
                          : "bg-[#1A0F3C] border border-[#3A2A72] text-[#B9B0D6] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#B390FA]" />
                        Selo Campanha
                      </span>
                      <span className="text-[10px] text-white/50">
                        {selectedLayer === "badge" ? "Ativa" : "Vetor"}
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedLayer("background")}
                      className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        selectedLayer === "background"
                          ? "bg-[#2A1366] border border-[#B390FA] text-white"
                          : "bg-[#1A0F3C] border border-[#3A2A72] text-[#B9B0D6] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#9A6BF4]" />
                        Fundo Gradiente
                      </span>
                      <span className="text-[10px] text-white/50">
                        {selectedLayer === "background" ? "Ativa" : "CSS"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faixa de Versões no Painel Lateral */}
                <div className="p-3 border-t border-[#3A2A72]/60 bg-[#12092B]">
                  <span className="text-[11px] font-semibold text-[#B9B0D6] block mb-2">
                    Histórico de Versões
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-[#1A0F3C] text-[10px] text-[#B9B0D6] border border-[#3A2A72]">
                      v1.0
                    </span>
                    <span className="px-2 py-1 rounded bg-[#1A0F3C] text-[10px] text-[#B9B0D6] border border-[#3A2A72]">
                      v1.1
                    </span>
                    <span className="px-2 py-1 rounded bg-[#5926C8] text-[10px] text-white font-bold border border-[#B390FA]">
                      v1.2 (Atual)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Inferior: Campo "Peça à IA" */}
            <div className="p-2.5 sm:p-4 bg-[#1A0F3C] border-t border-[#3A2A72]/80 flex flex-row items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#B390FA] shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B390FA]" />
                <span className="hidden xs:inline">Peça à IA:</span>
              </div>
              <div className="flex-1 w-full flex items-center bg-[#12092B] rounded-full border border-[#3A2A72] px-3 py-1 sm:py-1.5 focus-within:border-[#B390FA] transition-colors">
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ex: Deixe o título maior e troque a cor..."
                  className="bg-transparent text-[11px] sm:text-sm text-white placeholder-white/40 flex-1 outline-hidden font-sans"
                />
                <button className="p-1 sm:p-1.5 rounded-full bg-[#5926C8] text-white hover:bg-[#3B1A8C] transition-colors shrink-0">
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
              <span className="hidden lg:inline text-[11px] text-[#B9B0D6] shrink-0">
                Modificações pontuais sem recriar a arte
              </span>
            </div>
          </div>
        </ContainerScroll>

        {/* CTA Chamativo da Seção Studio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center relative z-20"
        >
          <Link href="#experimentar" className="group">
            <HoverBorderGradient
              variant="brand"
              className="bg-[#1A0F3C] text-white hover:bg-[#2A1366] transition-colors py-3 px-8 text-sm font-bold shadow-xl shadow-[#5926C8]/40"
            >
              <span>Experimentar o estúdio grátis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

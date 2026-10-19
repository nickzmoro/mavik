"use client";

import React, { useState } from "react";
import {
  Sparkles,
  User,
  Palette,
  Briefcase,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
  Lock,
  Eye,
  Check,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Audience() {
  const [activeTab, setActiveTab] = useState<"iniciante" | "pro" | "agencia">(
    "pro",
  );

  const personas = {
    iniciante: {
      id: "iniciante",
      badge: "Iniciantes & Criadores Solo",
      title: "Estou começando",
      tagline: "Responda 3 perguntas e receba 4 artes prontas.",
      description:
        "Você não precisa saber nada sobre teoria das cores, proporção áurea ou tipografia. A Mavik atua como seu diretor de arte pessoal.",
      highlights: [
        "Sem necessidade de dominar Photoshop ou Figma",
        "Sugestões estratégicas de títulos e legendas",
        "Brand Kit configurado em menos de 2 minutos",
        "Aprovação em 1 clique direto para o Instagram",
      ],
      previewComponent: (
        <div className="w-full h-full bg-[#F8F6FE] p-6 rounded-2xl border border-[#E2DDF0] flex flex-col justify-between text-[#1B1530] font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDF0]">
            <span className="text-xs font-semibold text-[#5926C8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Modo Guiado (3 Perguntas)
            </span>
            <span className="text-[11px] bg-[#EFE8FD] text-[#5926C8] px-2.5 py-0.5 rounded-full font-bold">
              Passo 3 de 3
            </span>
          </div>

          <div className="my-auto space-y-3 py-2">
            <div className="p-3 bg-white rounded-xl border border-[#E2DDF0] shadow-xs">
              <span className="text-[10px] text-[#5E5877] block">
                Qual o objetivo do post de hoje?
              </span>
              <span className="text-xs font-bold text-[#1B1530]">
                &ldquo;Divulgar 3 dicas práticas para o meu público&rdquo;
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white border-2 border-[#5926C8] shadow-xs flex flex-col justify-between h-28">
                <span className="text-[9px] font-bold text-[#5926C8]">
                  Opção 1 · Escolhida
                </span>
                <p className="text-[10px] font-bold text-[#1B1530] line-clamp-2">
                  3 atalhos que dobram sua produtividade
                </p>
                <span className="text-[9px] text-[#0E8A6B] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Pronto
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E2DDF0] flex flex-col justify-between h-28 opacity-70">
                <span className="text-[9px] font-semibold text-[#5E5877]">
                  Opção 2
                </span>
                <p className="text-[10px] font-medium text-[#1B1530] line-clamp-2">
                  O erro silencioso que você comete todo dia
                </p>
                <span className="text-[9px] text-[#5E5877]">Gerada</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2DDF0] text-xs">
            <span className="text-[#5E5877] text-[11px]">
              4 opções geradas em 12s
            </span>
            <button className="px-3 py-1.5 rounded-full bg-[#5926C8] text-white text-[11px] font-bold shadow-xs">
              Aprovar e Agendar
            </button>
          </div>
        </div>
      ),
    },
    pro: {
      id: "pro",
      badge: "Designers & Profissionais de Marketing",
      title: "Já sou da área",
      tagline: "Prompt livre, camadas e controle total sobre cada detalhe.",
      description:
        "Controle cirúrgico. Tenha acesso a todas as camadas, propriedades CSS, tokens de design e liberdade total de prompt com renderização instantânea.",
      highlights: [
        "Acesso à árvore de camadas vetoriais e textos",
        "Comandos detalhados por texto ('prompt livre')",
        "Exportação em alta resolução vetorial / PNG",
        "Alinhamento milimétrico em grid áurea de 4px",
      ],
      previewComponent: (
        <div className="w-full h-full bg-[#12092B] p-6 rounded-2xl border border-[#3A2A72] flex flex-col justify-between text-white font-sans">
          {/* Header do Estúdio Pro */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3A2A72]/60 text-xs">
            <span className="text-[#B390FA] font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#B390FA]" /> Inspetor
              Profissional
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#2A1366] text-[#B390FA] border border-[#B390FA]/30 font-mono">
              Figma Sync · Ativo
            </span>
          </div>

          {/* Árvore de Camadas Pro + Canvas Compacto */}
          <div className="my-auto grid grid-cols-2 gap-3 py-2">
            {/* Camadas */}
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded bg-[#1A0F3C] border border-[#B390FA]/40 flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#B390FA]" />
                  <span>Headline_Sora</span>
                </span>
                <span className="text-[9px] text-[#B390FA]">700 Bold</span>
              </div>
              <div className="p-2 rounded bg-[#1A0F3C]/60 border border-[#3A2A72] flex items-center justify-between text-[#B9B0D6]">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#4FD1AE]" />
                  <span>Logo_Oficial</span>
                </span>
                <span className="text-[9px] text-[#4FD1AE]">SVG Lock</span>
              </div>
              <div className="p-2 rounded bg-[#1A0F3C]/60 border border-[#3A2A72] flex items-center justify-between text-[#B9B0D6]">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-[#B390FA]" />
                  <span>Selo_Campanha</span>
                </span>
                <span className="text-[9px] text-white/40">Vetor</span>
              </div>
            </div>

            {/* Prompt Livre Console */}
            <div className="p-3 rounded-xl bg-[#1A0F3C] border border-[#3A2A72] flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#B390FA] block mb-1">
                {"// Prompt Livre"}
              </span>
              <p className="text-[11px] text-[#F4F0FF] font-mono leading-relaxed">
                &ldquo;Alinhe a logo a 32px da borda, ajuste o line-height para
                1.15 e eleve o contraste.&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#3A2A72]/60 text-[10px] text-[#4FD1AE]">
                <span>✓ Tokens preservados</span>
              </div>
            </div>
          </div>

          {/* Footer Pro */}
          <div className="flex items-center justify-between pt-3 border-t border-[#3A2A72]/60 text-xs">
            <span className="text-[#B9B0D6] text-[11px]">
              Grid: 4px | Escala: 100%
            </span>
            <span className="text-[#B390FA] font-mono text-[11px]">
              Export: SVG + PNG 4x
            </span>
          </div>
        </div>
      ),
    },
    agencia: {
      id: "agencia",
      badge: "Agências & Múltiplas Contas",
      title: "Tenho uma agência",
      tagline:
        "Várias marcas, calendários separados e aprovação por link. Em breve.",
      description:
        "Gerencie dezenas de marcas sem cruzar arquivos ou diretrizes. Envie links mágicos de aprovação direto para os clientes.",
      highlights: [
        "Múltiplos Brand Kits e paletas independentes",
        "Links públicos de aprovação para clientes (sem login)",
        "Separação estrita de calendários e faturamento",
        "Permissões granulares de equipe por conta",
      ],
      previewComponent: (
        <div className="w-full h-full bg-[#F8F6FE] p-6 rounded-2xl border border-[#E2DDF0] flex flex-col justify-between text-[#1B1530] font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDF0]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5926C8]" />
              <span className="text-xs font-bold text-[#1B1530]">
                Agência Hub
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
              Vagas Antecipadas
            </span>
          </div>

          <div className="my-auto space-y-3 py-2">
            <div className="p-3 rounded-xl bg-white border border-[#E2DDF0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#5E5877] block">
                  Marca Ativa
                </span>
                <span className="text-xs font-bold text-[#1B1530]">
                  Cliente #04 — E-commerce Moda
                </span>
              </div>
              <span className="text-[10px] bg-[#EFE8FD] text-[#5926C8] px-2 py-0.5 rounded font-semibold">
                8 Marcas Ativas
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E2DDF0] space-y-2">
              <span className="text-[10px] text-[#5E5877] block">
                Link de Aprovação Externa
              </span>
              <div className="flex items-center justify-between bg-[#F8F6FE] p-2 rounded-lg border border-[#E2DDF0] text-xs">
                <span className="font-mono text-[10px] text-[#5926C8] truncate">
                  mavik.ia/aprovacao/marca-04-out26
                </span>
                <span className="text-[10px] font-bold text-[#0E8A6B] flex items-center gap-1 shrink-0 ml-2">
                  <CheckCircle2 className="w-3 h-3" /> 5 posts aprovados
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2DDF0] text-xs">
            <span className="text-[#5E5877] text-[11px]">
              Relatórios consolidados
            </span>
            <span className="text-[#5926C8] font-bold text-[11px]">
              Entrar na lista VIP →
            </span>
          </div>
        </div>
      ),
    },
  };

  const current = personas[activeTab];

  return (
    <section className="relative w-full bg-white text-[#1B1530] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5926C8]" />
            Feito para o seu nível de maturidade
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#1B1530] tracking-tight leading-tight">
            Do primeiro post ao time inteiro.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5E5877] max-w-2xl mx-auto leading-relaxed font-sans">
            A Mavik se molda à sua rotina — sem complexidade para quem quer
            rapidez, sem limitações para quem exige precisão.
          </p>
        </div>

        {/* Seletor Segmentado Interativo (Abas Elegantes) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-[#F8F6FE] border border-[#E2DDF0] shadow-xs gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("iniciante")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "iniciante"
                  ? "bg-white text-[#5926C8] shadow-sm border border-[#E2DDF0]"
                  : "text-[#5E5877] hover:text-[#1B1530]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Estou começando</span>
            </button>

            <button
              onClick={() => setActiveTab("pro")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "pro"
                  ? "bg-[#5926C8] text-white shadow-md shadow-[#5926C8]/25"
                  : "text-[#5E5877] hover:text-[#1B1530]"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Já sou da área</span>
            </button>

            <button
              onClick={() => setActiveTab("agencia")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "agencia"
                  ? "bg-white text-[#1B1530] shadow-sm border border-[#E2DDF0]"
                  : "text-[#5E5877] hover:text-[#1B1530]"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Tenho uma agência</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EFE8FD] text-[#5926C8] hidden sm:inline">
                Em breve
              </span>
            </button>
          </div>
        </div>

        {/* Console Interativo com Apresentação Visual e Mockup Live */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-3xl border border-[#E2DDF0] bg-white p-6 sm:p-10 shadow-xl shadow-[#5926C8]/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Coluna da Esquerda: Explicação, Benefícios e Tom */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20">
                  {current.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#1B1530]">
                  {current.tagline}
                </h3>
                <p className="text-sm text-[#5E5877] font-sans leading-relaxed pt-1">
                  {current.description}
                </p>
              </div>

              {/* Lista de Recursos Específicos do Modo */}
              <div className="space-y-3 pt-2">
                {current.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#1B1530] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0E8A6B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Ação Conectada */}
              <div className="pt-2">
                <button
                  className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "pro"
                      ? "bg-[#5926C8] text-white hover:bg-[#3B1A8C] shadow-md shadow-[#5926C8]/20"
                      : "bg-[#EFE8FD] text-[#5926C8] hover:bg-[#5926C8] hover:text-white"
                  }`}
                >
                  <span>
                    {activeTab === "iniciante"
                      ? "Experimentar modo simples"
                      : activeTab === "pro"
                        ? "Explorar estúdio profissional"
                        : "Entrar na lista de espera"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Coluna da Direita: Live Mockup Interativo da Tela */}
            <div className="lg:col-span-6 h-85 sm:h-95 w-full">
              {current.previewComponent}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

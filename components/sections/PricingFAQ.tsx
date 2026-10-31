"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Check,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MovingBorder } from "@/components/ui/moving-border";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Essencial",
      tagline: "Ideal para começar com consistência e sem retrabalho.",
      price: "A definir",
      priceNote: "Plano mensal ou anual com desconto",
      recommended: false,
      benefits: [
        "1 Brand Kit completo com logo intocável",
        "Estúdio de criação com camadas reais",
        "Até 30 artes com IA por mês",
        "Exportação em alta definição (PNG/JPG)",
      ],
      cta: "Começar no Essencial",
    },
    {
      name: "Profissional",
      tagline: "Para quem quer acelerar o crescimento e provar resultados.",
      price: "A definir",
      priceNote: "Mais escolhido por criadores e empresas",
      recommended: true,
      benefits: [
        "Brand Kit avançado e paletas ilimitadas",
        "Estúdio com edição livre e comandos por texto",
        "Campanhas completas de 30 dias com 1 clique",
        "Dashboard com métricas integradas do Instagram",
      ],
      cta: "Escolher Profissional",
    },
    {
      name: "Agência",
      tagline: "Para times de marketing e gestão de múltiplos clientes.",
      price: "A definir",
      priceNote: "Em breve com vagas antecipadas",
      recommended: false,
      badge: "Em breve",
      benefits: [
        "Múltiplos Brand Kits e marcas simultâneas",
        "Links de aprovação pública para clientes",
        "Controle de membros e permissões de equipe",
        "Campanhas completas e relatórios analíticos",
      ],
      cta: "Entrar na lista VIP",
    },
  ];

  const faqs = [
    {
      q: "A IA muda a minha logo?",
      a: "Não. Ela é aplicada a partir do seu arquivo original.",
    },
    {
      q: "Preciso saber design?",
      a: "Não. Mas, se souber, tem controle total.",
    },
    {
      q: "Posso editar depois de gerar?",
      a: "Sim, no editor ou pedindo por texto.",
    },
    {
      q: "Publica sozinho no Instagram?",
      a: "Nunca sem a sua aprovação.",
    },
    {
      q: "Em quanto tempo tenho a primeira arte?",
      a: "Em poucos minutos depois de montar a marca.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section
      id="precos"
      data-theme="light"
      className="relative w-full bg-[#F8F6FE] text-[#1B1530] py-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Bloco 1: Título e Planos */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFE8FD] text-[#5926C8] border border-[#5926C8]/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5926C8]" />
            Transparência e flexibilidade
          </span>
          <TextGenerateEffect
            words="Escolha o seu ritmo."
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#1B1530] tracking-[-2px] leading-tight"
          />
          <p className="mt-4 text-base sm:text-lg text-[#5E5877] max-w-2xl mx-auto leading-relaxed font-sans">
            Comece no seu ritmo e escale conforme suas demandas de marketing
            crescerem.
          </p>
        </motion.div>

        {/* 3 Planos de Preços */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24">
          {plans.map((plan, idx) => {
            if (plan.recommended) {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex flex-col"
                >
                  {/* Destaque com MovingBorder no plano recomendado */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5926C8] text-white shadow-md">
                      Recomendado
                    </span>
                  </div>

                  <div className="relative p-0.5 rounded-3xl bg-linear-to-b from-[#5926C8] via-[#B390FA] to-[#5926C8] shadow-2xl flex-1 flex flex-col">
                    <div className="bg-[#FFFFFF] p-8 rounded-[22px] flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-display font-bold text-[#1B1530]">
                            {plan.name}
                          </h3>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EFE8FD] text-[#5926C8]">
                            Mais Popular
                          </span>
                        </div>

                        <p className="text-xs text-[#5E5877] mb-6">
                          {plan.tagline}
                        </p>

                        <div className="mb-6 p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0]">
                          <span className="text-3xl font-display font-bold text-[#5926C8] block">
                            {plan.price}
                          </span>
                          <span className="text-[11px] text-[#5E5877]">
                            {plan.priceNote}
                          </span>
                        </div>

                        <div className="space-y-3 mb-8">
                          <span className="text-[11px] font-bold text-[#1B1530] uppercase tracking-wider block">
                            O que está incluso:
                          </span>
                          {plan.benefits.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-start gap-2 text-xs text-[#1B1530]"
                            >
                              <Check className="w-4 h-4 text-[#5926C8] shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <MovingBorder
                        as="button"
                        duration={3500}
                        containerClassName="w-full h-12"
                        className="bg-[#5926C8] text-white font-bold text-xs hover:bg-[#3B1A8C] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </MovingBorder>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-8 rounded-3xl bg-white border border-[#E2DDF0] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-display font-bold text-[#1B1530]">
                      {plan.name}
                    </h3>
                    {plan.badge && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-[#5E5877] border border-gray-200">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5E5877] mb-6">{plan.tagline}</p>

                  <div className="mb-6 p-4 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0]">
                    <span className="text-3xl font-display font-bold text-[#1B1530] block">
                      {plan.price}
                    </span>
                    <span className="text-[11px] text-[#5E5877]">
                      {plan.priceNote}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold text-[#1B1530] uppercase tracking-wider block">
                      O que está incluso:
                    </span>
                    {plan.benefits.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-2 text-xs text-[#1B1530]"
                      >
                        <Check className="w-4 h-4 text-[#0E8A6B] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-3 px-5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-11 ${
                    plan.badge === "Em breve"
                      ? "bg-gray-100 text-[#5E5877] hover:bg-gray-200"
                      : "bg-[#EFE8FD] text-[#5926C8] hover:bg-[#5926C8] hover:text-white"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bloco 2: FAQ com Imagem do SaaS Lado a Lado */}
        <div id="faq" className="pt-12 border-t border-[#E2DDF0]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#5926C8] border border-[#5926C8]/20 mb-2 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-[#5926C8]" /> Dúvidas
              frequentes
            </span>
            <TextGenerateEffect
              words="Perguntas e respostas diretas."
              className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-[-2px] font-bold text-[#1B1530]"
            />
            <p className="mt-2 text-sm text-[#5E5877]">
              Tudo o que você precisa saber antes de transformar a criação da
              sua marca.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Coluna 1: Imagem Ilustrativa Gerada por IA do SaaS Zaion */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col space-y-4"
            >
              <div className="relative rounded-3xl overflow-hidden bg-[#1A0F3C] group">
                <Image
                  src="/faq-ai-studio.webp"
                  alt="Zaion AI Studio Workspace"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#3a2185] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>

              {/* Card de Atendimento / Ajuda Direta */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DDF0] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EFE8FD] text-[#5926C8]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-normal! text-[#1B1530]">
                      Ainda tem dúvidas?
                    </h4>
                    <p className="text-[11px] text-[#5E5877]">
                      Fale agora com nosso time pelo WhatsApp.
                    </p>
                  </div>
                </div>
                <Link
                  href="#experimentar"
                  className="px-3.5 py-1.5 rounded-full bg-[#5926C8] hover:bg-[#481EAA] text-white text-xs font-semibold transition-colors shrink-0"
                >
                  Conversar
                </Link>
              </div>
            </motion.div>

            {/* Coluna 2: Acordeão de Perguntas Frequentes */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-3"
            >
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E2DDF0] bg-white overflow-hidden shadow-xs hover:border-[#5926C8]/40 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-[#1B1530] hover:text-[#5926C8] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#5926C8] shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-sm text-[#5E5877] font-sans leading-relaxed border-t border-[#F8F6FE]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CTA Chamativo abaixo do FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-center relative z-20"
          >
            <Link href="#experimentar" className="group">
              <HoverBorderGradient
                variant="brand"
                className="bg-white text-[#5926C8] hover:bg-[#f4f0ff] border border-[#5926C8]/25 transition-colors py-3 px-7 text-sm font-bold shadow-lg shadow-[#5926C8]/25"
              >
                <span>Testar grátis sem cartão</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </HoverBorderGradient>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { routes } from "@/lib/routes";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsappIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function CtaFooter() {
  return (
    <footer
      id="experimentar"
      className="relative w-full bg-[#12092B] text-white overflow-hidden pt-24 pb-12"
    >
      {/* Sparkles discretos no fundo */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <SparklesCore
          id="cta-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.8}
          particleDensity={30}
          particleColor="#B390FA"
        />
      </div>

      {/* Background Beams sutil de fundo */}
      <BackgroundBeams className="opacity-40" />

      {/* Bloco Central do CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-28"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A1366]/80 text-[#B390FA] border border-[#B390FA]/30 text-xs font-semibold mb-6 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#B390FA]" />
          Comece hoje mesmo sem compromisso
        </div>

        <TextGenerateEffect
          words="Sua próxima semana de conteúdo pode estar pronta antes do café esfriar."
          className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-[-2px] leading-tight mb-6"
        />

        <p className="text-base sm:text-lg text-[#B9B0D6] max-w-2xl mx-auto font-sans leading-relaxed mb-10">
          Chega de posts distorcidos, layouts genéricos e horas no Photoshop.
          Junte-se aos criadores e empresas que colocaram o marketing no piloto
          assistido.
        </p>

        {/* Botão de Testar Grátis Super Chamativo com HoverBorderGradient */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#experimentar" className="group">
            <HoverBorderGradient
              variant="brand"
              className="bg-[#1A0F3C] text-white hover:bg-[#2A1366] transition-colors py-4 px-10 text-base font-bold shadow-2xl shadow-[#5926C8]/60 cursor-pointer"
            >
              <span>Testar grátis agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </div>

        <p className="text-xs text-[#B9B0D6] mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4FD1AE]" />
          Sem necessidade de cartão de crédito para testar.
        </p>
      </motion.div>

      {/* ========================================================= */}
      {/* RODAPÉ ESTRUTURADO (INSPIRADO NO LAYOUT DO GRAPHY) */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border-t border-[#3A2A72]/60 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">
            {/* Coluna da Esquerda: Logo + Descrição + Redes Sociais */}
            <div className="md:col-span-5 flex flex-col items-start space-y-5">
              <Link href="#hero" className="inline-block">
                <Image
                  src="/zaion-logo-dark.webp"
                  alt="Logo Oficial Zaion"
                  width={150}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </Link>

              <p className="text-xs sm:text-sm text-[#B9B0D6] max-w-sm leading-relaxed font-sans">
                A Zaion capacita criadores e equipes a transformar ideias em
                conteúdo profissional e consistente — tornando o marketing mais
                simples, rápido e escalável.
              </p>

              {/* Redes Sociais Solicitadas (Instagram, WhatsApp, LinkedIn) */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com/zaiontechbr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1A0F3C] border border-[#3A2A72] flex items-center justify-center text-[#B9B0D6] hover:text-white hover:border-[#B390FA] hover:bg-[#2A1366] transition-all shadow-xs"
                  aria-label="Instagram da Zaion"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://wa.me/5514996661883"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1A0F3C] border border-[#3A2A72] flex items-center justify-center text-[#B9B0D6] hover:text-[#4FD1AE] hover:border-[#4FD1AE] hover:bg-[#103B33] transition-all shadow-xs"
                  aria-label="WhatsApp da Zaion"
                >
                  <WhatsappIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Colunas da Direita: Links Reais da Landing Page */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              {/* Coluna 1: Produto */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-white text-sm tracking-wide">
                  Produto
                </h4>
                <ul className="space-y-2.5 text-[#B9B0D6]">
                  <li>
                    <Link
                      href="#estudio"
                      className="hover:text-white transition-colors"
                    >
                      Estúdio IA
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#problema"
                      className="hover:text-white transition-colors"
                    >
                      Brand Kit & Logo
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#regras"
                      className="hover:text-white transition-colors"
                    >
                      4 Regras Blindadas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#recursos"
                      className="hover:text-white transition-colors"
                    >
                      Ecossistema Integrado
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#como-funciona"
                      className="hover:text-white transition-colors"
                    >
                      Agendador Automático
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Coluna 2: Recursos */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-white text-sm tracking-wide">
                  Recursos
                </h4>
                <ul className="space-y-2.5 text-[#B9B0D6]">
                  <li>
                    <Link
                      href="#como-funciona"
                      className="hover:text-white transition-colors"
                    >
                      Como Funciona
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#metricas"
                      className="hover:text-white transition-colors"
                    >
                      Métricas & Prova
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#faq"
                      className="hover:text-white transition-colors"
                    >
                      Perguntas Frequentes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#faq"
                      className="hover:text-white transition-colors"
                    >
                      Central de Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#problema"
                      className="hover:text-white transition-colors"
                    >
                      Comparador Visual
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Coluna 3: Empresa */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-white text-sm tracking-wide">
                  Empresa
                </h4>
                <ul className="space-y-2.5 text-[#B9B0D6]">
                  <li>
                    <Link
                      href="#hero"
                      className="hover:text-white transition-colors"
                    >
                      Sobre a Zaion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#precos"
                      className="hover:text-white transition-colors"
                    >
                      Planos & Preços
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#experimentar"
                      className="hover:text-white transition-colors"
                    >
                      Demonstração Gratuita
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#4FD1AE] transition-colors flex items-center gap-1"
                    >
                      <span>Suporte WhatsApp</span>
                    </a>
                  </li>
                  <li>
                    <Link
                      href="#experimentar"
                      className="hover:text-white transition-colors"
                    >
                      Fazer Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Linha Inferior com Copyright e Links Legais (Fiel ao Graphy) */}
          <div className="border-t border-[#3A2A72]/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9B0D6]/70">
            <p>© 2026 Zaion Tech. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <Link
                href={routes.terms}
                className="hover:text-white transition-colors"
              >
                Termos de Serviço
              </Link>
              <Link
                href={routes.privacy}
                className="hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              <button
                type="button"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Configurações de Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

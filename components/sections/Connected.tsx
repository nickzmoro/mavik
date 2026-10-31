"use client";

import React from "react";
import {
  Bot,
  Lightbulb,
  Edit3,
  CalendarDays,
  BrainCircuit,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

export function Connected() {
  return (
    <section
      id="recursos"
      data-theme="light"
      className="relative w-full bg-[#EFE8FD] text-[#1B1530] py-24 overflow-hidden"
    >
      {/* Transição suave do Branco da Seção 3 para a Névoa */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-white to-[#EFE8FD] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#5926C8] border border-[#5926C8]/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5926C8]" />
            Ecossistema integrado
          </span>
          <TextGenerateEffect
            words="Tudo o que o seu marketing precisa, conectado."
            className="text-3xl tracking-[-2px] sm:text-4xl lg:text-5xl font-display font-bold text-[#1B1530] leading-tight"
          />
          <p className="mt-4 text-base sm:text-lg text-[#5E5877] max-w-2xl mx-auto leading-relaxed font-sans">
            Sem alternar entre cinco ferramentas diferentes. Da estratégia ao
            agendamento em um fluxo unificado e contínuo.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-6xl mx-auto">
          {/* Card Destaque: Agente que conhece o seu negócio */}
          <BentoGridItem
            featured
            title="Agente que conhece o seu negócio"
            description="Pergunte o que postar e receba o próximo passo, com a sua marca no contexto."
            badge="Destaque Inteligente"
            icon={<Bot className="w-6 h-6 text-[#B390FA]" />}
            header={
              <div className="w-full h-full p-4 rounded-xl bg-[#12092B]/90 border border-[#3A2A72] flex flex-col justify-between text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3A2A72]/60">
                  <span className="text-[#B390FA] font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4FD1AE] animate-pulse" />
                    Agente Zaion Online
                  </span>
                  <span className="text-[10px] text-white/50">
                    Memória de Marca Ativa
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-[#2A1366]/60 border border-[#B390FA]/20 text-[#B9B0D6]">
                    <span className="text-[10px] font-bold text-[#B390FA] block mb-0.5">
                      Sua dúvida:
                    </span>
                    &ldquo;Qual o melhor post para impulsionar as vendas da nova
                    coleção nesta quinta-feira?&rdquo;
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1A0F3C] border border-[#3A2A72] text-white">
                    <span className="text-[10px] font-bold text-[#4FD1AE] block mb-0.5">
                      Resposta do Agente:
                    </span>
                    &ldquo;Com base no seu Brand Kit e no histórico de
                    engajamento do seu público, sugiro um carrossel educativo de
                    4 lâminas contrastando o benefício principal. Já preparei os
                    rascunhos.&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#B9B0D6]">
                    Tom de voz: Estratégico & Acolhedor
                  </span>
                  <span className="text-[#B390FA] font-semibold flex items-center gap-1">
                    Gerar arte agora <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            }
          />

          {/* Card 2: Central de ideias */}
          <BentoGridItem
            title="Central de ideias"
            description="Pautas por objetivo e formato, sempre com o motivo de cada sugestão."
            icon={<Lightbulb className="w-5 h-5 text-[#5926C8]" />}
            badge="Sugestões"
            header={
              <div className="w-full h-full p-3 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] flex flex-col justify-between text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#5926C8]">
                  <span>Pauta Recomendada</span>
                  <span className="text-[10px] bg-[#EFE8FD] px-2 py-0.5 rounded text-[#5926C8]">
                    Carrossel
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1B1530] my-1">
                  &ldquo;Os 3 erros comuns que diminuem a retenção do seu
                  produto&rdquo;
                </p>
                <span className="text-[10px] text-[#5E5877] italic">
                  Motivo: alta tendência nos seus concorrentes diretos esta
                  semana.
                </span>
              </div>
            }
          />

          {/* Card 3: Edição por texto */}
          <BentoGridItem
            title="Edição por texto"
            description="Escreva 'deixe o título maior' e pronto."
            icon={<Edit3 className="w-5 h-5 text-[#5926C8]" />}
            badge="Rapidez"
            header={
              <div className="w-full h-full p-3 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] flex flex-col justify-center space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2DDF0] text-xs text-[#1B1530]">
                  <span className="text-xs text-[#5926C8]">💬</span>
                  <span className="font-mono text-[11px] text-[#5926C8]">
                    &ldquo;Deixe o título maior&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#0E8A6B] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aplicado em 0.4s
                  mantendo o grid
                </div>
              </div>
            }
          />

          {/* Card 4: Plano de 30 dias */}
          <BentoGridItem
            title="Plano de 30 dias"
            description="Um calendário preenchido pela estratégia, não por posts aleatórios."
            icon={<CalendarDays className="w-5 h-5 text-[#5926C8]" />}
            badge="Planejamento"
            header={
              <div className="w-full h-full p-3 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] flex flex-col justify-between">
                <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                  <div className="p-1 rounded bg-[#EFE8FD] font-bold text-[#5926C8]">
                    SEG
                  </div>
                  <div className="p-1 rounded bg-[#EFE8FD] font-bold text-[#5926C8]">
                    TER
                  </div>
                  <div className="p-1 rounded bg-[#EFE8FD] font-bold text-[#5926C8]">
                    QUA
                  </div>
                  <div className="p-1 rounded bg-[#EFE8FD] font-bold text-[#5926C8]">
                    QUI
                  </div>
                  <div className="p-1 rounded bg-[#EFE8FD] font-bold text-[#5926C8]">
                    SEX
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5E5877] pt-2 border-t border-[#E2DDF0]">
                  <span>24 posts estruturados</span>
                  <span className="font-semibold text-[#5926C8]">
                    100% agendados
                  </span>
                </div>
              </div>
            }
          />

          {/* Card 5: Aprende com você */}
          <BentoGridItem
            title="Aprende com você"
            description="Aprovou, recusou, editou? A próxima arte já vem mais a sua cara."
            icon={<BrainCircuit className="w-5 h-5 text-[#5926C8]" />}
            badge="Evolução Contínua"
            header={
              <div className="w-full h-full p-3 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] flex flex-col justify-center space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5E5877]">Ajustes manuais:</span>
                  <span className="font-bold text-[#0E8A6B]">
                    -78% em 2 semanas
                  </span>
                </div>
                <div className="w-full bg-[#E2DDF0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#5926C8] h-full w-[85%]" />
                </div>
                <span className="text-[10px] text-[#5E5877]">
                  Aderência ao estilo pessoal: 94%
                </span>
              </div>
            }
          />

          {/* Card 6: Resultados à vista */}
          <BentoGridItem
            title="Resultados à vista"
            description="Alcance, salvamentos e o que funcionou, em linguagem simples."
            icon={<BarChart3 className="w-5 h-5 text-[#5926C8]" />}
            badge="Métricas Claras"
            header={
              <div className="w-full h-full p-3 rounded-xl bg-[#F8F6FE] border border-[#E2DDF0] flex items-center justify-around text-center">
                <div>
                  <span className="text-lg font-display font-bold text-[#5926C8] block">
                    +142%
                  </span>
                  <span className="text-[10px] text-[#5E5877]">Alcance</span>
                </div>
                <div className="w-px h-8 bg-[#E2DDF0]" />
                <div>
                  <span className="text-lg font-display font-bold text-[#0E8A6B] block">
                    3.4x
                  </span>
                  <span className="text-[10px] text-[#5E5877]">
                    Salvamentos
                  </span>
                </div>
              </div>
            }
          />
        </BentoGrid>

        {/* CTA Chamativo da Seção Recursos */}
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
              className="bg-[#5926C8] text-white hover:bg-[#481EAA] transition-colors py-3 px-8 text-sm font-bold shadow-xl shadow-[#5926C8]/30"
            >
              <span>Conectar canais e testar grátis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>

      {/* Transição suave da Névoa para o Branco da Seção 5 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}

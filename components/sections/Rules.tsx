"use client";

import React from "react";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export function Rules() {
  const content = [
    {
      title: "Logo intocável",
      description:
        "Aplicada a partir do arquivo original. A IA nunca redesenha, nunca mexe.",
      tag: "Regra #01",
      content: (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent">
          <Image
            src="/rule1-image.webp"
            alt="Regra 1: Logo intocável"
            width={1254}
            height={1254}
            priority
            quality={100}
            className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
          />
        </div>
      ),
    },
    {
      title: "Sempre diferente, sempre a sua cara",
      description:
        "Layouts novos a cada criação. Quer padronizar? A IA segue o seu modelo à risca.",
      tag: "Regra #02",
      content: (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent">
          <Image
            src="/rule2-image.webp"
            alt="Regra 2: Sempre diferente, sempre a sua cara"
            width={1254}
            height={1254}
            quality={100}
            className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
          />
        </div>
      ),
    },
    {
      title: "Zero espaço vazio",
      description:
        "Cada arte sai completa, sem buracos em branco no meio do design.",
      tag: "Regra #03",
      content: (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent">
          <Image
            src="/rule3-image.webp"
            alt="Regra 3: Zero espaço vazio"
            width={1254}
            height={1254}
            quality={100}
            className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
          />
        </div>
      ),
    },
    {
      title: "Texto com sentido",
      description:
        "Título, complemento e chamada escritos juntos, a partir do seu objetivo.",
      tag: "Regra #04",
      content: (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent">
          <Image
            src="/rule4-image.webp"
            alt="Regra 4: Texto com sentido"
            width={1254}
            height={1254}
            quality={100}
            className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
          />
        </div>
      ),
    },
  ];

  return (
    <section
      id="regras"
      data-theme="light"
      className="relative w-full bg-white text-[#1B1530]"
    >
      {/* Componente Sticky Scroll Reveal Pinned */}
      <StickyScroll content={content} />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Início");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Detecta se rolou um pouco para ativar o efeito sticky compacto
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // 2. Detecta se o fundo sob o Header é claro ou escuro
      const lightSections = document.querySelectorAll('[data-theme="light"]');
      let onLight = false;
      const headerCheckY = 48; // Posição de verificação vertical do Header

      lightSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerCheckY && rect.bottom >= headerCheckY) {
          onLight = true;
        }
      });

      setIsLightSection(onLight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const navLinks = [
    { label: "Início", href: "#hero" },
    { label: "Estúdio IA", href: "#estudio" },
    { label: "Regras", href: "#regras" },
    { label: "Recursos", href: "#recursos" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Métricas", href: "#metricas" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    setActiveLink(label);
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 border-b border-b-transparent left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "py-2.5 max-w-6xl mx-auto px-4"
          : "pt-4 pb-2 bg-transparent max-w-7xl mx-auto px-4"
      }`}
    >
      <div
        className={`w-full py-2.5 sm:py-3 border border-transparent backdrop-blur-2xl rounded-full px-4 sm:px-6 flex items-center justify-between ${
          isScrolled
            ? isLightSection
              ? "border-[hsla(0,0%,100%,.55)] shadow-[0_26px_60px_-26px_rgba(20,40,70,0.5),inset_0_1.5px_0_hsla(0,0%,100%,0.6)] bg-[hsla(0,0%,100%,.45)]"
              : "border-[hsla(0,0%,100%,.12)]! shadow-[0_26px_60px_-26px_rgba(20,40,70,0.5),inset_0_1.5px_0_hsla(0,0%,100%,0.2)]! bg-[hsla(0,0%,0%,.25)]"
            : "border-b-transparent"
        }`}
      >
        {/* Esquerda: Logo com alternância automática para preservar alto contraste */}
        <Link
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero", "Início")}
          className="flex items-center gap-2.5 group focus:outline-hidden rounded-xl transition-all"
          aria-label="Mavik — Página Inicial"
        >
          {isLightSection ? (
            /* Logo para Fundo Claro: Logo roxa fornecida pelo usuário + Tipografia Sora escura */
            <div className="relative flex items-center justify-center p-1 rounded-xl transition-transform group-hover:scale-105">
              <Image
                src="/mavik-logo-light.webp"
                alt="Mavik Logo"
                width={100}
                height={32}
                priority
                className="h-7 w-auto object-contain select-none"
              />
            </div>
          ) : (
            /* Logo para Fundo Escuro: Logo branca original */
            <div className="relative flex items-center justify-center p-1 rounded-xl transition-transform group-hover:scale-105">
              <Image
                src="/mavik-logo-dark.webp"
                alt="Mavik Logo"
                width={100}
                height={32}
                priority
                className="h-7 w-auto object-contain select-none"
              />
            </div>
          )}
        </Link>

        {/* Centro: Menu em Pílula adaptado ao contraste */}
        <nav
          aria-label="Navegação Principal"
          className="hidden lg:flex items-center gap-0.5 px-1 py-1 rounded-full transition-colors"
        >
          {navLinks.map((item) => {
            const isActive = activeLink === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.label)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? isLightSection
                      ? "text-[#5926C8] bg-white shadow-xs border border-[#E2DDF0]"
                      : "text-[#F4F0FF] bg-[#2A1366] shadow-sm border border-[#B390FA]/30"
                    : isLightSection
                      ? "text-[#5E5877] hover:text-[#1B1530] hover:bg-white/60"
                      : "text-[#B9B0D6] hover:text-[#F4F0FF] hover:bg-[#2A1366]/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Direita: Entrar + Botão CTA com HoverBorderGradient do Aceternity */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/login"
            className={`text-xs font-semibold px-2.5 py-1.5 transition-colors rounded-full ${
              isLightSection
                ? "text-[#5E5877] hover:text-[#1B1530]"
                : "text-[#B9B0D6] hover:text-[#F4F0FF]"
            }`}
          >
            Entrar
          </Link>

          {/* Botão Hover Border Gradient do Aceternity */}
          <Link
            href="#experimentar"
            onClick={(e) => handleNavClick(e, "#experimentar", "Testar grátis")}
            className="inline-block px-2"
          >
            <HoverBorderGradient
              variant={isLightSection ? "light" : "brand"}
              className={
                isLightSection
                  ? "bg-white text-[#5926C8] hover:bg-[#f4f0ff] border border-[#5926C8]/25 font-display font-semibold text-xs py-2 px-4 shadow-sm"
                  : "bg-[#1A0F3C] text-white hover:bg-[#2A1366] font-display font-semibold text-xs py-2 px-4 shadow-md shadow-[#5926C8]/20"
              }
            >
              <span className="tracking-normal!">Testar grátis</span>
            </HoverBorderGradient>
          </Link>
        </div>

        {/* Botão Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="#experimentar"
            onClick={(e) => handleNavClick(e, "#experimentar", "Testar grátis")}
          >
            <HoverBorderGradient
              variant={isLightSection ? "light" : "brand"}
              className="px-3 py-1.5 text-xs font-display font-semibold"
            >
              <span>Testar</span>
            </HoverBorderGradient>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full border transition-colors ${
              isLightSection
                ? "bg-white border-[#E2DDF0] text-[#1B1530]"
                : "bg-[#1A0F3C] border-[#3A2A72] text-[#F4F0FF]"
            }`}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown com Navegação Real */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden mt-2 mx-4 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex flex-col gap-2 ${
            isLightSection
              ? "bg-white/95 border-[#E2DDF0] text-[#1B1530]"
              : "bg-[#1A0F3C]/95 border-[#3A2A72] text-[#F4F0FF]"
          }`}
        >
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.label)}
              className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isLightSection
                  ? "hover:bg-[#F8F6FE] text-[#1B1530]"
                  : "hover:bg-[#2A1366] text-[#F4F0FF]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div
            className={`pt-2 mt-2 border-t flex items-center justify-between ${
              isLightSection ? "border-[#E2DDF0]" : "border-[#3A2A72]"
            }`}
          >
            <Link
              href="#experimentar"
              onClick={(e) => handleNavClick(e, "#experimentar", "Entrar")}
              className={`text-xs font-semibold px-2 py-2 ${
                isLightSection ? "text-[#5E5877]" : "text-[#B9B0D6]"
              }`}
            >
              Entrar
            </Link>
            <Link
              href="#experimentar"
              onClick={(e) =>
                handleNavClick(e, "#experimentar", "Testar grátis")
              }
            >
              <HoverBorderGradient
                variant="brand"
                className="bg-[#5926C8] text-white py-2 px-4 text-xs font-bold"
              >
                <span>Criar conta grátis</span>
              </HoverBorderGradient>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}

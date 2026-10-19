import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mavik — Sua equipe de marketing em um só estúdio com IA",
  description:
    "Crie artes no padrão da sua marca, edite no estúdio visual e agende semanas de conteúdo em minutos. SaaS de marketing com IA de alta precisão.",
  icons: {
    icon: "/mavik-logo-favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-[#12092B] text-[#F4F0FF] antialiased selection:bg-[#B390FA] selection:text-[#1A0F3C]">
        {children}
      </body>
    </html>
  );
}

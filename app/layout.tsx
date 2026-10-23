import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { ReactQueryProvider } from "@/providers/react-query-provider";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mavik.com.br";

export const viewport: Viewport = {
  themeColor: "#12092B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mavik — Sua equipe de marketing em um só estúdio com IA",
    template: "%s | Mavik",
  },
  description:
    "Crie artes com IA no padrão da sua marca, edite no estúdio visual com camadas reais e agende semanas de conteúdo em minutos. Sem logos tortas, sem alucinações visuais.",
  keywords: [
    "marketing com ia",
    "estúdio de criação ia",
    "gerador de posts para instagram",
    "brandbook blindado",
    "artes para redes sociais",
    "automação de marketing",
    "design com inteligência artificial",
    "editor visual em camadas",
    "software de marketing digital",
    "mavik",
    "mavik ia",
  ],
  authors: [{ name: "Mavik", url: siteUrl }],
  creator: "Mavik",
  publisher: "Mavik",
  applicationName: "Mavik",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mavik — Sua equipe de marketing em um só estúdio",
    description:
      "Crie artes no padrão da sua marca, edite no estúdio visual com camadas reais e agende semanas de conteúdo em minutos.",
    url: "/",
    siteName: "Mavik",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Mavik — Crie seu post com IA em segundos no estúdio de marketing visual",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mavik — Sua equipe de marketing em um só estúdio",
    description:
      "Crie artes no padrão da sua marca, edite no estúdio visual com camadas reais e agende semanas de conteúdo em minutos.",
    images: ["/og-image.webp"],
    creator: "@mavik_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/mavik-logo-favicon.webp" },
      { url: "/mavik-logo-favicon.webp", sizes: "32x32", type: "image/webp" },
    ],
    apple: [{ url: "/mavik-logo-favicon.webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Mavik",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/mavik-logo-dark.webp`,
          width: "200",
          height: "60",
        },
        description:
          "Plataforma SaaS de marketing com inteligência artificial para geração e edição de criativos com fidelidade visual absoluta.",
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#webapp`,
        name: "Mavik",
        url: siteUrl,
        applicationCategory: "BusinessApplication, DesignApplication",
        operatingSystem: "All",
        description:
          "Crie artes com IA no padrão da sua marca, edite no estúdio visual com camadas reais e agende semanas de conteúdo em minutos.",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        image: `${siteUrl}/og-image.webp`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          description: "Teste gratuito de 7 dias disponível",
        },
        featureList: [
          "Brandbook 100% blindado com preservação do vetor original",
          "Estúdio visual com camadas reais editáveis",
          "Geração de campanhas estratégicas de 30 dias em 1 clique",
          "Validação automática de acessibilidade e contraste AAA",
          "Agendamento automático para Instagram com aprovação do usuário",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "A IA muda a minha logo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. Ela é aplicada a partir do seu arquivo original preservado, sem qualquer distorção ou redesenho pela IA.",
            },
          },
          {
            "@type": "Question",
            name: "Preciso saber design para usar a Mavik?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. O sistema cuida da hierarquia e das regras de design, mas profissionais possuem controle total para editar cada camada.",
            },
          },
          {
            "@type": "Question",
            name: "Posso editar a arte depois de gerada?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, diretamente no estúdio visual de camadas reais ou solicitando ajustes específicos por comandos de texto.",
            },
          },
          {
            "@type": "Question",
            name: "A ferramenta publica sozinha no Instagram?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nunca sem a sua expressa aprovação. Você revisa e aprova cada publicação antes do disparo.",
            },
          },
          {
            "@type": "Question",
            name: "Em quanto tempo tenho a primeira arte pronta?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Em poucos minutos após o preenchimento do contexto do seu negócio e o upload do Brand Kit.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#12092B] text-[#F4F0FF] antialiased selection:bg-[#B390FA] selection:text-[#1A0F3C]">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mavik — Sua equipe de marketing em um só estúdio",
    short_name: "Mavik",
    description:
      "Crie artes com IA no padrão da sua marca, edite no estúdio visual com camadas reais e agende semanas de conteúdo em minutos.",
    start_url: "/",
    display: "standalone",
    background_color: "#12092B",
    theme_color: "#12092B",
    icons: [
      {
        src: "/mavik-logo-favicon.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}

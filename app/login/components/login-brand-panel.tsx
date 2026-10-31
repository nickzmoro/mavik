import { AuthBrandItem } from "@/components/auth/auth-brand-item";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

import { CalendarCheckIcon, LayersIcon, SparklesIcon } from "./brand-icons";

const features = [
  {
    icon: SparklesIcon,
    title: "Posts com a cara da sua marca",
    description: "Cores, fontes e logo aplicados em cada arte.",
  },
  {
    icon: LayersIcon,
    title: "Edição em camadas",
    description: "Mude texto, imagem e layout sem começar do zero.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Semanas de conteúdo agendadas",
    description: "Você revisa e aprova antes de cada publicação.",
  },
];

export function LoginBrandPanel() {
  return (
    <AuthBrandPanel
      ariaLabel="Sobre a Zaion"
      title="Sua equipe de marketing, sempre pronta."
      description="Crie posts com a cara da sua marca, ajuste cada detalhe e agende semanas de conteúdo em poucos minutos."
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {features.map(({ icon: Icon, title, description }) => (
          <AuthBrandItem
            key={title}
            icon={<Icon size={20} />}
            title={title}
            description={description}
          />
        ))}
      </ul>
    </AuthBrandPanel>
  );
}

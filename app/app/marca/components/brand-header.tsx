import { AppHeaderActions } from "@/components/common/app-header-actions";
import { Badge } from "@/components/ui/badge";

type BrandHeaderProps = {
  versionLabel: string;
};

export function BrandHeader({ versionLabel }: BrandHeaderProps) {
  return (
    <header className="flex flex-wrap items-start gap-4">
      <div className="min-w-0 flex-[1_1_320px]">
        <small className="text-[13px] font-medium text-muted">
          Sua loja · Marca
        </small>
        <h1 className="m-0 mt-1 mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-[28px] leading-[1.15] font-bold sm:text-4xl">
          Marca
          <Badge variant="secondary">{versionLabel}</Badge>
        </h1>
        <p className="m-0 max-w-170 text-[15px] leading-normal text-muted">
          A casa da identidade visual: logos, cores, fontes, estilo, voz e as
          regras que a IA é obrigada a seguir.
        </p>
      </div>
      <div className="flex gap-3">
        <AppHeaderActions />
      </div>
    </header>
  );
}

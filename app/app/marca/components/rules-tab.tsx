import { Plus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { BrandKitData } from "@/lib/brand/brand-kit-data";
import { mockBrandRules } from "@/lib/mocks/brand";

import { ArtRulesCard } from "./art-rules-card";
import { BrandCard, BrandSmallText } from "./brand-card";

type RulesTabProps = {
  initialData: BrandKitData;
  activeRuleIds: string[];
  avoidedColors: { name: string; hex: string }[];
  avoidedElements: string[];
  avoidedStyles: string[];
  bannedWords: string[];
  onToggleRule: (ruleId: string, isActive: boolean) => void;
  onAddRestriction: () => void;
};

function AvoidList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brand-tile flex flex-col gap-2.5 rounded-[18px] px-4.5 py-4">
      <b className="text-sm font-semibold">{title}</b>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function RulesTab({
  initialData,
  activeRuleIds,
  avoidedColors,
  avoidedElements,
  avoidedStyles,
  bannedWords,
  onToggleRule,
  onAddRestriction,
}: RulesTabProps) {
  const activeCount = activeRuleIds.length;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ArtRulesCard initialData={initialData} />

      <BrandCard
        titleId="rules-title"
        title="Regras que a IA segue"
        hint="Tudo o que você define no Brand Kit vira regra. A IA não gera arte que quebre uma regra ativa."
        action={
          <Badge variant={activeCount > 0 ? "success" : "outline"}>
            {activeCount === 1 ? "1 ativa" : `${activeCount} ativas`}
          </Badge>
        }
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {mockBrandRules.map((rule, ruleIndex) => {
            const switchId = `rule-${rule.id}`;

            return (
              <li
                key={rule.id}
                className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-1 py-3.5 text-[15px] ${ruleIndex > 0 ? "border-t border-brand-tile-border" : ""}`}
              >
                <label
                  htmlFor={switchId}
                  className="min-w-0 flex-[1_1_200px] cursor-pointer"
                >
                  {rule.label}
                  <small className="mt-0.5 block text-[13px] text-muted">
                    Vem de {rule.source}
                  </small>
                </label>
                <Badge variant="outline">{rule.source}</Badge>
                <Switch
                  id={switchId}
                  checked={activeRuleIds.includes(rule.id)}
                  onCheckedChange={(isActive) =>
                    onToggleRule(rule.id, isActive)
                  }
                />
              </li>
            );
          })}
        </ul>
      </BrandCard>

      <BrandCard
        titleId="avoid-title"
        title="O que evitar"
        hint="Cores, elementos, estilos e termos proibidos viram restrições obrigatórias."
        action={
          <Button variant="outline" onClick={onAddRestriction}>
            <Plus aria-hidden="true" className="size-4.5" />
            Adicionar restrição
          </Button>
        }
      >
        <div className="grid gap-3.5 sm:grid-cols-2">
          <AvoidList title="Cores">
            {avoidedColors.map((color) => (
              <span
                key={color.hex}
                title={color.name}
                aria-label={color.name}
                role="img"
                className="relative inline-block size-7 rounded-full border border-brand-tile-border after:absolute after:-inset-x-0.5 after:top-3.25 after:h-0.5 after:-rotate-45 after:bg-danger"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <BrandSmallText>
              {avoidedColors.map((color) => color.name).join(", ")}
            </BrandSmallText>
          </AvoidList>
          <AvoidList title="Elementos">
            {avoidedElements.map((element) => (
              <Badge key={element} variant="outline">
                {element}
              </Badge>
            ))}
          </AvoidList>
          <AvoidList title="Estilos">
            {avoidedStyles.map((style) => (
              <Badge key={style} variant="outline">
                {style}
              </Badge>
            ))}
          </AvoidList>
          <AvoidList title="Termos">
            {bannedWords.map((word) => (
              <Badge key={word} variant="destructive">
                {word}
              </Badge>
            ))}
          </AvoidList>
        </div>
      </BrandCard>

      <Alert variant="success">
        <AlertTitle>Seu segmento não tem regras especiais</AlertTitle>
        <AlertDescription>
          Cafeterias não entram em setores regulados como saúde, jurídico ou
          finanças. Se o segmento mudar, avisamos.
        </AlertDescription>
      </Alert>
    </div>
  );
}

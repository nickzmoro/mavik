"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDeleteBrandArtRule } from "@/hooks/mutations/use-delete-brand-art-rule";
import { useSaveBrandArtRule } from "@/hooks/mutations/use-save-brand-art-rule";
import { useBrandKitData } from "@/hooks/queries/use-brand-kit-data";
import type { ArtRule, BrandKitData } from "@/lib/brand/brand-kit-data";
import { useToast } from "@/providers/toast-provider";

import { ArtRuleDialog } from "./art-rule-dialog";
import { BrandCard, BrandSmallText } from "./brand-card";

type ArtRulesCardProps = {
  initialData: BrandKitData;
};

type DialogState = { isOpen: boolean; artRule: ArtRule | null };

export function ArtRulesCard({ initialData }: ArtRulesCardProps) {
  const { showToast } = useToast();
  const { data: brandKitData } = useBrandKitData(initialData);
  const saveArtRule = useSaveBrandArtRule();
  const deleteArtRule = useDeleteBrandArtRule();
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    artRule: null,
  });
  const artRules = brandKitData?.artRules ?? initialData.artRules;
  const activeCount = artRules.filter((artRule) => artRule.isActive).length;

  const showFailure = (
    result: Awaited<ReturnType<typeof saveArtRule.mutateAsync>>,
  ) => {
    if (!result.isSuccess) {
      showToast(result.errorMessage);
    }

    return result.isSuccess;
  };

  const handleSave = async (rule: string) => {
    const isSaved = showFailure(
      await saveArtRule.mutateAsync({
        id: dialog.artRule?.id,
        rule,
        isActive: dialog.artRule?.isActive ?? true,
      }),
    );

    if (isSaved) {
      setDialog({ isOpen: false, artRule: null });
      showToast("Regra salva");
    }
  };

  const handleToggle = async (artRule: ArtRule, isActive: boolean) =>
    showFailure(
      await saveArtRule.mutateAsync({
        id: artRule.id,
        rule: artRule.rule,
        isActive,
      }),
    );

  const handleDelete = async (artRule: ArtRule) => {
    if (showFailure(await deleteArtRule.mutateAsync({ id: artRule.id }))) {
      showToast("Regra removida");
    }
  };

  return (
    <BrandCard
      titleId="art-rules-title"
      title="Regras de direção de arte"
      hint="Regras de estilo só da sua marca. Elas têm prioridade sobre o estilo padrão e só perdem para o que você pedir em um post específico."
      action={
        <div className="flex items-center gap-3">
          <Badge variant={activeCount > 0 ? "success" : "outline"}>
            {activeCount === 1 ? "1 ativa" : `${activeCount} ativas`}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setDialog({ isOpen: true, artRule: null })}
          >
            <Plus aria-hidden="true" className="size-4.5" />
            Adicionar regra
          </Button>
        </div>
      }
    >
      {artRules.length > 0 ? (
        <ul className="m-0 flex list-none flex-col p-0">
          {artRules.map((artRule, ruleIndex) => {
            const switchId = `art-rule-${artRule.id}`;

            return (
              <li
                key={artRule.id}
                className={`flex items-center gap-3 px-1 py-3.5 text-[15px] ${ruleIndex > 0 ? "border-t border-brand-tile-border" : ""}`}
              >
                <label
                  htmlFor={switchId}
                  className={`min-w-0 flex-1 cursor-pointer break-words ${artRule.isActive ? "" : "text-muted"}`}
                >
                  {artRule.rule}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Editar regra"
                  onClick={() => setDialog({ isOpen: true, artRule })}
                >
                  <Pencil aria-hidden="true" className="size-4.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remover regra"
                  disabled={deleteArtRule.isPending}
                  onClick={() => handleDelete(artRule)}
                >
                  <Trash2 aria-hidden="true" className="size-4.5" />
                </Button>
                <Switch
                  id={switchId}
                  aria-label={
                    artRule.isActive ? "Desativar regra" : "Ativar regra"
                  }
                  checked={artRule.isActive}
                  disabled={saveArtRule.isPending}
                  onCheckedChange={(isActive) =>
                    handleToggle(artRule, isActive)
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <BrandSmallText>
          Nenhuma regra ainda. Ex.: &quot;Ícone sempre em laranja ou azul,
          alternando entre os posts&quot;.
        </BrandSmallText>
      )}
      <BrandSmallText>
        Para mostrar à IA posts aprovados como referência, envie-os na aba
        Estilo, em &quot;Exemplos aprovados&quot;.
      </BrandSmallText>
      <ArtRuleDialog
        isOpen={dialog.isOpen}
        initialRule={dialog.artRule?.rule}
        isSaving={saveArtRule.isPending}
        onOpenChange={(isOpen) =>
          setDialog((currentDialog) => ({ ...currentDialog, isOpen }))
        }
        onSave={handleSave}
      />
    </BrandCard>
  );
}

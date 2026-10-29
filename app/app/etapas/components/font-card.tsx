"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FontSource } from "@/lib/onboarding/constants";

import {
  getFontFamilyStyle,
  useGoogleFontStatus,
} from "../hooks/use-google-font-status";
import { FontDialog } from "./font-dialog";

type FontCardProps = {
  label: string;
  requirement: "Obrigatório" | "Opcional";
  emptyDescription?: string;
  value: string;
  defaultValue?: string;
  onChange: (fontName: string) => void;
  onSourceResolved: (source: FontSource) => void;
};

export function FontCard({
  label,
  requirement,
  emptyDescription,
  value,
  defaultValue,
  onChange,
  onSourceResolved,
}: FontCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const status = useGoogleFontStatus(value);
  const handleSourceResolved = useEffectEvent(onSourceResolved);

  useEffect(() => {
    if (status === "google" || status === "nome") {
      handleSourceResolved(status);
    }
  }, [status]);

  const hasValue = Boolean(value);
  const isDefault = hasValue && value === defaultValue;

  return (
    <div className="tile flex flex-col gap-3 rounded-(--r-lg) p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-sm font-semibold">{label}</span>
        <div className="flex gap-1.5">
          {isDefault ? <Badge variant="outline">Padrão</Badge> : null}
          <Badge variant={requirement === "Obrigatório" ? "secondary" : "outline"}>
            {requirement}
          </Badge>
        </div>
      </div>

      {hasValue ? (
        <div className="flex flex-col gap-0.5">
          <span
            className="text-3xl leading-[1.2]"
            style={{ fontFamily: getFontFamilyStyle(value, status) }}
          >
            Aa Çã É
          </span>
          <span className="text-[13px] leading-[1.4] text-muted">
            {value} ·{" "}
            {status === "google"
              ? "Google Fonts"
              : status === "nome"
                ? "só pelo nome, sem prévia"
                : "verificando…"}
          </span>
        </div>
      ) : (
        <p className="m-0 text-sm leading-normal text-muted">
          {emptyDescription}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus aria-hidden="true" className="size-4" />
          {isDefault || !hasValue ? "Adicionar" : "Trocar"}
        </Button>
        {requirement === "Opcional" && hasValue ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Remover
          </Button>
        ) : null}
      </div>

      <FontDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={`Fonte de ${label.toLowerCase()}`}
        initialValue={isDefault ? "" : value}
        onConfirm={(fontName) => {
          onChange(fontName);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}

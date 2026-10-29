"use client";

import { Plus } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  imageStyles,
  type ImageStyle,
  type StyleReference,
} from "@/lib/mocks/brand";
import { cn } from "@/lib/utils";

import { BrandCard, BrandSmallText } from "./brand-card";
import { StylePreview } from "./style-preview";

type StyleTabProps = {
  imageStyle: ImageStyle | null;
  references: StyleReference[];
  onImageStyleChange: (style: ImageStyle) => void;
  onAddReference: (file: File) => void;
  onRemoveReference: (referenceId: string) => void;
};

export function StyleTab({
  imageStyle,
  references,
  onImageStyleChange,
  onAddReference,
  onRemoveReference,
}: StyleTabProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="image-style-title"
        title="Estilo de imagem"
        hint="Sugerido a partir do seu Instagram. A IA segue este estilo em todas as artes."
        action={<Badge variant="warning">Recomendado</Badge>}
      >
        <RadioGroup
          aria-labelledby="image-style-title"
          value={imageStyle ?? ""}
          onValueChange={(value) => onImageStyleChange(value as ImageStyle)}
          className="grid-cols-[repeat(auto-fill,minmax(min(150px,100%),1fr))] gap-3.5"
        >
          {imageStyles.map((style) => {
            const itemId = `image-style-${style.value}`;
            const isSelected = style.value === imageStyle;

            return (
              <label
                key={style.value}
                htmlFor={itemId}
                className={cn(
                  "brand-tile flex cursor-pointer flex-col gap-2.5 rounded-[18px] p-3 text-[15px] font-medium transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus motion-reduce:transition-none",
                  isSelected && "border-primary bg-brand-selected",
                )}
              >
                <StylePreview style={style.value} />
                <span className="flex items-center gap-2.5">
                  <RadioGroupItem
                    id={itemId}
                    value={style.value}
                    className="focus-visible:outline-none"
                  />
                  {style.label}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </BrandCard>

      <BrandCard
        titleId="references-title"
        title="Exemplos aprovados"
        hint="Referências que mostram o seu estilo. A IA usa como guia, não copia."
        action={
          <FileUploadButton
            accept="image/jpeg,image/png,image/webp"
            variant="outline"
            onFileSelected={onAddReference}
          >
            <Plus aria-hidden="true" className="size-4.5" />
            Adicionar referência
          </FileUploadButton>
        }
      >
        {references.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(140px,100%),1fr))] gap-3.5">
            {references.map((reference) => (
              <div
                key={reference.id}
                className="flex min-w-0 flex-col gap-2 text-[13px] text-muted"
              >
                <div className="relative h-37.5 overflow-hidden rounded-(--r-md)">
                  <Image
                    src={reference.imageUrl}
                    alt={`Referência enviada: ${reference.caption}`}
                    fill
                    unoptimized
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <span className="truncate">{reference.caption}</span>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Remover referência ${reference.caption}`}
                    onClick={() => onRemoveReference(reference.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <BrandSmallText>
            Nenhuma referência ainda. Adicione posts que mostram o seu estilo.
          </BrandSmallText>
        )}
      </BrandCard>
    </div>
  );
}

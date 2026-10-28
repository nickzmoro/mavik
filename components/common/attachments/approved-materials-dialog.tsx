"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { PostArtThumbnail } from "@/components/common/post-art-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockApprovedMaterials,
  type ApprovedMaterial,
} from "@/lib/mocks/agent";
import { cn } from "@/lib/utils";

type ApprovedMaterialsDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedMaterialIds: string[];
  onConfirm: (materials: ApprovedMaterial[]) => void;
  description: string;
};

function ApprovedMaterialsPicker({
  selectedMaterialIds,
  onConfirm,
}: Pick<ApprovedMaterialsDialogProps, "selectedMaterialIds" | "onConfirm">) {
  const [selectedIds, setSelectedIds] = useState(selectedMaterialIds);

  const toggleMaterial = (materialId: string) =>
    setSelectedIds((currentIds) =>
      currentIds.includes(materialId)
        ? currentIds.filter((currentId) => currentId !== materialId)
        : [...currentIds, materialId],
    );

  const handleConfirm = () =>
    onConfirm(
      mockApprovedMaterials.filter((material) =>
        selectedIds.includes(material.id),
      ),
    );

  const selectedCount = selectedIds.length;

  return (
    <>
      <ul className="scrollbar-subtle m-0 grid min-h-0 flex-1 list-none grid-cols-3 gap-3 overflow-y-auto px-5 pt-4 pb-2 sm:grid-cols-4 sm:px-7">
        {mockApprovedMaterials.map((material) => {
          const isSelected = selectedIds.includes(material.id);

          return (
            <li key={material.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleMaterial(material.id)}
                className="group flex w-full cursor-pointer flex-col gap-1.5 rounded-[14px] border-0 bg-transparent p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className="relative block">
                  <PostArtThumbnail
                    art={material.art}
                    label={`Material aprovado: ${material.title}`}
                    className={cn(
                      "outline-2 outline-offset-2 outline-transparent transition-[outline-color] duration-150 group-hover:outline-accent motion-reduce:transition-none",
                      isSelected &&
                        "outline-primary group-hover:outline-primary",
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white transition-colors duration-150 motion-reduce:transition-none",
                      isSelected
                        ? "bg-primary text-on-primary"
                        : "bg-black/25 text-transparent",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                </span>
                <span className="truncate px-0.5 text-xs leading-[1.4] font-medium text-text">
                  {material.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <DialogFooter className="justify-between">
        <span className="text-[13px] leading-[1.4] text-muted">
          {selectedCount === 1
            ? "1 selecionado"
            : `${selectedCount} selecionados`}
        </span>
        <div className="flex flex-wrap gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Anexar materiais</Button>
        </div>
      </DialogFooter>
    </>
  );
}

export function ApprovedMaterialsDialog({
  open,
  onOpenChange,
  selectedMaterialIds,
  onConfirm,
  description,
}: ApprovedMaterialsDialogProps) {
  const handleConfirm = (materials: ApprovedMaterial[]) => {
    onConfirm(materials);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-170">
        <DialogHeader>
          <DialogTitle>Materiais aprovados</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ApprovedMaterialsPicker
          selectedMaterialIds={selectedMaterialIds}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
}

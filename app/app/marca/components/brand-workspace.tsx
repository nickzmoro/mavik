"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  brandTabs,
  mockBrandVersions,
  type BrandColor,
  type BrandTab,
  type FontRole,
  type LogoSlotId,
  type Persona,
} from "@/lib/mocks/brand";
import { useToast } from "@/providers/toast-provider";

import { useBrandKit } from "../hooks/use-brand-kit";
import { BrandHeader } from "./brand-header";
import { BrandSideColumn } from "./brand-side-column";
import { ColorDialog } from "./color-dialog";
import { ColorsTab } from "./colors-tab";
import { FontUploadDialog } from "./font-upload-dialog";
import { FontsTab } from "./fonts-tab";
import { LayoutsTab } from "./layouts-tab";
import { LogosTab } from "./logos-tab";
import { PersonaDialog } from "./persona-dialog";
import { RestrictionDialog } from "./restriction-dialog";
import { RulesTab } from "./rules-tab";
import { StyleTab } from "./style-tab";
import { TagDialog, type TagDialogConfig } from "./tag-dialog";
import { VoiceTab } from "./voice-tab";

type TagTarget = "loved" | "banned";

const tagDialogConfigs: Record<TagTarget, TagDialogConfig> = {
  loved: {
    title: "Palavra que amamos",
    description: "A IA usa estas palavras com frequência nas legendas.",
    label: "Palavra ou expressão",
    placeholder: "Ex.: fresquinho",
  },
  banned: {
    title: "Termo proibido",
    description: "A IA nunca usa estes termos em textos ou artes.",
    label: "Termo",
    placeholder: "Ex.: promoção imperdível",
  },
};

export function BrandWorkspace() {
  const { showToast } = useToast();
  const brandKit = useBrandKit();
  const [activeTab, setActiveTab] = useState<BrandTab>("logos");
  const [colorDialog, setColorDialog] = useState<{
    isOpen: boolean;
    color: BrandColor | null;
  }>({ isOpen: false, color: null });
  const [fontDialogRole, setFontDialogRole] = useState<FontRole | null>(null);
  const [tagTarget, setTagTarget] = useState<TagTarget | null>(null);
  const [personaDialog, setPersonaDialog] = useState<{
    isOpen: boolean;
    persona: Persona | null;
  }>({ isOpen: false, persona: null });
  const [isRestrictionDialogOpen, setIsRestrictionDialogOpen] = useState(false);

  const currentVersion =
    mockBrandVersions.find(
      (version) => version.id === brandKit.currentVersionId,
    ) ?? mockBrandVersions[0];
  const hasHighlightFont = brandKit.fonts.some(
    (font) => font.role === "Destaque",
  );

  const showUploadResult = (
    result: { isSuccess: true } | { isSuccess: false; error: string },
    successMessage: string,
  ) => showToast(result.isSuccess ? successMessage : result.error);

  const handleUploadLogo = async (slotId: LogoSlotId, file: File) =>
    showUploadResult(
      await brandKit.uploadLogo(slotId, file),
      "Logo enviada e validada",
    );

  const handleSaveColor = (name: string, hex: string) => {
    if (colorDialog.color) {
      brandKit.updateColor(colorDialog.color.id, name, hex);
      showToast(`${colorDialog.color.roleLabel} atualizada`);
    } else {
      brandKit.addColor(name, hex);
      showToast(`Cor adicionada: ${name}`);
    }

    setColorDialog({ isOpen: false, color: null });
  };

  const handleUploadFont = async (role: FontRole, file: File) => {
    await brandKit.uploadFont(role, file);
    setFontDialogRole(null);
    showToast(`Fonte de ${role.toLowerCase()} atualizada`);
  };

  const handleAddTag = (value: string) => {
    if (tagTarget === "loved") {
      brandKit.addLovedWord(value);
    } else {
      brandKit.addBannedWord(value);
    }

    setTagTarget(null);
    showToast(`Adicionado: ${value}`);
  };

  const handleSavePersona = (persona: Persona) => {
    brandKit.savePersona(persona);
    setPersonaDialog({ isOpen: false, persona: null });
    showToast(`Persona salva: ${persona.name}`);
  };

  return (
    <>
      <BrandHeader
        versionLabel={`Brand Kit ${currentVersion.label} · atualizado ${currentVersion.date}`}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as BrandTab)}
        className="flex flex-col gap-6"
      >
        <TabsList aria-label="Seções da marca">
          {brandTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <TabsContent value="logos">
              <LogosTab
                uploadedLogos={brandKit.uploadedLogos}
                onUploadLogo={handleUploadLogo}
              />
            </TabsContent>
            <TabsContent value="colors">
              <ColorsTab
                palette={brandKit.palette}
                onEditColor={(color) => setColorDialog({ isOpen: true, color })}
                onAddColor={() => setColorDialog({ isOpen: true, color: null })}
              />
            </TabsContent>
            <TabsContent value="fonts">
              <FontsTab
                fonts={brandKit.fonts}
                onUploadFont={setFontDialogRole}
              />
            </TabsContent>
            <TabsContent value="style">
              <StyleTab
                imageStyle={brandKit.imageStyle}
                references={brandKit.references}
                onImageStyleChange={brandKit.setImageStyle}
                onAddReference={(file) =>
                  showUploadResult(
                    brandKit.addReference(file),
                    "Referência adicionada",
                  )
                }
              />
            </TabsContent>
            <TabsContent value="layouts">
              <LayoutsTab
                layoutModes={brandKit.layoutModes}
                postImage={brandKit.layoutPostImage}
                savedLayouts={brandKit.savedLayouts}
                onToggleMode={brandKit.toggleLayoutMode}
                onUploadPost={(file) =>
                  showUploadResult(
                    brandKit.uploadLayoutPost(file),
                    "Post enviado. Revise o que a IA entendeu.",
                  )
                }
                onSave={(summary) => {
                  brandKit.saveLayout(summary);
                  showToast("Layout de marca salvo");
                }}
                onDiscard={() => {
                  brandKit.resetLayoutEditor();
                  showToast("Alterações descartadas");
                }}
              />
            </TabsContent>
            <TabsContent value="voice">
              <VoiceTab
                sliders={brandKit.voiceSliders}
                lovedWords={brandKit.lovedWords}
                bannedWords={brandKit.bannedWords}
                personas={brandKit.personas}
                onSliderChange={brandKit.updateVoiceSlider}
                onConfirmTone={() => showToast("Tom de voz confirmado")}
                onAdjustTone={() =>
                  showToast("Mexa nas réguas e a IA reescreve o exemplo")
                }
                onAddLovedWord={() => setTagTarget("loved")}
                onAddBannedWord={() => setTagTarget("banned")}
                onEditPersona={(persona) =>
                  setPersonaDialog({ isOpen: true, persona })
                }
              />
            </TabsContent>
            <TabsContent value="rules">
              <RulesTab
                activeRuleIds={brandKit.activeRuleIds}
                avoidedColors={brandKit.avoidedColors}
                avoidedElements={brandKit.avoidedElements}
                avoidedStyles={brandKit.avoidedStyles}
                bannedWords={brandKit.bannedWords}
                onToggleRule={brandKit.toggleRule}
                onAddRestriction={() => setIsRestrictionDialogOpen(true)}
              />
            </TabsContent>
          </div>

          <BrandSideColumn
            palette={brandKit.palette}
            hasHighlightFont={hasHighlightFont}
            currentVersionId={brandKit.currentVersionId}
            onCompleteBrand={() => {
              setActiveTab("fonts");
              setFontDialogRole("Destaque");
            }}
            onRestoreVersion={(versionId) => {
              brandKit.setCurrentVersionId(versionId);
              showToast(`Brand Kit ${versionId} restaurado`);
            }}
          />
        </div>
      </Tabs>

      <ColorDialog
        open={colorDialog.isOpen}
        onOpenChange={(isOpen) =>
          setColorDialog((current) => ({ ...current, isOpen }))
        }
        color={colorDialog.color}
        onSave={handleSaveColor}
      />
      <FontUploadDialog
        open={fontDialogRole !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFontDialogRole(null);
          }
        }}
        initialRole={fontDialogRole ?? "Títulos"}
        onUpload={handleUploadFont}
      />
      <TagDialog
        config={tagTarget ? tagDialogConfigs[tagTarget] : null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setTagTarget(null);
          }
        }}
        onAdd={handleAddTag}
      />
      <PersonaDialog
        open={personaDialog.isOpen}
        onOpenChange={(isOpen) =>
          setPersonaDialog((current) => ({ ...current, isOpen }))
        }
        persona={personaDialog.persona}
        onSave={handleSavePersona}
      />
      <RestrictionDialog
        open={isRestrictionDialogOpen}
        onOpenChange={setIsRestrictionDialogOpen}
        onAdd={(type, value, hex) => {
          brandKit.addRestriction(type, value, hex);
          setIsRestrictionDialogOpen(false);
          showToast(`Restrição adicionada: ${value}`);
        }}
      />
    </>
  );
}

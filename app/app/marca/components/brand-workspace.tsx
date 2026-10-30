"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBrandSteps, type BrandKitData } from "@/lib/brand/brand-kit-data";
import type { InstagramConnection } from "@/lib/instagram/accounts";
import type { InstagramConnectResult } from "@/lib/routes";
import {
  brandTabs,
  type BrandColor,
  type BrandTab,
  type FontRole,
  type LogoSlotId,
  type Persona,
} from "@/lib/mocks/brand";
import { useToast } from "@/providers/toast-provider";

import { useBrandKit, type SaveStatus } from "../hooks/use-brand-kit";
import { getVoiceToneLabel } from "@/lib/brand/voice-sample";
import { BrandHeader } from "./brand-header";
import { BrandSideColumn } from "./brand-side-column";
import { ColorDialog } from "./color-dialog";
import { ColorsTab } from "./colors-tab";
import { FontUploadDialog } from "./font-upload-dialog";
import { FontsTab } from "./fonts-tab";
import { InstagramConnectionCard } from "./instagram-connection-card";
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

const saveStatusLabels: Record<SaveStatus, string> = {
  idle: "Salvo na sua conta",
  saving: "Salvando…",
  saved: "Salvo na sua conta",
  error: "Não foi possível salvar",
};

type BrandWorkspaceProps = {
  initialData: BrandKitData;
  initialTab: BrandTab;
  instagramConnection: InstagramConnection | null;
  instagramResult?: InstagramConnectResult;
};

export function BrandWorkspace({
  initialData,
  initialTab,
  instagramConnection,
  instagramResult,
}: BrandWorkspaceProps) {
  const { showToast } = useToast();
  const brandKit = useBrandKit(initialData);
  const [activeTab, setActiveTab] = useState<BrandTab>(initialTab);
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

  const mainLogoUrl =
    brandKit.uploadedLogos.symbol?.url ?? brandKit.uploadedLogos.light?.url;
  const brandSteps = getBrandSteps({
    logos: brandKit.uploadedLogos,
    palette: brandKit.palette,
    references: brandKit.references,
    layouts: brandKit.savedLayouts,
    lovedWords: brandKit.lovedWords,
    personas: brandKit.personas,
  });

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
      <BrandHeader versionLabel={saveStatusLabels[brandKit.saveStatus]} />

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
                onRemoveLogo={(slotId) => {
                  brandKit.removeLogo(slotId);
                  showToast("Logo removida");
                }}
              />
            </TabsContent>
            <TabsContent value="colors">
              <ColorsTab
                palette={brandKit.palette}
                onEditColor={(color) => setColorDialog({ isOpen: true, color })}
                onAddColor={() => setColorDialog({ isOpen: true, color: null })}
                onRemoveColor={(colorId) => {
                  brandKit.removeColor(colorId);
                  showToast("Cor removida");
                }}
              />
            </TabsContent>
            <TabsContent value="fonts">
              <FontsTab
                fonts={brandKit.fonts}
                onUploadFont={setFontDialogRole}
                onRemoveFont={(role) => {
                  brandKit.removeFont(role);
                  showToast(
                    role === "Destaque"
                      ? "Fonte de destaque removida"
                      : `Fonte de ${role.toLowerCase()} voltou ao padrão`,
                  );
                }}
              />
            </TabsContent>
            <TabsContent value="style">
              <StyleTab
                imageStyle={brandKit.imageStyle}
                references={brandKit.references}
                storyReferences={brandKit.storyReferences}
                onImageStyleChange={brandKit.setImageStyle}
                onAddReference={async (file, kind) =>
                  showUploadResult(
                    await brandKit.addReference(file, kind),
                    "Referência adicionada",
                  )
                }
                onRemoveReference={(referenceId, kind) => {
                  brandKit.removeReference(referenceId, kind);
                  showToast("Referência removida");
                }}
              />
            </TabsContent>
            <TabsContent value="layouts">
              <LayoutsTab
                palette={brandKit.palette}
                logoUrl={mainLogoUrl}
                layoutModes={brandKit.layoutModes}
                layoutFormat={brandKit.layoutFormat}
                onChangeFormat={brandKit.changeLayoutFormat}
                postImage={brandKit.layoutPostImage}
                savedLayouts={brandKit.savedLayouts}
                editingLayoutId={brandKit.editingLayoutId}
                onToggleMode={brandKit.toggleLayoutMode}
                onUploadPost={async (file) =>
                  showUploadResult(
                    await brandKit.uploadLayoutPost(file),
                    "Post enviado. Revise o que a IA entendeu.",
                  )
                }
                onSave={() => {
                  brandKit.saveLayout();
                  showToast("Layout de marca salvo");
                }}
                onDiscard={brandKit.resetLayoutEditor}
                onOpenLayout={brandKit.openLayout}
                onRemoveLayout={(layoutId) => {
                  brandKit.removeLayout(layoutId);
                  showToast("Layout removido");
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
                onRemoveLovedWord={brandKit.removeLovedWord}
                onRemoveBannedWord={brandKit.removeBannedWord}
                onEditPersona={(persona) =>
                  setPersonaDialog({ isOpen: true, persona })
                }
                onRemovePersona={(personaId) => {
                  brandKit.removePersona(personaId);
                  showToast("Persona removida");
                }}
              />
            </TabsContent>
            <TabsContent value="rules">
              <RulesTab
                initialData={initialData}
                activeRuleIds={brandKit.activeRuleIds}
                avoidedColors={brandKit.avoidedColors}
                avoidedElements={brandKit.avoidedElements}
                avoidedStyles={brandKit.avoidedStyles}
                bannedWords={brandKit.bannedWords}
                onToggleRule={brandKit.toggleRule}
                onAddRestriction={() => setIsRestrictionDialogOpen(true)}
              />
            </TabsContent>
            <TabsContent value="connections">
              <InstagramConnectionCard
                connection={instagramConnection}
                result={instagramResult}
              />
            </TabsContent>
          </div>

          <BrandSideColumn
            palette={brandKit.palette}
            logoUrl={mainLogoUrl}
            toneLabel={getVoiceToneLabel(brandKit.voiceSliders)}
            steps={brandSteps}
            currentVersionId={brandKit.currentVersionId}
            onCompleteBrand={setActiveTab}
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

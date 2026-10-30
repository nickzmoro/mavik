"use client";

import { useEffect, useRef, useState } from "react";

import type { SaveBrandKitInput } from "@/actions/save-brand-kit/schema";
import type { BrandAssetKind } from "@/actions/upload-brand-asset/schema";
import { useDeleteBrandAsset } from "@/hooks/mutations/use-delete-brand-asset";
import { useSaveBrandKit } from "@/hooks/mutations/use-save-brand-kit";
import { useUploadBrandAsset } from "@/hooks/mutations/use-upload-brand-asset";
import {
  getUploadedFontFamily,
  logoAssetKinds,
  type AvoidedColor,
  type BrandFile,
  type BrandKitData,
} from "@/lib/brand/brand-kit-data";
import {
  defaultBrandFonts,
  emptyLayoutModes,
  fontSamples,
  mockBrandVersions,
  voiceSliders as defaultVoiceSliders,
  type BrandColor,
  type BrandFont,
  type FontRole,
  type ImageStyle,
  type LayoutElementId,
  type LayoutFormat,
  type LayoutModes,
  type LogoSlotId,
  type Persona,
  type RestrictionType,
  type SavedLayout,
  type StyleReference,
} from "@/lib/mocks/brand";

import { getVoiceSample, getVoiceToneLabel } from "@/lib/brand/voice-sample";

export type UploadedFile = BrandFile;

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const maxImageSizeInBytes = 5 * 1024 * 1024;
const minimumLogoWidth = 1000;
const logoTypes = ["image/svg+xml", "image/png"];
const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const autosaveDelayInMs = 800;
const connectionErrorMessage =
  "Não conseguimos salvar agora. Confira sua internet e tente de novo.";

type UploadResult = { isSuccess: true } | { isSuccess: false; error: string };

export type ReferenceKind = Extract<BrandAssetKind, "post_bom" | "story_bom">;

const getImageWidth = async (file: File) => {
  const imageBitmap = await createImageBitmap(file);
  const imageWidth = imageBitmap.width;

  imageBitmap.close();

  return imageWidth;
};

const removeExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, "");

const formatFontName = (fileName: string) =>
  removeExtension(fileName)
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

const getFontFaceName = (assetId: string) => `brand-font-${assetId}`;

const buildSavePayload = (state: {
  palette: BrandColor[];
  fonts: BrandFont[];
  imageStyle: ImageStyle | null;
  savedLayouts: SavedLayout[];
  voiceSliders: typeof defaultVoiceSliders;
  lovedWords: string[];
  bannedWords: string[];
  personas: Persona[];
  activeRuleIds: string[];
  avoidedColors: AvoidedColor[];
  avoidedElements: string[];
  avoidedStyles: string[];
}): SaveBrandKitInput => {
  const voiceValue = (sliderId: string) =>
    state.voiceSliders.find((slider) => slider.id === sliderId)?.value ?? 50;

  return {
    palette: state.palette.map(({ role, name, hex }) => ({ role, name, hex })),
    fonts: state.fonts.map(({ role, displayName, assetId }) => ({
      role,
      family: displayName,
      assetId,
    })),
    imageStyle: state.imageStyle,
    layouts: state.savedLayouts.map(
      ({ id, name, format, layoutModes, sourceAssetId }) => ({
        id,
        name,
        format,
        layoutModes,
        sourceAssetId,
      }),
    ),
    voice: {
      formality: voiceValue("formality"),
      humor: voiceValue("humor"),
      complexity: voiceValue("complexity"),
      intent: voiceValue("intent"),
      toneLabel: getVoiceToneLabel(state.voiceSliders),
      sampleCaption: getVoiceSample(state.voiceSliders),
    },
    lovedWords: state.lovedWords,
    bannedWords: state.bannedWords,
    personas: state.personas,
    activeRuleIds: state.activeRuleIds,
    avoidedColors: state.avoidedColors,
    avoidedElements: state.avoidedElements,
    avoidedStyles: state.avoidedStyles,
  };
};

export function useBrandKit(initialData: BrandKitData) {
  const uploadBrandAssetMutation = useUploadBrandAsset();
  const deleteBrandAssetMutation = useDeleteBrandAsset();
  const saveBrandKitMutation = useSaveBrandKit();
  const [uploadedLogos, setUploadedLogos] = useState<
    Partial<Record<LogoSlotId, UploadedFile>>
  >(initialData.logos);
  const [palette, setPalette] = useState<BrandColor[]>(initialData.palette);
  const [fonts, setFonts] = useState<BrandFont[]>(initialData.fonts);
  const [imageStyle, setImageStyle] = useState<ImageStyle | null>(
    initialData.imageStyle,
  );
  const [references, setReferences] = useState<StyleReference[]>(
    initialData.references,
  );
  const [storyReferences, setStoryReferences] = useState<StyleReference[]>(
    initialData.storyReferences,
  );
  const referenceSetters = {
    post_bom: setReferences,
    story_bom: setStoryReferences,
  } satisfies Record<ReferenceKind, unknown>;
  const [layoutModes, setLayoutModes] = useState<LayoutModes>(emptyLayoutModes);
  const [layoutFormat, setLayoutFormat] = useState<LayoutFormat>("post");
  const [layoutPostImage, setLayoutPostImage] = useState<UploadedFile | null>(
    null,
  );
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>(
    initialData.layouts,
  );
  const [editingLayoutId, setEditingLayoutId] = useState<string | null>(null);
  const [voiceSliders, setVoiceSliders] = useState(() =>
    defaultVoiceSliders.map((slider) => ({
      ...slider,
      value: initialData.voiceValues[slider.id] ?? slider.value,
    })),
  );
  const [lovedWords, setLovedWords] = useState(initialData.lovedWords);
  const [bannedWords, setBannedWords] = useState(initialData.bannedWords);
  const [personas, setPersonas] = useState<Persona[]>(initialData.personas);
  const [activeRuleIds, setActiveRuleIds] = useState(initialData.activeRuleIds);
  const [avoidedColors, setAvoidedColors] = useState(initialData.avoidedColors);
  const [avoidedElements, setAvoidedElements] = useState(
    initialData.avoidedElements,
  );
  const [avoidedStyles, setAvoidedStyles] = useState(initialData.avoidedStyles);
  const [currentVersionId, setCurrentVersionId] = useState(
    mockBrandVersions[0].id,
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const savePayload = JSON.stringify(
    buildSavePayload({
      palette,
      fonts,
      imageStyle,
      savedLayouts,
      voiceSliders,
      lovedWords,
      bannedWords,
      personas,
      activeRuleIds,
      avoidedColors,
      avoidedElements,
      avoidedStyles,
    }),
  );
  const lastSavedPayloadRef = useRef(savePayload);
  const saveBrandKitRef = useRef(saveBrandKitMutation.mutateAsync);

  useEffect(() => {
    saveBrandKitRef.current = saveBrandKitMutation.mutateAsync;
  }, [saveBrandKitMutation.mutateAsync]);

  useEffect(() => {
    if (savePayload === lastSavedPayloadRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setSaveStatus("saving");

      const result = await saveBrandKitRef
        .current(JSON.parse(savePayload) as SaveBrandKitInput)
        .catch(() => ({ isSuccess: false as const }));

      if (result.isSuccess) {
        lastSavedPayloadRef.current = savePayload;
      }

      setSaveStatus(result.isSuccess ? "saved" : "error");
    }, autosaveDelayInMs);

    return () => window.clearTimeout(timeoutId);
  }, [savePayload]);

  useEffect(() => {
    initialData.fonts.forEach((font) => {
      if (!font.assetId || !font.url) {
        return;
      }

      const fontFace = new FontFace(
        getFontFaceName(font.assetId),
        `url(${font.url})`,
      );

      fontFace
        .load()
        .then((loadedFont) => document.fonts.add(loadedFont))
        .catch(() => undefined);
    });
  }, [initialData.fonts]);

  const uploadAsset = async (
    kind: BrandAssetKind,
    file: File,
    width?: number,
  ): Promise<{ file: UploadedFile } | { error: string }> => {
    const result = await uploadBrandAssetMutation
      .mutateAsync({ kind, file, isGenerated: false, width, checks: {} })
      .catch(() => null);

    if (!result) {
      return { error: connectionErrorMessage };
    }

    if (!result.isSuccess) {
      return { error: result.errorMessage };
    }

    return {
      file: {
        assetId: result.data.id,
        url: result.data.url,
        fileName: result.data.fileName,
        isSvg: file.type === "image/svg+xml",
      },
    };
  };

  const deleteAsset = (assetId?: string) => {
    if (assetId) {
      deleteBrandAssetMutation.mutate({ assetId });
    }
  };

  const uploadLogo = async (
    slotId: LogoSlotId,
    file: File,
  ): Promise<UploadResult> => {
    if (slotId === "monochrome") {
      return { isSuccess: false, error: "Esta versão é gerada sozinha." };
    }

    if (!logoTypes.includes(file.type)) {
      return { isSuccess: false, error: "Use um arquivo SVG ou PNG." };
    }

    if (file.size > maxImageSizeInBytes) {
      return { isSuccess: false, error: "A logo precisa ter até 5 MB." };
    }

    const imageWidth =
      file.type === "image/png"
        ? await getImageWidth(file).catch(() => 0)
        : undefined;

    if (imageWidth !== undefined && imageWidth < minimumLogoWidth) {
      return {
        isSuccess: false,
        error: "Use um PNG com pelo menos 1000 px de largura.",
      };
    }

    const upload = await uploadAsset(logoAssetKinds[slotId], file, imageWidth);

    if ("error" in upload) {
      return { isSuccess: false, error: upload.error };
    }

    setUploadedLogos((currentLogos) => ({
      ...currentLogos,
      [slotId]: upload.file,
    }));

    return { isSuccess: true };
  };

  const removeLogo = (slotId: LogoSlotId) => {
    deleteAsset(uploadedLogos[slotId]?.assetId);
    setUploadedLogos((currentLogos) => {
      const remainingLogos = { ...currentLogos };

      delete remainingLogos[slotId];

      return remainingLogos;
    });
  };

  const validateImage = (file: File): UploadResult => {
    if (!imageTypes.includes(file.type)) {
      return { isSuccess: false, error: "Use uma imagem JPG, PNG ou WEBP." };
    }

    if (file.size > maxImageSizeInBytes) {
      return { isSuccess: false, error: "A imagem precisa ter até 5 MB." };
    }

    return { isSuccess: true };
  };

  const addReference = async (
    file: File,
    kind: ReferenceKind = "post_bom",
  ): Promise<UploadResult> => {
    const validation = validateImage(file);

    if (!validation.isSuccess) {
      return validation;
    }

    const upload = await uploadAsset(kind, file);

    if ("error" in upload) {
      return { isSuccess: false, error: upload.error };
    }

    referenceSetters[kind]((currentReferences) => [
      ...currentReferences,
      {
        id: upload.file.assetId,
        caption: removeExtension(file.name),
        imageUrl: upload.file.url,
      },
    ]);

    return { isSuccess: true };
  };

  const removeReference = (
    referenceId: string,
    kind: ReferenceKind = "post_bom",
  ) => {
    deleteAsset(referenceId);
    referenceSetters[kind]((currentReferences) =>
      currentReferences.filter((reference) => reference.id !== referenceId),
    );
  };

  const uploadFont = async (role: FontRole, file: File) => {
    const upload = await uploadAsset("fonte", file);

    if ("error" in upload) {
      throw new Error(upload.error);
    }

    const fontFace = new FontFace(
      getFontFaceName(upload.file.assetId),
      await file.arrayBuffer(),
    );

    await fontFace.load();
    document.fonts.add(fontFace);

    deleteAsset(fonts.find((font) => font.role === role)?.assetId);
    setFonts((currentFonts) => [
      ...currentFonts.filter((font) => font.role !== role),
      {
        role,
        family: getUploadedFontFamily(upload.file.assetId),
        displayName: formatFontName(file.name),
        sample: fontSamples[role],
        isRequired: role !== "Destaque",
        isDefault: false,
        assetId: upload.file.assetId,
        url: upload.file.url,
      },
    ]);
  };

  const removeFont = (role: FontRole) => {
    deleteAsset(fonts.find((font) => font.role === role)?.assetId);
    setFonts((currentFonts) => [
      ...currentFonts.filter((font) => font.role !== role),
      ...defaultBrandFonts.filter((font) => font.role === role),
    ]);
  };

  const updateColor = (colorId: string, name: string, hex: string) =>
    setPalette((currentPalette) =>
      currentPalette.map((color) =>
        color.id === colorId ? { ...color, name, hex } : color,
      ),
    );

  const addColor = (name: string, hex: string) =>
    setPalette((currentPalette) => [
      ...currentPalette,
      {
        id: crypto.randomUUID(),
        role: "extra",
        roleLabel: "Extra",
        name,
        hex,
      },
    ]);

  const removeColor = (colorId: string) =>
    setPalette((currentPalette) =>
      currentPalette.filter((color) => color.id !== colorId),
    );

  const toggleLayoutMode = (elementId: LayoutElementId, isFixed: boolean) => {
    const nextModes = { ...layoutModes, [elementId]: isFixed };

    setLayoutModes(nextModes);

    if (editingLayoutId) {
      setSavedLayouts((currentLayouts) =>
        currentLayouts.map((layout) =>
          layout.id === editingLayoutId
            ? { ...layout, layoutModes: nextModes }
            : layout,
        ),
      );
    }
  };

  const changeLayoutFormat = (format: LayoutFormat) => {
    setLayoutFormat(format);

    if (editingLayoutId) {
      setSavedLayouts((currentLayouts) =>
        currentLayouts.map((layout) =>
          layout.id === editingLayoutId ? { ...layout, format } : layout,
        ),
      );
    }
  };

  const resetLayoutEditor = () => {
    const isUnsavedPost =
      layoutPostImage &&
      !savedLayouts.some(
        (layout) => layout.sourceAssetId === layoutPostImage.assetId,
      );

    if (isUnsavedPost) {
      deleteAsset(layoutPostImage.assetId);
    }

    setLayoutModes(emptyLayoutModes);
    setLayoutFormat("post");
    setLayoutPostImage(null);
    setEditingLayoutId(null);
  };

  const uploadLayoutPost = async (file: File): Promise<UploadResult> => {
    const validation = validateImage(file);

    if (!validation.isSuccess) {
      return validation;
    }

    const upload = await uploadAsset("layout_origem", file);

    if ("error" in upload) {
      return { isSuccess: false, error: upload.error };
    }

    resetLayoutEditor();
    setLayoutPostImage(upload.file);

    return { isSuccess: true };
  };

  const saveLayout = () => {
    if (editingLayoutId) {
      return;
    }

    const layoutId = crypto.randomUUID();

    setSavedLayouts((currentLayouts) => [
      ...currentLayouts,
      {
        id: layoutId,
        name: `Layout ${currentLayouts.length + 1}`,
        format: layoutFormat,
        layoutModes,
        postImageUrl: layoutPostImage?.url,
        sourceAssetId: layoutPostImage?.assetId,
      },
    ]);
    setEditingLayoutId(layoutId);
  };

  const openLayout = (layout: SavedLayout) => {
    setEditingLayoutId(layout.id);
    setLayoutModes(layout.layoutModes);
    setLayoutFormat(layout.format);
    setLayoutPostImage(
      layout.postImageUrl && layout.sourceAssetId
        ? {
            assetId: layout.sourceAssetId,
            url: layout.postImageUrl,
            fileName: layout.name,
            isSvg: false,
          }
        : null,
    );
  };

  const removeLayout = (layoutId: string) => {
    deleteAsset(
      savedLayouts.find((layout) => layout.id === layoutId)?.sourceAssetId,
    );
    setSavedLayouts((currentLayouts) =>
      currentLayouts.filter((layout) => layout.id !== layoutId),
    );

    if (layoutId === editingLayoutId) {
      setLayoutModes(emptyLayoutModes);
      setLayoutPostImage(null);
      setEditingLayoutId(null);
    }
  };

  const updateVoiceSlider = (sliderId: string, value: number) =>
    setVoiceSliders((currentSliders) =>
      currentSliders.map((slider) =>
        slider.id === sliderId ? { ...slider, value } : slider,
      ),
    );

  const addUniqueValue =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) =>
      setter((currentValues) =>
        currentValues.some(
          (currentValue) => currentValue.toLowerCase() === value.toLowerCase(),
        )
          ? currentValues
          : [...currentValues, value],
      );

  const removeValue =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) =>
      setter((currentValues) =>
        currentValues.filter((currentValue) => currentValue !== value),
      );

  const savePersona = (persona: Persona) =>
    setPersonas((currentPersonas) =>
      currentPersonas.some((currentPersona) => currentPersona.id === persona.id)
        ? currentPersonas.map((currentPersona) =>
            currentPersona.id === persona.id ? persona : currentPersona,
          )
        : [...currentPersonas, persona],
    );

  const removePersona = (personaId: string) =>
    setPersonas((currentPersonas) =>
      currentPersonas.filter((persona) => persona.id !== personaId),
    );

  const toggleRule = (ruleId: string, isActive: boolean) =>
    setActiveRuleIds((currentIds) =>
      isActive
        ? [...currentIds, ruleId]
        : currentIds.filter((currentId) => currentId !== ruleId),
    );

  const addRestriction = (
    type: RestrictionType,
    value: string,
    hex: string | null,
  ) => {
    if (type === "Cores" && hex) {
      setAvoidedColors((currentColors) => [
        ...currentColors,
        { name: value, hex },
      ]);
      return;
    }

    addUniqueValue(
      type === "Elementos" ? setAvoidedElements : setAvoidedStyles,
    )(value);
  };

  return {
    saveStatus,
    uploadedLogos,
    uploadLogo,
    removeLogo,
    palette,
    updateColor,
    addColor,
    removeColor,
    fonts,
    uploadFont,
    removeFont,
    imageStyle,
    setImageStyle,
    references,
    storyReferences,
    addReference,
    removeReference,
    layoutModes,
    toggleLayoutMode,
    layoutFormat,
    changeLayoutFormat,
    layoutPostImage,
    uploadLayoutPost,
    resetLayoutEditor,
    savedLayouts,
    editingLayoutId,
    saveLayout,
    openLayout,
    removeLayout,
    voiceSliders,
    updateVoiceSlider,
    lovedWords,
    addLovedWord: addUniqueValue(setLovedWords),
    removeLovedWord: removeValue(setLovedWords),
    bannedWords,
    addBannedWord: addUniqueValue(setBannedWords),
    removeBannedWord: removeValue(setBannedWords),
    personas,
    savePersona,
    removePersona,
    activeRuleIds,
    toggleRule,
    avoidedColors,
    avoidedElements,
    avoidedStyles,
    addRestriction,
    currentVersionId,
    setCurrentVersionId,
  };
}

export type BrandKit = ReturnType<typeof useBrandKit>;

"use client";

import { useEffect, useRef, useState } from "react";

import {
  mockAvoidedColors,
  mockAvoidedElements,
  mockAvoidedStyles,
  mockBannedWords,
  mockBrandFonts,
  mockBrandPalette,
  mockBrandRules,
  mockBrandVersions,
  mockInitialLayoutModes,
  mockLovedWords,
  mockPersonas,
  mockSavedLayouts,
  mockStyleReferences,
  mockVoiceSliders,
  type BrandColor,
  type BrandFont,
  type FontRole,
  type ImageStyle,
  type LayoutElementId,
  type LogoSlotId,
  type Persona,
  type RestrictionType,
  type SavedLayout,
  type StyleReference,
} from "@/lib/mocks/brand";

export type UploadedFile = {
  url: string;
  fileName: string;
  isSvg: boolean;
};

const maxImageSizeInBytes = 10 * 1024 * 1024;
const minimumLogoWidth = 1000;
const logoTypes = ["image/svg+xml", "image/png"];
const imageTypes = ["image/jpeg", "image/png", "image/webp"];

type UploadResult = { isSuccess: true } | { isSuccess: false; error: string };

const getImageWidth = async (file: File) => {
  const imageBitmap = await createImageBitmap(file);
  const imageWidth = imageBitmap.width;

  imageBitmap.close();

  return imageWidth;
};

const removeExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, "");

export function useBrandKit() {
  const objectUrlsRef = useRef<string[]>([]);
  const [uploadedLogos, setUploadedLogos] = useState<
    Partial<Record<LogoSlotId, UploadedFile>>
  >({});
  const [palette, setPalette] = useState<BrandColor[]>(mockBrandPalette);
  const [fonts, setFonts] = useState<BrandFont[]>(mockBrandFonts);
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photographic");
  const [references, setReferences] =
    useState<StyleReference[]>(mockStyleReferences);
  const [layoutModes, setLayoutModes] = useState(mockInitialLayoutModes);
  const [layoutPostImage, setLayoutPostImage] = useState<UploadedFile | null>(
    null,
  );
  const [savedLayouts, setSavedLayouts] =
    useState<SavedLayout[]>(mockSavedLayouts);
  const [voiceSliders, setVoiceSliders] = useState(mockVoiceSliders);
  const [lovedWords, setLovedWords] = useState(mockLovedWords);
  const [bannedWords, setBannedWords] = useState(mockBannedWords);
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
  const [activeRuleIds, setActiveRuleIds] = useState(
    mockBrandRules.map((rule) => rule.id),
  );
  const [avoidedColors, setAvoidedColors] = useState(mockAvoidedColors);
  const [avoidedElements, setAvoidedElements] = useState(mockAvoidedElements);
  const [avoidedStyles, setAvoidedStyles] = useState(mockAvoidedStyles);
  const [currentVersionId, setCurrentVersionId] = useState(
    mockBrandVersions[0].id,
  );

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const createUploadedFile = (file: File): UploadedFile => {
    const url = URL.createObjectURL(file);

    objectUrlsRef.current.push(url);

    return { url, fileName: file.name, isSvg: file.type === "image/svg+xml" };
  };

  const uploadLogo = async (
    slotId: LogoSlotId,
    file: File,
  ): Promise<UploadResult> => {
    if (!logoTypes.includes(file.type)) {
      return { isSuccess: false, error: "Use um arquivo SVG ou PNG." };
    }

    if (file.size > maxImageSizeInBytes) {
      return { isSuccess: false, error: "A logo precisa ter até 10 MB." };
    }

    if (file.type === "image/png") {
      const imageWidth = await getImageWidth(file).catch(() => 0);

      if (imageWidth < minimumLogoWidth) {
        return {
          isSuccess: false,
          error: "Use um PNG com pelo menos 1000 px de largura.",
        };
      }
    }

    setUploadedLogos((currentLogos) => ({
      ...currentLogos,
      [slotId]: createUploadedFile(file),
    }));

    return { isSuccess: true };
  };

  const validateImage = (file: File): UploadResult => {
    if (!imageTypes.includes(file.type)) {
      return { isSuccess: false, error: "Use uma imagem JPG, PNG ou WEBP." };
    }

    if (file.size > maxImageSizeInBytes) {
      return { isSuccess: false, error: "A imagem precisa ter até 10 MB." };
    }

    return { isSuccess: true };
  };

  const addReference = (file: File): UploadResult => {
    const validation = validateImage(file);

    if (validation.isSuccess) {
      setReferences((currentReferences) => [
        ...currentReferences,
        {
          id: crypto.randomUUID(),
          caption: removeExtension(file.name),
          style: imageStyle,
          imageUrl: createUploadedFile(file).url,
        },
      ]);
    }

    return validation;
  };

  const uploadLayoutPost = (file: File): UploadResult => {
    const validation = validateImage(file);

    if (validation.isSuccess) {
      setLayoutPostImage(createUploadedFile(file));
    }

    return validation;
  };

  const uploadFont = async (role: FontRole, file: File) => {
    const family = `brand-${role}-${Date.now()}`.replace(/\s+/g, "-");
    const fontFace = new FontFace(family, await file.arrayBuffer());

    await fontFace.load();
    document.fonts.add(fontFace);

    const uploadedFont: BrandFont = {
      role,
      family: `"${family}", system-ui, sans-serif`,
      displayName: removeExtension(file.name),
      sample:
        role === "Destaque"
          ? "Só hoje: R$ 12"
          : (mockBrandFonts.find((font) => font.role === role)?.sample ??
            "Novo blend de outono"),
      isRequired: role !== "Destaque",
    };

    setFonts((currentFonts) => [
      ...currentFonts.filter((font) => font.role !== role),
      uploadedFont,
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

  const toggleLayoutMode = (elementId: LayoutElementId, isFixed: boolean) =>
    setLayoutModes((currentModes) => ({
      ...currentModes,
      [elementId]: isFixed,
    }));

  const resetLayoutEditor = () => {
    setLayoutModes(mockInitialLayoutModes);
    setLayoutPostImage(null);
  };

  const saveLayout = (summary: string) => {
    setSavedLayouts((currentLayouts) => [
      ...currentLayouts,
      {
        id: crypto.randomUUID(),
        name: `Layout ${currentLayouts.length + 1}`,
        summary,
        thumbnail: "product",
      },
    ]);
    resetLayoutEditor();
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

  const savePersona = (persona: Persona) =>
    setPersonas((currentPersonas) =>
      currentPersonas.some((currentPersona) => currentPersona.id === persona.id)
        ? currentPersonas.map((currentPersona) =>
            currentPersona.id === persona.id ? persona : currentPersona,
          )
        : [...currentPersonas, persona],
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
    uploadedLogos,
    uploadLogo,
    palette,
    updateColor,
    addColor,
    fonts,
    uploadFont,
    imageStyle,
    setImageStyle,
    references,
    addReference,
    layoutModes,
    toggleLayoutMode,
    layoutPostImage,
    uploadLayoutPost,
    resetLayoutEditor,
    savedLayouts,
    saveLayout,
    voiceSliders,
    updateVoiceSlider,
    lovedWords,
    addLovedWord: addUniqueValue(setLovedWords),
    bannedWords,
    addBannedWord: addUniqueValue(setBannedWords),
    personas,
    savePersona,
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

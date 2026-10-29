type VoiceSliderValue = { id: string; value: number };

type VoiceLevel = "low" | "middle" | "high";

const getLevel = (value: number): VoiceLevel => {
  if (value < 34) {
    return "low";
  }

  return value > 66 ? "high" : "middle";
};

const getSliderLevel = (sliders: VoiceSliderValue[], sliderId: string) =>
  getLevel(sliders.find((slider) => slider.id === sliderId)?.value ?? 50);

const openings: Record<VoiceLevel, string> = {
  low: "Prezado cliente,",
  middle: "Olá!",
  high: "Oi, gente!",
};

const descriptions: Record<VoiceLevel, string> = {
  low: "nosso novo produto tem qualidade comprovada",
  middle: "nosso novo produto chegou",
  high: "chegou novidade",
};

const moods: Record<VoiceLevel, string> = {
  low: ".",
  middle: "!",
  high: "! 😋",
};

const closings: Record<VoiceLevel, string> = {
  low: "Saiba mais no perfil.",
  middle: "Vem conhecer.",
  high: "Garanta já o seu!",
};

const formalityLabels: Record<VoiceLevel, string> = {
  low: "Formal",
  middle: "Equilibrado",
  high: "Descontraído",
};

const humorLabels: Record<VoiceLevel, string> = {
  low: "sério",
  middle: "leve",
  high: "divertido",
};

export function getVoiceSample(sliders: VoiceSliderValue[]) {
  const opening = openings[getSliderLevel(sliders, "formality")];
  const description = descriptions[getSliderLevel(sliders, "complexity")];
  const mood = moods[getSliderLevel(sliders, "humor")];
  const closing = closings[getSliderLevel(sliders, "intent")];

  const sentence = opening.endsWith(",")
    ? description
    : `${description.charAt(0).toUpperCase()}${description.slice(1)}`;

  return `${opening} ${sentence}${mood} ${closing}`;
}

export function getVoiceToneLabel(sliders: VoiceSliderValue[]) {
  return `${formalityLabels[getSliderLevel(sliders, "formality")]} e ${humorLabels[getSliderLevel(sliders, "humor")]}`;
}

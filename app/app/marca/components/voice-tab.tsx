import { Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/get-initials";
import { maxPersonas, type Persona } from "@/lib/mocks/brand";

import { BrandCard } from "./brand-card";

type VoiceSlider = {
  id: string;
  start: string;
  end: string;
  value: number;
  label: string;
};

type VoiceTabProps = {
  sliders: VoiceSlider[];
  lovedWords: string[];
  bannedWords: string[];
  personas: Persona[];
  onSliderChange: (sliderId: string, value: number) => void;
  onConfirmTone: () => void;
  onAdjustTone: () => void;
  onAddLovedWord: () => void;
  onAddBannedWord: () => void;
  onEditPersona: (persona: Persona | null) => void;
};

type WordListProps = {
  title: string;
  words: string[];
  variant: "secondary" | "destructive";
  onAdd: () => void;
};

function WordList({ title, words, variant, onAdd }: WordListProps) {
  return (
    <div className="brand-tile flex flex-col gap-2.5 rounded-[18px] px-4.5 py-4">
      <b className="text-sm font-semibold">{title}</b>
      <div className="flex flex-wrap items-center gap-2">
        {words.map((word) => (
          <Badge key={word} variant={variant}>
            {word}
          </Badge>
        ))}
        <Button variant="outline" size="sm" onClick={onAdd}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}

export function VoiceTab({
  sliders,
  lovedWords,
  bannedWords,
  personas,
  onSliderChange,
  onConfirmTone,
  onAdjustTone,
  onAddLovedWord,
  onAddBannedWord,
  onEditPersona,
}: VoiceTabProps) {
  const canAddPersona = personas.length < maxPersonas;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="voice-title"
        title="Tom de voz"
        hint="A IA escreve legendas e textos seguindo estas réguas."
        action={<Badge variant="secondary">Acolhedor e próximo</Badge>}
      >
        <div className="brand-tile grid gap-x-9 gap-y-4.5 rounded-[18px] px-4 py-4.5 sm:grid-cols-2 sm:px-5.5">
          {sliders.map((slider) => (
            <div key={slider.id} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>{slider.start}</span>
                <span>{slider.end}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={slider.value}
                aria-label={slider.label}
                onChange={(event) =>
                  onSliderChange(slider.id, Number(event.target.value))
                }
                className="m-0 h-7 w-full cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              />
            </div>
          ))}
        </div>
        <div className="brand-quote flex flex-wrap items-center justify-between gap-5 rounded-[18px] px-5.5 py-4.5">
          <div className="min-w-0 flex-[1_1_280px]">
            <small className="mb-1 block text-[13px] font-semibold text-primary">
              É assim que sua marca fala?
            </small>
            <p className="m-0 font-(family-name:--font-dm-serif) text-[21px] leading-[1.3]">
              “Café passado na hora e pão de queijo saindo do forno. Passa
              aqui?”
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={onConfirmTone}>
              Sim, é isso
            </Button>
            <Button variant="outline" size="sm" onClick={onAdjustTone}>
              Ajustar
            </Button>
          </div>
        </div>
      </BrandCard>

      <BrandCard titleId="words-title" title="Palavras da marca">
        <div className="grid gap-4 sm:grid-cols-2">
          <WordList
            title="Palavras que amamos"
            words={lovedWords}
            variant="secondary"
            onAdd={onAddLovedWord}
          />
          <WordList
            title="Termos proibidos"
            words={bannedWords}
            variant="destructive"
            onAdd={onAddBannedWord}
          />
        </div>
      </BrandCard>

      <BrandCard
        titleId="personas-title"
        title="Público e personas"
        hint="Sugeridas pela IA e confirmadas por você. Até 3."
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={!canAddPersona}
            onClick={() => onEditPersona(null)}
          >
            <Plus aria-hidden="true" className="size-4" />
            Adicionar persona
          </Button>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="brand-tile flex flex-col gap-2.5 rounded-[18px] p-4"
            >
              <div className="flex items-center gap-2.5 font-display font-semibold">
                <Avatar>
                  <AvatarFallback>{getInitials(persona.name)}</AvatarFallback>
                </Avatar>
                {persona.name}, {persona.age}
              </div>
              <p className="m-0 text-sm leading-[1.45] text-muted">
                {persona.description}
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPersona(persona)}
                >
                  Editar
                </Button>
              </div>
            </div>
          ))}
          {canAddPersona ? (
            <div className="brand-tile flex items-center justify-center rounded-[18px] border-dashed border-muted p-4">
              <Button variant="ghost" onClick={() => onEditPersona(null)}>
                <Plus aria-hidden="true" className="size-4.5" />
                Nova persona
              </Button>
            </div>
          ) : null}
        </div>
      </BrandCard>
    </div>
  );
}

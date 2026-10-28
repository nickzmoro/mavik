"use client";

import { Plus, X } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags: number;
  addLabel: string;
  placeholder: string;
  variant?: "default" | "danger";
  disabled?: boolean;
  id?: string;
};

export function TagInput({
  value,
  onChange,
  maxTags,
  addLabel,
  placeholder,
  variant = "default",
  disabled,
  id,
}: TagInputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const hasReachedLimit = value.length >= maxTags;

  const addTag = () => {
    const tag = draft.trim();

    if (
      tag &&
      !value.some((item) => item.toLowerCase() === tag.toLowerCase())
    ) {
      onChange([...value, tag]);
    }

    setDraft("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {value.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex min-h-9 items-center gap-1 rounded-full pr-1 pl-3 text-sm font-medium",
            variant === "danger"
              ? "border border-danger bg-danger-bg text-text"
              : "bg-surface-2 text-text",
          )}
        >
          {variant === "danger" && (
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-danger"
            />
          )}
          {tag}
          <button
            type="button"
            aria-label={`Remover ${tag}`}
            disabled={disabled}
            onClick={() => onChange(value.filter((item) => item !== tag))}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted hover:bg-bg hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </span>
      ))}

      {isAdding ? (
        <Input
          id={inputId}
          autoFocus
          value={draft}
          placeholder={placeholder}
          maxLength={60}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={addTag}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }

            if (event.key === "Escape") {
              setDraft("");
              setIsAdding(false);
            }
          }}
          className="min-h-9 w-48 rounded-full text-sm"
        />
      ) : (
        <Button
          id={inputId}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || hasReachedLimit}
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

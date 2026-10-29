"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TagInputProps = {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  maxItems: number;
  maxLength: number;
  placeholder: string;
  ariaLabel: string;
  variant?: "secondary" | "destructive";
};

export function TagInput({
  id,
  values,
  onChange,
  maxItems,
  maxLength,
  placeholder,
  ariaLabel,
  variant = "secondary",
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const hasReachedLimit = values.length >= maxItems;
  const trimmedDraft = draft.trim();
  const isDuplicate = values.some(
    (value) => value.toLowerCase() === trimmedDraft.toLowerCase(),
  );

  const handleAdd = () => {
    if (!trimmedDraft || isDuplicate || hasReachedLimit) {
      return;
    }

    onChange([...values, trimmedDraft]);
    setDraft("");
  };

  const handleRemove = (valueToRemove: string) =>
    onChange(values.filter((value) => value !== valueToRemove));

  return (
    <div className="flex flex-col gap-3">
      {values.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {values.map((value) => (
            <li key={value}>
              <Badge variant={variant} className="min-h-8 gap-1.5 pr-1.5 pl-3">
                {value}
                <button
                  type="button"
                  aria-label={`Remover ${value}`}
                  onClick={() => handleRemove(value)}
                  className="flex size-5 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current transition-colors duration-150 hover:bg-text/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus motion-reduce:transition-none"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {hasReachedLimit ? null : (
        <div className="flex gap-2">
          <Input
            id={id}
            value={draft}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-label={ariaLabel}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!trimmedDraft || isDuplicate}
            onClick={handleAdd}
          >
            <Plus aria-hidden="true" className="size-4" />
            Adicionar
          </Button>
        </div>
      )}
    </div>
  );
}

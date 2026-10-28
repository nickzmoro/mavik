"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

type FileUploadButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "type"
> & {
  accept: string;
  onFileSelected: (file: File) => void;
};

export function FileUploadButton({
  accept,
  onFileSelected,
  children,
  ...buttonProps
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedFile] = Array.from(event.target.files ?? []);

    if (selectedFile) {
      onFileSelected(selectedFile);
    }

    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        tabIndex={-1}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        {...buttonProps}
      >
        {children}
      </Button>
    </>
  );
}

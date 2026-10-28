"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PillGroup } from "@/components/common/pill-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fontRoles, type FontRole } from "@/lib/mocks/brand";
import {
  brandFontFormSchema,
  type BrandFontFormValues,
} from "@/lib/validations/brand";

const fontFormId = "brand-font-form";

function FontUploadForm({
  initialRole,
  onUpload,
}: {
  initialRole: FontRole;
  onUpload: (role: FontRole, file: File) => Promise<void>;
}) {
  const [isLoadingFont, setIsLoadingFont] = useState(false);
  const form = useForm<BrandFontFormValues>({
    resolver: zodResolver(brandFontFormSchema),
    defaultValues: { role: initialRole, hasLicense: false },
  });

  const handleUpload = async ({ role, file }: BrandFontFormValues) => {
    setIsLoadingFont(true);

    try {
      await onUpload(role, file);
    } catch {
      form.setError("file", {
        message: "Não conseguimos ler esta fonte. Tente outro arquivo.",
      });
    } finally {
      setIsLoadingFont(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          id={fontFormId}
          noValidate
          onSubmit={form.handleSubmit(handleUpload)}
          className="scrollbar-subtle m-0 flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <PillGroup
                id="font-role"
                label="Usar para"
                options={fontRoles}
                isSelected={(option) => option === field.value}
                onToggle={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, name, ref, onBlur } }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Arquivo da fonte
                </FormLabel>
                <FormControl>
                  <Input
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={(event) => onChange(event.target.files?.[0])}
                    className="py-2.5 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasLicense"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer leading-normal font-normal">
                    Confirmo que tenho a licença de uso desta fonte para fins
                    comerciais.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form={fontFormId} loading={isLoadingFont}>
          {isLoadingFont ? null : (
            <Upload aria-hidden="true" className="size-4.5" />
          )}
          Enviar fonte
        </Button>
      </DialogFooter>
    </>
  );
}

type FontUploadDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialRole: FontRole;
  onUpload: (role: FontRole, file: File) => Promise<void>;
};

export function FontUploadDialog({
  open,
  onOpenChange,
  initialRole,
  onUpload,
}: FontUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>Enviar fonte</DialogTitle>
          <DialogDescription>
            .ttf, .otf, .woff ou .woff2 com até 5 MB. A prévia usa a fonte
            enviada na hora.
          </DialogDescription>
        </DialogHeader>
        <FontUploadForm
          key={initialRole}
          initialRole={initialRole}
          onUpload={onUpload}
        />
      </DialogContent>
    </Dialog>
  );
}

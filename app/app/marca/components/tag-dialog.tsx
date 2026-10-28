"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import {
  brandTagFormSchema,
  type BrandTagFormValues,
} from "@/lib/validations/brand";

const tagFormId = "brand-tag-form";

export type TagDialogConfig = {
  title: string;
  description: string;
  label: string;
  placeholder: string;
};

function TagForm({
  config,
  onAdd,
}: {
  config: TagDialogConfig;
  onAdd: (value: string) => void;
}) {
  const form = useForm<BrandTagFormValues>({
    resolver: zodResolver(brandTagFormSchema),
    defaultValues: { value: "" },
  });

  return (
    <>
      <Form {...form}>
        <form
          id={tagFormId}
          noValidate
          onSubmit={form.handleSubmit((values) => onAdd(values.value))}
          className="m-0 px-5 pt-4.5 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">{config.label}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    autoFocus
                    placeholder={config.placeholder}
                    {...field}
                  />
                </FormControl>
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
        <Button type="submit" form={tagFormId}>
          Adicionar
        </Button>
      </DialogFooter>
    </>
  );
}

type TagDialogProps = {
  config: TagDialogConfig | null;
  onOpenChange: (isOpen: boolean) => void;
  onAdd: (value: string) => void;
};

export function TagDialog({ config, onOpenChange, onAdd }: TagDialogProps) {
  return (
    <Dialog open={config !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-120">
        {config ? (
          <>
            <DialogHeader contentClassName="gap-1">
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </DialogHeader>
            <TagForm key={config.title} config={config} onAdd={onAdd} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { IconInput } from "@/components/auth/icon-input";
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
import {
  postLinkFormSchema,
  type PostLinkFormValues,
} from "@/lib/validations/agent";

const postLinkFormId = "post-link-form";

type PostLinkDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (url: string) => void;
  description: string;
};

function PostLinkForm({ onConfirm }: Pick<PostLinkDialogProps, "onConfirm">) {
  const form = useForm<PostLinkFormValues>({
    resolver: zodResolver(postLinkFormSchema),
    defaultValues: { url: "" },
  });

  const handleAttachLink = ({ url }: PostLinkFormValues) => onConfirm(url);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    void form.handleSubmit(handleAttachLink)(event);
  };

  return (
    <>
      <Form {...form}>
        <form
          id={postLinkFormId}
          noValidate
          onSubmit={handleSubmit}
          className="m-0 px-5 pt-4 pb-5 sm:px-7"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Link do post</FormLabel>
                <FormControl>
                  <IconInput
                    icon={LinkIcon}
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    autoFocus
                    placeholder="https://www.instagram.com/p/..."
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
        <Button type="submit" form={postLinkFormId}>
          Anexar link
        </Button>
      </DialogFooter>
    </>
  );
}

export function PostLinkDialog({
  open,
  onOpenChange,
  onConfirm,
  description,
}: PostLinkDialogProps) {
  const handleConfirm = (url: string) => {
    onConfirm(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-140">
        <DialogHeader>
          <DialogTitle>Link de um post</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <PostLinkForm onConfirm={handleConfirm} />
      </DialogContent>
    </Dialog>
  );
}

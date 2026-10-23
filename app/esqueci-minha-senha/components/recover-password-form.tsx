"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { IconInput } from "@/components/auth/icon-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSchema } from "@/lib/validations/auth";

const recoverPasswordFormSchema = z.object({
  email: emailSchema,
});

type RecoverPasswordFormValues = z.infer<typeof recoverPasswordFormSchema>;

type RecoverPasswordFormProps = {
  onLinkSent: () => void;
};

export function RecoverPasswordForm({ onLinkSent }: RecoverPasswordFormProps) {
  const form = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onLinkSent)}
        className="m-0 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <IconInput
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  placeholder="voce@suaempresa.com.br"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          loading={form.formState.isSubmitting}
        >
          Receber link
        </Button>
      </form>
    </Form>
  );
}

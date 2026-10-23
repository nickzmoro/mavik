"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { IconInput } from "@/components/auth/icon-input";
import { PasswordInput } from "@/components/auth/password-input";
import { TextLink } from "@/components/auth/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSchema } from "@/lib/validations/auth";

const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Digite sua senha." }),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const handleLogin = () => {};

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleLogin)}
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="min-h-11 flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal">
                  Lembrar de mim
                </FormLabel>
              </FormItem>
            )}
          />
          <TextLink
            href="/esqueci-minha-senha"
            className="text-sm leading-normal font-medium underline"
          >
            Esqueceu a senha?
          </TextLink>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={form.formState.isSubmitting}
        >
          Entrar
        </Button>
      </form>
    </Form>
  );
}

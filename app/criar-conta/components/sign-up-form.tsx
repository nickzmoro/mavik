"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSchema } from "@/lib/validations/auth";

const signUpFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Digite seu nome." }),
  email: emailSchema,
  password: z
    .string()
    .min(8, { error: "Sua senha precisa ter pelo menos 8 caracteres." }),
  acceptedTerms: z.boolean().refine((isAccepted) => isAccepted, {
    error: "Aceite os Termos de uso e a Política de privacidade para continuar.",
  }),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptedTerms: false,
    },
  });

  const handleSignUp = () => {};

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSignUp)}
        className="m-0 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu nome</FormLabel>
              <FormControl>
                <IconInput
                  icon={User}
                  type="text"
                  autoComplete="name"
                  placeholder="Como você quer ser chamado"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormLabel>Crie uma senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use letras e números para deixar sua conta mais segura.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-2.5">
                <div className="flex pt-0.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                </div>
                <FormLabel className="cursor-pointer font-normal">
                  Li e aceito os{" "}
                  <TextLink href="#" className="font-medium underline">
                    Termos de uso
                  </TextLink>{" "}
                  e a{" "}
                  <TextLink href="#" className="font-medium underline">
                    Política de privacidade
                  </TextLink>
                  .
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          loading={form.formState.isSubmitting}
        >
          Criar conta
        </Button>
      </form>
    </Form>
  );
}

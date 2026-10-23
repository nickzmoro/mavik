"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from "@/actions/update-password/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdatePassword } from "@/hooks/mutations/use-update-password";
import { connectionFailure } from "@/lib/auth-action-result";

export function ResetPasswordForm() {
  const router = useRouter();
  const updatePasswordMutation = useUpdatePassword();

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleUpdatePassword = async (values: UpdatePasswordInput) => {
    const result = await updatePasswordMutation
      .mutateAsync(values)
      .catch(connectionFailure);

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
      return;
    }

    router.replace(result.data.redirectTo);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleUpdatePassword)}
        className="m-0 flex flex-col gap-5"
      >
        <FormAlert message={form.formState.errors.root?.message} />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repita a nova senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Digite a mesma senha"
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
          Salvar nova senha
        </Button>
      </form>
    </Form>
  );
}

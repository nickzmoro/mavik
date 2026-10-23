"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  signInFormSchema,
  type SignInFormValues,
} from "@/actions/sign-in/schema";
import { CaptchaWidget } from "@/components/auth/captcha-widget";
import { FormAlert } from "@/components/auth/form-alert";
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
import { useSignIn } from "@/hooks/mutations/use-sign-in";
import { useCaptcha } from "@/hooks/use-captcha";
import { authErrorMessages, authFailure } from "@/lib/auth-action-result";
import { routes } from "@/lib/routes";

export function LoginForm() {
  const router = useRouter();
  const signInMutation = useSignIn();
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const handleLogin = async (values: SignInFormValues) => {
    const captchaToken = await getCaptchaToken();

    if (!captchaToken) {
      form.setError("root", { message: authErrorMessages.captchaFailed });
      resetCaptcha();
      return;
    }

    const result = await signInMutation
      .mutateAsync({
        ...values,
        captchaToken,
        redirectTo:
          new URLSearchParams(window.location.search).get("next") ?? undefined,
      })
      .catch(() => authFailure(authErrorMessages.unexpected));

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
      form.resetField("password");
      resetCaptcha();
      return;
    }

    router.replace(result.data.redirectTo);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleLogin)}
        className="m-0 flex flex-col gap-5"
      >
        <FormAlert message={form.formState.errors.root?.message} />

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
            href={routes.recoverPassword}
            className="text-sm leading-normal font-medium underline"
          >
            Esqueceu a senha?
          </TextLink>
        </div>

        <CaptchaWidget ref={captchaRef} />

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

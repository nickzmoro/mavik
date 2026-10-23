"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  requestPasswordResetFormSchema,
  type RequestPasswordResetFormValues,
} from "@/actions/request-password-reset/schema";
import { CaptchaWidget } from "@/components/auth/captcha-widget";
import { FormAlert } from "@/components/auth/form-alert";
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
import { useRequestPasswordReset } from "@/hooks/mutations/use-request-password-reset";
import { useCaptcha } from "@/hooks/use-captcha";
import { authErrorMessages, connectionFailure } from "@/lib/auth-action-result";

type RecoverPasswordFormProps = {
  onLinkSent: () => void;
};

export function RecoverPasswordForm({ onLinkSent }: RecoverPasswordFormProps) {
  const requestPasswordResetMutation = useRequestPasswordReset();
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();

  const form = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleRequestPasswordReset = async (
    values: RequestPasswordResetFormValues,
  ) => {
    const captchaToken = await getCaptchaToken();

    if (!captchaToken) {
      form.setError("root", { message: authErrorMessages.captchaFailed });
      resetCaptcha();
      return;
    }

    const result = await requestPasswordResetMutation
      .mutateAsync({ ...values, captchaToken })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
      resetCaptcha();
      return;
    }

    onLinkSent();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleRequestPasswordReset)}
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

        <CaptchaWidget ref={captchaRef} />

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

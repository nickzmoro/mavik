"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  sendFeedbackFormSchema,
  type SendFeedbackFormValues,
} from "@/actions/send-feedback/schema";
import { FormAlert } from "@/components/auth/form-alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
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
import { RadioGroup, RadioGroupChipItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSendFeedback } from "@/hooks/mutations/use-send-feedback";
import { connectionFailure } from "@/lib/auth-action-result";
import {
  feedbackTypes,
  feedbackTypeValues,
} from "@/lib/feedback/feedback-types";

export function FeedbackForm() {
  const pathname = usePathname();
  const sendFeedbackMutation = useSendFeedback();
  const [hasSent, setHasSent] = useState(false);

  const form = useForm<SendFeedbackFormValues>({
    resolver: zodResolver(sendFeedbackFormSchema),
    defaultValues: {
      type: "suggestion",
      message: "",
    },
  });

  const selectedFeedbackType = useWatch({
    control: form.control,
    name: "type",
  });
  const selectedType = feedbackTypes[selectedFeedbackType];

  const handleSendFeedback = async (values: SendFeedbackFormValues) => {
    const result = await sendFeedbackMutation
      .mutateAsync({ ...values, pagePath: pathname })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      form.setError("root", { message: result.errorMessage });
      return;
    }

    setHasSent(true);
  };

  if (hasSent) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Mensagem enviada</DialogTitle>
          <DialogDescription>
            Obrigado por ajudar a Mavik a melhorar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 px-5 py-8 text-center sm:px-7">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-full bg-success-bg text-success"
          >
            <CircleCheck size={28} />
          </span>
          <p className="m-0 text-base leading-normal text-text">
            Recebemos sua mensagem. Se precisar de uma resposta, ela chega no
            seu e-mail.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Fale com a gente</DialogTitle>
        <DialogDescription>{selectedType.description}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSendFeedback)}
          className="m-0 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-7">
            <FormAlert message={form.formState.errors.root?.message} />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobre o que você quer falar?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {feedbackTypeValues.map((feedbackType) => {
                        const { label, icon: Icon } =
                          feedbackTypes[feedbackType];

                        return (
                          <RadioGroupChipItem
                            key={feedbackType}
                            value={feedbackType}
                          >
                            <Icon aria-hidden="true" />
                            {label}
                          </RadioGroupChipItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      maxLength={2000}
                      placeholder={selectedType.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" loading={form.formState.isSubmitting}>
              Enviar mensagem
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

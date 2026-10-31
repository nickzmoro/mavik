"use client";

import { BotMessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { FeedbackForm } from "./feedback-form";

export function FeedbackWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Fale com a gente"
          className="fixed right-4 bottom-4 z-40 px-4 shadow-(--shadow-md) sm:right-6 sm:bottom-6 sm:px-5"
        >
          <BotMessageSquare aria-hidden="true" size={20} />
          <span className="hidden sm:inline">Fale conosco</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <FeedbackForm />
      </DialogContent>
    </Dialog>
  );
}

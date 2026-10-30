import "server-only";

import type OpenAI from "openai";

import { LUNA_MODEL } from "@/lib/ai/models";

import { CAPTION_CLICHES, VISIBLE_WINDOW, humanizeCaption } from "./lint";

const maxAttempts = 2;

export const CAPTION_WRITING_RULES = `A primeira frase é o gancho e precisa ter no máximo ${VISIBLE_WINDOW} caracteres, porque o Instagram corta o resto no "... mais".
Use no máximo uma chamada para ação.
Escreva como uma pessoa: sem travessão, sem aspas curvas, sem reticências e sem estes clichês: ${CAPTION_CLICHES.join(", ")}.`;

export async function writeLintedCaption(
  openai: OpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  getIssues: (caption: string) => string[],
) {
  const conversation = [...messages];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const completion = await openai.chat.completions.create({
      model: LUNA_MODEL,
      messages: conversation,
    });
    const rawCaption = completion.choices[0]?.message.content ?? "";
    const caption = humanizeCaption(
      rawCaption.trim().replace(/^["“]|["”]$/g, ""),
    );
    const issues = getIssues(caption);

    if (issues.length === 0) {
      return caption;
    }

    conversation.push(
      { role: "assistant", content: rawCaption },
      {
        role: "user",
        content: `Legenda reprovada:\n- ${issues.join("\n- ")}\nReescreva corrigindo esses pontos.`,
      },
    );
  }

  return null;
}

export const findForbiddenTerms = (caption: string, forbiddenTerms: string[]) =>
  forbiddenTerms.filter((term) =>
    caption.toLowerCase().includes(term.toLowerCase()),
  );

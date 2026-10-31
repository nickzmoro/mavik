import "server-only";

import { Resend } from "resend";

export const CONTACT_INBOX_EMAIL = "contato@zaiontechbr.com.br";

type ContactEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendContactEmail({
  subject,
  html,
  text,
  replyTo,
}: ContactEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FEEDBACK_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("RESEND_API_KEY ou FEEDBACK_FROM_EMAIL não configurados.");
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: fromEmail,
    to: CONTACT_INBOX_EMAIL,
    replyTo,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

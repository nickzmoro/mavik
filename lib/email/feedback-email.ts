import {
  feedbackTypes,
  type FeedbackType,
} from "@/lib/feedback/feedback-types";

import { escapeHtml } from "./escape-html";

type FeedbackEmailParams = {
  type: FeedbackType;
  message: string;
  pagePath: string;
  fullName: string;
  email: string;
};

const badgeColors: Record<FeedbackType, { background: string; text: string }> =
  {
    suggestion: { background: "#efe8fd", text: "#3b1a8c" },
    question: { background: "#e3f6f0", text: "#1b1530" },
    bug: { background: "#fde8e8", text: "#1b1530" },
  };

const bodyFont = "Inter, Arial, Helvetica, sans-serif";
const displayFont = "Poppins, Arial, Helvetica, sans-serif";

function buildDetailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 8px 0; font-family: ${bodyFont}; font-size: 12px; line-height: 1.4; font-weight: 500; color: #5e5877; width: 80px; vertical-align: top">${label}</td>
      <td style="padding: 8px 0; font-family: ${bodyFont}; font-size: 14px; line-height: 1.5; color: #1b1530; word-break: break-word">${value}</td>
    </tr>`;
}

export function buildFeedbackEmailSubject({
  type,
  fullName,
  email,
}: Pick<FeedbackEmailParams, "type" | "fullName" | "email">) {
  return `[${feedbackTypes[type].emailLabel}] Mensagem de ${fullName || email || "usuário"} pelo app`;
}

export function buildFeedbackEmailText({
  type,
  message,
  pagePath,
  fullName,
  email,
}: FeedbackEmailParams) {
  return [
    `${feedbackTypes[type].emailLabel} enviada pelo app da Zaion`,
    "",
    `Nome: ${fullName || "Não informado"}`,
    `E-mail: ${email || "Não informado"}`,
    `Página: ${pagePath}`,
    "",
    message,
  ].join("\n");
}

export function buildFeedbackEmailHtml({
  type,
  message,
  pagePath,
  fullName,
  email,
}: FeedbackEmailParams) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const { emailLabel } = feedbackTypes[type];
  const badge = badgeColors[type];
  const safeName = escapeHtml(fullName || "Não informado");
  const safeEmail = escapeHtml(email);
  const emailValue = email
    ? `<a href="mailto:${safeEmail}" style="color: #5926c8">${safeEmail}</a>`
    : "Não informado";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${emailLabel} pelo app da Zaion</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f6fe">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0">
      ${emailLabel} de ${safeName} pelo app da Zaion.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f6fe">
      <tr>
        <td align="center" style="padding: 48px 16px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px">
            <tr>
              <td align="center" style="padding-bottom: 32px">
                <img src="${siteUrl}/email/zaion-logo.png" width="144" height="37" alt="Zaion" style="display: block; border: 0; outline: none" />
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; border: 1px solid #e2ddf0; border-radius: 16px; padding: 40px 32px">
                <span style="display: inline-block; padding: 6px 14px; border-radius: 999px; background-color: ${badge.background}; font-family: ${displayFont}; font-size: 12px; line-height: 1.2; font-weight: 600; color: ${badge.text}">${emailLabel}</span>
                <h1 style="margin: 16px 0 8px; font-family: ${displayFont}; font-size: 24px; line-height: 1.25; font-weight: 700; color: #1b1530">Nova mensagem pelo app</h1>
                <p style="margin: 0 0 24px; font-family: ${bodyFont}; font-size: 16px; line-height: 1.6; color: #5e5877">${safeName} escreveu para a Zaion.</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f6fe; border: 1px solid #e2ddf0; border-radius: 16px">
                  <tr>
                    <td style="padding: 20px; font-family: ${bodyFont}; font-size: 16px; line-height: 1.6; color: #1b1530; white-space: pre-wrap; word-break: break-word">${escapeHtml(message)}</td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; border-top: 1px solid #e2ddf0">
                  ${buildDetailRow("Nome", safeName)}
                  ${buildDetailRow("E-mail", emailValue)}
                  ${buildDetailRow("Página", escapeHtml(pagePath))}
                </table>

                ${
                  email
                    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px">
                  <tr>
                    <td align="center">
                      <a href="mailto:${safeEmail}" style="display: inline-block; padding: 15px 32px; background-color: #5926c8; border-radius: 999px; font-family: ${displayFont}; font-size: 14px; line-height: 1; font-weight: 600; color: #ffffff; text-decoration: none">Responder ${safeName === "Não informado" ? "usuário" : safeName}</a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 24px; font-family: ${bodyFont}; font-size: 12px; line-height: 1.5; color: #5e5877">
                Enviado pelo formulário “Fale com a gente” do app.<br />
                © 2026 Zaion. Todos os direitos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

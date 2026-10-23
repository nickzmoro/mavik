export type AuthActionResult<TData = undefined> =
  | { isSuccess: true; data: TData }
  | { isSuccess: false; errorMessage: string };

export function authSuccess<TData>(data: TData): AuthActionResult<TData> {
  return { isSuccess: true, data };
}

export function authFailure(errorMessage: string): AuthActionResult<never> {
  return { isSuccess: false, errorMessage };
}

export const authErrorMessages = {
  invalidInput: "Confira os dados do formulário e tente de novo.",
  invalidCredentials: "E-mail ou senha incorretos. Confira e tente de novo.",
  captchaFailed:
    "Não conseguimos confirmar que você não é um robô. Tente de novo.",
  emailNotConfirmed:
    "Confirme seu e-mail para entrar. Enviamos o link para sua caixa de entrada.",
  weakPassword:
    "Essa senha é fácil de adivinhar ou já apareceu em vazamentos. Escolha outra.",
  emailSendLimit:
    "Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos.",
  unexpected: "Algo deu errado do nosso lado. Tente de novo em alguns minutos.",
  tooManyAttempts: (retryAfter: string) =>
    `Muitas tentativas. Por segurança, tente de novo em ${retryAfter}.`,
};

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  return `${localPart.slice(0, 2)}***@${domain ?? ""}`;
}

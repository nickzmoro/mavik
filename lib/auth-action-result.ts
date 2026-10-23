export type AuthActionResult<TData = undefined> =
  | { isSuccess: true; data: TData }
  | { isSuccess: false; errorMessage: string; errorField?: string };

export function authSuccess<TData>(data: TData): AuthActionResult<TData> {
  return { isSuccess: true, data };
}

export function authFailure(
  errorMessage: string,
  errorField?: string,
): AuthActionResult<never> {
  return { isSuccess: false, errorMessage, errorField };
}

export const authErrorMessages = {
  invalidInput: "Confira os dados do formulário e tente de novo.",
  invalidCredentials: "E-mail ou senha incorretos. Confira e tente de novo.",
  captchaFailed:
    "Não conseguimos confirmar que você não é um robô. Tente de novo.",
  emailNotConfirmed:
    "Confirme seu e-mail para entrar. Enviamos o link para sua caixa de entrada.",
  userAlreadyExists:
    "Já existe uma conta com esse e-mail. Entre com sua senha ou use “Esqueceu a senha?” no login.",
  weakPassword:
    "Essa senha é fácil de adivinhar ou já apareceu em vazamentos. Escolha outra.",
  samePassword: "A nova senha precisa ser diferente da atual.",
  emailSendLimit:
    "Já enviamos um e-mail há pouco. Espere 1 minuto e tente de novo.",
  emailAddressInvalid:
    "Esse endereço de e-mail não é aceito. Use outro e-mail.",
  emailNotAuthorized:
    "Não conseguimos enviar e-mails para esse endereço agora. Use outro e-mail ou fale com o suporte.",
  signUpDisabled: "O cadastro por e-mail está desativado no momento.",
  userBanned: "Essa conta está bloqueada. Fale com o suporte.",
  sessionExpired:
    "Sua sessão expirou. Peça um novo link de redefinição de senha.",
  recoveryLinkRequired:
    "Para criar uma nova senha, abra o link que enviamos para o seu e-mail.",
  recoveryLinkInvalid:
    "Esse link para criar uma nova senha expirou ou já foi usado. Peça um novo link em “Esqueceu a senha?”.",
  emailDeliveryFailed:
    "Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos. Se continuar, fale com o suporte.",
  serverUnavailable:
    "O servidor de login não respondeu. Tente de novo em alguns minutos.",
  connectionFailed:
    "Não conseguimos conectar. Confira sua internet e tente de novo.",
  rateLimited: "Muitas tentativas. Por segurança, tente de novo em alguns minutos.",
  unexpected: (errorCode?: string) =>
    `Algo deu errado do nosso lado${errorCode ? ` (código: ${errorCode})` : ""}. Tente de novo em alguns minutos.`,
  tooManyAttempts: (retryAfter: string) =>
    `Muitas tentativas. Por segurança, tente de novo em ${retryAfter}.`,
};

export function connectionFailure() {
  return authFailure(authErrorMessages.connectionFailed);
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  return `${localPart.slice(0, 2)}***@${domain ?? ""}`;
}

export const routes = {
  home: "/",
  login: "/login",
  signUp: "/criar-conta",
  recoverPassword: "/esqueci-minha-senha",
  resetPassword: "/redefinir-senha",
  authConfirm: "/auth/confirm",
  authCallback: "/auth/callback",
  terms: "/termos",
  privacy: "/privacidade",
  appRoot: "/app",
  authenticatedHome: "/app/inicio",
  agent: "/app/agente",
  ideas: "/app/ideias",
  studio: "/app/estudio",
  schedule: "/app/agenda",
  results: "/app/resultados",
  brand: "/app/marca",
  onboarding: "/app/etapas",
  plans: "/app/planos",
} as const;

export const getAgentConversationRoute = (conversationId: string) =>
  `${routes.agent}/${encodeURIComponent(conversationId)}`;

export const getOnboardingStepRoute = (step: number) =>
  `${routes.onboarding}?etapa=${step}`;

export const STUDIO_PAUTA_PARAM = "pauta";

export function getStudioUrlForPauta(pauta: string) {
  return `${routes.studio}?${new URLSearchParams({ [STUDIO_PAUTA_PARAM]: pauta })}`;
}

export const STUDIO_ARTWORK_PARAM = "arte";

export function getStudioUrlForArtwork(artworkId: string) {
  return `${routes.studio}?${new URLSearchParams({ [STUDIO_ARTWORK_PARAM]: artworkId })}`;
}

export const authRoutes = [routes.login, routes.signUp, routes.recoverPassword];

export const protectedRoutes = [routes.appRoot, routes.resetPassword];

export const BRAND_TAB_PARAM = "aba";
export const INSTAGRAM_RESULT_PARAM = "instagram";

export type InstagramConnectResult =
  | "conectado"
  | "erro"
  | "negado"
  | "sem_conta";

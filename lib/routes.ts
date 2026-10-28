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
  plans: "/app/planos",
  onboarding: "/onboarding",
  onboardingCompany: "/onboarding/empresa",
  onboardingBrand: "/onboarding/marca",
  onboardingVoice: "/onboarding/voz",
  onboardingPlan: "/onboarding/plano",
} as const;

export const getAgentConversationRoute = (conversationId: string) =>
  `${routes.agent}/${encodeURIComponent(conversationId)}`;

export const STUDIO_PAUTA_PARAM = "pauta";

export function getStudioUrlForPauta(pauta: string) {
  return `${routes.studio}?${new URLSearchParams({ [STUDIO_PAUTA_PARAM]: pauta })}`;
}

export const authRoutes = [
  routes.login,
  routes.signUp,
  routes.recoverPassword,
];

export const protectedRoutes = [
  routes.appRoot,
  routes.onboarding,
  routes.resetPassword,
];

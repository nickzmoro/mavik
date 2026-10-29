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

export const authRoutes = [
  routes.login,
  routes.signUp,
  routes.recoverPassword,
];

export const protectedRoutes = [routes.appRoot, routes.resetPassword];

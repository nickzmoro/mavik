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
} as const;

export const authRoutes = [
  routes.login,
  routes.signUp,
  routes.recoverPassword,
];

export const protectedRoutes = [routes.appRoot, routes.resetPassword];

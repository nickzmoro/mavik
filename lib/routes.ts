export const routes = {
  home: "/",
  login: "/login",
  signUp: "/criar-conta",
  recoverPassword: "/esqueci-minha-senha",
  authConfirm: "/auth/confirm",
  authenticatedHome: "/inicio",
} as const;

export const authRoutes = [
  routes.login,
  routes.signUp,
  routes.recoverPassword,
];

export const protectedRoutes = [routes.authenticatedHome];

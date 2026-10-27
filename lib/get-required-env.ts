export function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

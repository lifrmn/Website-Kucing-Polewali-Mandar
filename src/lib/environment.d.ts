export function getProductionEnvironmentErrors(
  environment?: NodeJS.ProcessEnv
): string[];

export function assertProductionEnvironment(
  environment?: NodeJS.ProcessEnv
): void;
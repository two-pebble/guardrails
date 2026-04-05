export interface Config {
  port: number;
}

export function createConfig(): Config {
  return { port: 3000 };
}

// This types.ts should FAIL — contains a const
export interface User {
  name: string;
}

export type Id = string;

export const DEFAULT_NAME = "test";

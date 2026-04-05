// This file should PASS the no-complex-returns rule
type Config = { name: string; value: number };
type Result = string | null;

function getConfig(): Config {
  return { name: "a", value: 1 };
}

function getResult(): Result {
  return null;
}

function greet(): string {
  return "hello";
}

const add = (a: number, b: number) => a + b;

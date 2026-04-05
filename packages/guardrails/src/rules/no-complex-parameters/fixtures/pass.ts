// This file should PASS the no-complex-parameters rule
type Options = { name: string; value: number };
type Executor = (name: string) => Promise<string>;

function greet(name: string) {
  return `hello ${name}`;
}

function configure(opts: Options) {
  return opts;
}

const add = (a: number, b: number) => a + b;

function configureExecutor(executor: Executor) {
  return executor;
}

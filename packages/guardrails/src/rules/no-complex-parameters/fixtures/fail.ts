// This file should FAIL the no-complex-parameters rule
function configure(opts: { name: string; value: number }) {
  return opts;
}

function choose(x: string | number) {
  return x;
}

function useTuple(pair: [string, number]) {
  return pair;
}

function useArray(items: string[]) {
  return items;
}

function configureExecutor(executor: (name: string) => Promise<string>) {
  return executor;
}

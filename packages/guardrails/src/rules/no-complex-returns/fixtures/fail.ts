// This file should FAIL the no-complex-returns rule
function getConfig(): { name: string; value: number } {
  return { name: "a", value: 1 };
}

function getResult(): string | null {
  return null;
}

const getCallback = (): ((x: string) => void) => {
  return () => {};
};

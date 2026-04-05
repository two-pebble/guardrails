// This file should PASS the no-inline-await rule
async function example() {
  await doSomething();
  const result = await fetchData();
  let x: string;
  x = await getName();
  return result;
}

declare function doSomething(): Promise<void>;
declare function fetchData(): Promise<string>;
declare function getName(): Promise<string>;

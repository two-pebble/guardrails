// This file should FAIL the no-inline-await rule
async function example() {
  return await fetchData();
  const upper = (await fetchData()).toUpperCase();
  console.log(await fetchData());
}

declare function fetchData(): Promise<string>;

// This file should FAIL the max-test-it-block-lines rule
it("very long test", () => {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = 4;
  const e = 5;
  const f = 6;
  const g = 7;
  const h = 8;
  const i = 9;
  const j = 10;
  expect(a).toBe(1);
});

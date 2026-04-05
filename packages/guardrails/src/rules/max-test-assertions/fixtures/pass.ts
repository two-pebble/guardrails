// This file should PASS the max-test-assertions rule
it("has exactly one assertion", () => {
  expect(1 + 1).toBe(2);
});

it("uses assert instead", () => {
  assert(true);
});

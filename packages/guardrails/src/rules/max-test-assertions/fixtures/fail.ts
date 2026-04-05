// This file should FAIL the max-test-assertions rule
it("has multiple assertions", () => {
  expect(1 + 1).toBe(2);
  expect(2 + 2).toBe(4);
});

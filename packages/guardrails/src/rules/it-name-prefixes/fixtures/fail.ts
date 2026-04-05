import { describe, expect, it, test } from "vitest";

describe("example", () => {
  it("happy: uses it instead of test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should add numbers", () => {
    expect(1 + 1).toBe(2);
  });

  test("works correctly", () => {
    expect(true).toBe(true);
  });
});

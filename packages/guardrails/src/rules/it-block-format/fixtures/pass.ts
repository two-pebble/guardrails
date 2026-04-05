import { describe, expect, test } from "vitest";

describe("example", () => {
  test("happy: should work", () => {
    const a = 1;
    const b = 2;
    const result = a + b;
    expect(result).toBe(3);
    expect(result).toBeGreaterThan(0);
  });
});

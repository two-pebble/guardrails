import { describe, expect, test } from "vitest";

describe("example", () => {
  test("happy: should add numbers", () => {
    expect(1 + 1).toBe(2);
  });

  test("unhappy: should throw on invalid input", () => {
    expect(() => {
      throw new Error();
    }).toThrow();
  });

  test("snapshot: should match output", () => {
    expect({ a: 1 }).toMatchSnapshot();
  });
});

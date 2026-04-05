import { describe, expect, it, test } from "vitest";

const myTest = () => {
  expect(1).toBe(1);
};

describe("example", () => {
  it("happy: uses it instead of test", () => {
    expect(1).toBe(1);
  });

  test("happy: too short", () => {
    expect(1).toBe(1);
  });

  test("happy: not inline", myTest);
});

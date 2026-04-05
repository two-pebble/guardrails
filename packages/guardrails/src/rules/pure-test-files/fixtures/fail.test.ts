import { describe, expect, it } from "vitest";

function helper() {
  return 42;
}

describe("my feature", () => {
  function innerHelper() {
    return 1;
  }

  it("should work", () => {
    expect(helper()).toBe(42);
  });
});

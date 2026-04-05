import { describe, expect, it } from "vitest";

describe("snapshots", () => {
  it("snapshot: renders correctly", () => {
    const result = { hello: "world" };
    expect(result).toMatchFileSnapshot("../wrong/result.snap");
  });
});

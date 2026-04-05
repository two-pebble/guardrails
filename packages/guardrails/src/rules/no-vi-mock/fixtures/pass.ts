import { describe, expect, it } from "vitest";

const fakeService = { run: () => "fake" };

describe("test", () => {
  it("uses explicit fakes", () => {
    expect(fakeService.run()).toBe("fake");
  });
});

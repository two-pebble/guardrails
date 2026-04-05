import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoViMockRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-vi-mock", () => {
  const rule = new NoViMockRule();

  test("unhappy: should fail when vi.mock() is used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when explicit fakes are used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

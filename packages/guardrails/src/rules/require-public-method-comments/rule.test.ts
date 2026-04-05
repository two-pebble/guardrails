import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequirePublicMethodCommentsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("require-public-method-comments", () => {
  const rule = new RequirePublicMethodCommentsRule();

  test("unhappy: should fail on public methods without comments", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when public methods have comments", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

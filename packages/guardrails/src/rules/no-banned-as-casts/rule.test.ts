import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoBannedAsCastsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-banned-as-casts", () => {
  const rule = new NoBannedAsCastsRule();

  test("unhappy: should fail on as any, as unknown, as never", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass on allowed type assertions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

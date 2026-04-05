import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoMixedLogicalOperatorsInIfRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-mixed-logical-operators-in-if", () => {
  const rule = new NoMixedLogicalOperatorsInIfRule();

  test("unhappy: should fail when if condition mixes && and ||", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when if conditions use only one operator type", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

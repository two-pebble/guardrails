import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequireClassJsdocRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("require-class-jsdoc", () => {
  const rule = new RequireClassJsdocRule();

  test("happy: should pass when classes have JSDoc", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when classes lack JSDoc", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

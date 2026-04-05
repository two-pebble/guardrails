import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoComplexParametersRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-complex-parameters", () => {
  const rule = new NoComplexParametersRule();

  test("unhappy: should fail on inline object, union, tuple, array, and function parameter types", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(5);
  });

  test("happy: should pass on simple named parameter types", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

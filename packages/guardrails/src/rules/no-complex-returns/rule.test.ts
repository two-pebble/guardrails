import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoComplexReturnsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-complex-returns", () => {
  const rule = new NoComplexReturnsRule();

  test("unhappy: should fail on inline object, union, tuple, and function return types", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass on simple named return types", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

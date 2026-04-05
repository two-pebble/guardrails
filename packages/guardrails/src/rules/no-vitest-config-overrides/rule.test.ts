import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoVitestConfigOverridesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-vitest-config-overrides", () => {
  const rule = new NoVitestConfigOverridesRule();

  test("unhappy: should fail when coverage.exclude is used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail-coverage-exclude.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("unhappy: should fail when passWithNoTests is true", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail-pass-with-no-tests.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when neither violation is present", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

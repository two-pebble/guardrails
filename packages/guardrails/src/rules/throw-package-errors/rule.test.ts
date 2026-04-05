import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ThrowPackageErrorsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("throw-package-errors", () => {
  const rule = new ThrowPackageErrorsRule();

  test("happy: should pass when throwing imported custom errors", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when throwing generic errors", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should skip errors.ts itself", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/errors.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

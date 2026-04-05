import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PackageErrorsFileRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("package-errors-file", () => {
  const rule = new PackageErrorsFileRule();

  test("unhappy: should fail when src/errors.ts does not export a custom error class", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail"),
      paths: ["src/errors.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when src/errors.ts exports a custom error class extending Error", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "pass"),
      paths: ["src/errors.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

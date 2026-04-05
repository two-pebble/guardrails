import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { MaxIndentDepthRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("max-indent-depth", () => {
  const rule = new MaxIndentDepthRule();

  test("unhappy: should fail when indentation exceeds 8 levels", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
  });

  test("happy: should pass when indentation is within 8 levels", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("happy: should respect excludes", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["*.ts"],
      exclude: ["fail.ts"],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

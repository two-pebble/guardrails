import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { CodeStructureRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("code-structure", () => {
  const rule = new CodeStructureRule();

  test("unhappy: should fail when a directory is missing required files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*"],
      exclude: [],
      options: { files: ["./**/rule.test.ts"] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when all directories have required files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*"],
      exclude: [],
      options: { files: ["./**/rule.ts"] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when directory has direct files with no-direct-files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*"],
      exclude: [],
      options: { "no-direct-files": ["."] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBeGreaterThan(0);
  });

  test("unhappy: should fail when directory has subdirectories with no-sub-folders", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*"],
      exclude: [],
      options: { "no-sub-folders": ["."] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });
});

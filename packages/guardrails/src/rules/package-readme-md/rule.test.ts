import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PackageReadmeMdRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("package-readme-md", () => {
  const rule = new PackageReadmeMdRule();

  test("unhappy: should fail when README.md is missing", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail-missing"),
      paths: ["package.json"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("unhappy: should fail when README.md has invalid structure", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail-invalid"),
      paths: ["package.json"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when README.md exists with correct structure", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "pass"),
      paths: ["package.json"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

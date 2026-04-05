import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ExportClassesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("export-classes", () => {
  const rule = new ExportClassesRule();

  test("unhappy: should fail on unexported classes and class expressions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on exported classes", async () => {
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

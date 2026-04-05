import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ClassOwnsUtilitiesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("class-owns-utilities", () => {
  const rule = new ClassOwnsUtilitiesRule();

  test("unhappy: should fail when a class file has top-level functions or variables", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when a class file has no top-level functions or variables", async () => {
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

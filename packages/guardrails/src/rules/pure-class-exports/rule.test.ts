import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureClassExportsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-class-exports", () => {
  const rule = new PureClassExportsRule();

  test("happy: should pass when a file exports only a class", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when a class file has additional exports", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should skip errors.ts files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["errors.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

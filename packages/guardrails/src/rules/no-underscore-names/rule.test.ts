import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoUnderscoreNamesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-underscore-names", () => {
  const rule = new NoUnderscoreNamesRule();

  test("unhappy: should fail when variable or class names contain underscores", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when names use camelCase or PascalCase", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

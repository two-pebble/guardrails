import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ItNamePrefixesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("test-name-prefixes", () => {
  const rule = new ItNamePrefixesRule();

  test("unhappy: should fail when it() is used and when test titles lack valid prefixes", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass when all test titles have valid prefixes", async () => {
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

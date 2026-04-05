import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { SingleTsxExportRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("single-tsx-export", () => {
  const rule = new SingleTsxExportRule();

  test("happy: passes with one top-level function", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["one-function.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: fails with multiple top-level functions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["two-functions.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureTsxFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-tsx-files", () => {
  const rule = new PureTsxFilesRule();

  test("happy: should pass on TSX files with a single function", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail on TSX files with multiple functions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "multiple-functions")).toBe(true);
  });
});

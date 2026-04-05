import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ItBlockFormatRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("test-block-format", () => {
  const rule = new ItBlockFormatRule();

  test("unhappy: should fail on it() calls, non-block callbacks, and short test blocks", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass on well-formatted test blocks", async () => {
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

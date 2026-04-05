import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoNestedDescribeBlocksRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-nested-describe-blocks", () => {
  const rule = new NoNestedDescribeBlocksRule();

  test("unhappy: should fail when describe blocks are nested", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when describe blocks are flat", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

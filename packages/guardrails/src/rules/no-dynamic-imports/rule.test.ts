import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoDynamicImportsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-dynamic-imports", () => {
  const rule = new NoDynamicImportsRule();

  test("unhappy: should fail on dynamic import() and inline import type queries", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on static imports", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

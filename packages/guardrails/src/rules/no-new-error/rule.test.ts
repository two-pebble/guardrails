import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoNewErrorRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-new-error", () => {
  const rule = new NoNewErrorRule();

  test("unhappy: should fail when built-in error constructor is used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when custom error classes are used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

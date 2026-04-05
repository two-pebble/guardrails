import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoSingleLineBlockCommentsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-single-line-block-comments", () => {
  const rule = new NoSingleLineBlockCommentsRule();

  test("unhappy: should fail on single-line block comments", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass on multiline block comments and single-line comments", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

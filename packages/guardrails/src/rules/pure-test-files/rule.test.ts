import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureTestFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-test-files", () => {
  const rule = new PureTestFilesRule();

  test("happy: should pass on clean test files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail on test files with top-level helpers and non-test in describe", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });
});

import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { TestFilesUseVitestRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("test-files-use-vitest", () => {
  const rule = new TestFilesUseVitestRule();

  test("happy: should pass on test files using vitest", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail on test files importing from node:test or assert", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });
});

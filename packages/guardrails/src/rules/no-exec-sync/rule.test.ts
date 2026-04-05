import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoExecSyncRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-exec-sync", () => {
  const rule = new NoExecSyncRule();

  test("unhappy: should fail on files with execSync", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on files with async exec", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

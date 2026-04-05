import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoImportMetaUrlRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-import-meta-url", () => {
  const rule = new NoImportMetaUrlRule();

  test("unhappy: should fail on import.meta.url usage", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on other import.meta properties", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureIndexFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-index-files", () => {
  const rule = new PureIndexFilesRule();

  test("unhappy: should fail when index.ts contains non-reexport statements", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["index.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass for non-index files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

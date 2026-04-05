import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { MaxTestItBlockLinesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("max-test-it-block-lines", () => {
  const rule = new MaxTestItBlockLinesRule();

  test("unhappy: should fail on test blocks exceeding 10 non-comment lines", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass on test blocks within 10 non-comment lines", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

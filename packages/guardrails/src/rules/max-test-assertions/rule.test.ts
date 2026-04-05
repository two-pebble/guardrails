import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { MaxTestAssertionsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("max-test-assertions", () => {
  const rule = new MaxTestAssertionsRule();

  test("unhappy: should fail on test blocks with more than 1 assertion", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass on test blocks with at most one assertion", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

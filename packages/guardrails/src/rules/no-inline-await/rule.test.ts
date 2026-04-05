import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoInlineAwaitRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-inline-await", () => {
  const rule = new NoInlineAwaitRule();

  test("unhappy: should fail on return await and inline await", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass on standalone and direct assignment awaits", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

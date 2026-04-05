import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoCustomStyleRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-custom-style", () => {
  const rule = new NoCustomStyleRule();

  test("unhappy: should fail on className and style JSX attributes in tsx files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on tsx files without className or style", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

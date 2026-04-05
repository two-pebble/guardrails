import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequireSyntaxExampleRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("require-syntax-example", () => {
  const rule = new RequireSyntaxExampleRule();

  test("happy: passes when SyntaxExample is used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-syntax.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: fails when SyntaxExample is missing", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["without-syntax.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

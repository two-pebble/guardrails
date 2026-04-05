import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoStoryClassnameOrStyleRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-story-classname-or-style", () => {
  const rule = new NoStoryClassnameOrStyleRule();

  test("unhappy: should fail when story files use className or style props", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when story files do not use className or style", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

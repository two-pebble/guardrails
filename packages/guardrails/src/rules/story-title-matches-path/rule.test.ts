import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { StoryTitleMatchesPathRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("story-title-matches-path", () => {
  const rule = new StoryTitleMatchesPathRule();

  test("happy: passes when title segments match ancestor folders", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["input/button/button.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: fails when folder does not match title segment", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["wrong-path/button.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

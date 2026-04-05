import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequireComponentStoryRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("require-component-story", () => {
  const rule = new RequireComponentStoryRule();

  test("happy: should pass when a component has a story file", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when a component lacks a story file", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["no-story/no-story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should skip story files themselves", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-story.story.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

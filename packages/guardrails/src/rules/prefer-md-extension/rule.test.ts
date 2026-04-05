import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PreferMdExtensionRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("prefer-md-extension", () => {
  const rule = new PreferMdExtensionRule();

  test("unhappy: should fail when a markdown file uses the .markdown extension", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail"),
      exclude: [],
    });

    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  test("happy: should pass when a markdown file uses the .md extension", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "pass"),
      exclude: [],
    });

    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics).toHaveLength(0);
  });
});

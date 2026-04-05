import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequiredScriptsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("required-scripts", () => {
  const rule = new RequiredScriptsRule();

  test("unhappy: should fail when configured package scripts are missing", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail"),
      paths: ["package.json"],
      exclude: [],
      options: { requiredScripts: ["build", "test", "typecheck"] },
    });

    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics).toHaveLength(1);
  });

  test("happy: should pass when configured package scripts exist", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "pass"),
      paths: ["package.json"],
      exclude: [],
      options: { requiredScripts: ["build", "test", "typecheck"] },
    });

    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics).toHaveLength(0);
  });
});

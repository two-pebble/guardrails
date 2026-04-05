import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PathNamesKebabCaseRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("path-names-kebab-case", () => {
  const rule = new PathNamesKebabCaseRule();

  test("happy: should pass on kebab-case file names", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail on file names with underscores", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail_underscore.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "file-underscore")).toBe(true);
  });

  test("unhappy: should fail on uppercase TypeScript file names", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["FailUppercase.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "ts-uppercase")).toBe(true);
  });
});

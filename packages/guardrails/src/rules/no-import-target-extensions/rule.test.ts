import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoImportTargetExtensionsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-import-target-extensions", () => {
  const rule = new NoImportTargetExtensionsRule();

  test("unhappy: should fail on imports/exports with .js or .ts extensions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(3);
  });

  test("happy: should pass on extensionless import specifiers", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

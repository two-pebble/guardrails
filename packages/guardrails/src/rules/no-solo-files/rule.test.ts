import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoSoloFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-solo-files", () => {
  const rule = new NoSoloFilesRule();

  test("unhappy: should fail when a directory contains only one TypeScript file", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "fail"),
      paths: ["**/*.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when directories contain multiple files", async () => {
    const reporters = await rule.execute({
      packageDir: resolve(fixturesDir, "pass"),
      paths: ["**/*.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

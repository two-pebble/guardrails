import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ClassFileNameMatchesClassRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("class-file-name-matches-class", () => {
  const rule = new ClassFileNameMatchesClassRule();

  test("happy: should pass when filename matches class name in kebab-case", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["my-service.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when filename does not match class name", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["wrong-name.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should skip errors.ts files", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["errors.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("happy: should respect excludes", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["*.ts"],
      exclude: ["wrong-name.ts"],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

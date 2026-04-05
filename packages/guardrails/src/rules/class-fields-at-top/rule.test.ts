import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ClassFieldsAtTopRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("class-fields-at-top", () => {
  const rule = new ClassFieldsAtTopRule();

  test("unhappy: should fail when fields appear after methods or have blank lines", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(4);
  });

  test("happy: should pass when fields are at top with no blank lines", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when blank lines separate fields", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail-blank-lines.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should respect excludes", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["*.ts"],
      exclude: ["fail.ts", "fail-blank-lines.ts"],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

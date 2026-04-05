import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureUtilsFoldersRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-utils-folders", () => {
  const rule = new PureUtilsFoldersRule();

  test("happy: should pass on a utils file exporting exactly one function", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["utils/format-date.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when a utils file exports multiple functions", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["utils/multi-export.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "utils-not-single-fn")).toBe(true);
  });

  test("happy: should allow snapshots subdirectories inside utils folders", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["utils/format-date.ts", "utils/snapshots/**"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "utils-subdir")).toBe(false);
  });

  test("happy: should ignore test files and test helpers in utils folders", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["utils/format-date.ts", "utils/format-date.test.ts", "utils/test-formatters.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "utils-not-single-fn")).toBe(false);
  });

  test("unhappy: should still fail on non-snapshots subdirectories inside utils folders", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["utils-subdir-fail/utils/**"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "utils-subdir")).toBe(true);
  });
});

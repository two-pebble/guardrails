import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoLocalContractsInPureClassFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-local-contracts-in-pure-class-files", () => {
  const rule = new NoLocalContractsInPureClassFilesRule();

  test("unhappy: should fail when a class file defines local interfaces or type aliases", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when a class file has no local contracts", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

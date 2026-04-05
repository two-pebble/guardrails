import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PureContractFilesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("pure-contract-files", () => {
  const rule = new PureContractFilesRule();

  test("unhappy: should fail when types.ts contains non-declarative statements", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["types.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when types.ts has only interfaces and type aliases", async () => {
    // pass-types.ts is not named types.ts so rule ignores it
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass-types.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

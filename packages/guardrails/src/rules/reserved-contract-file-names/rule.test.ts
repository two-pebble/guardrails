import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ReservedContractFileNamesRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("reserved-contract-file-names", () => {
  const rule = new ReservedContractFileNamesRule();

  test("happy: should pass on types.ts", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["types.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test('happy: should pass on files without "types" in the name', async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test('unhappy: should fail on files with "types" in the name that are not types.ts', async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["user-types.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

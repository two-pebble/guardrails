import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { TypesOnlyInTypesFilesRule } from "./rule";

const rule = new TypesOnlyInTypesFilesRule();
const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("TypesOnlyInTypesFilesRule", () => {
  test("happy: allows files named types.ts", async () => {
    const reporters = await rule.execute({ packageDir: fixturesDir, paths: ["types.ts"], exclude: [] });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics).toHaveLength(0);
  });

  test("happy: allows files that export runtime values alongside types", async () => {
    const reporters = await rule.execute({ packageDir: fixturesDir, paths: ["pass-has-runtime.ts"], exclude: [] });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics).toHaveLength(0);
  });

  test("unhappy: fails files that only export types but are not named types.ts", async () => {
    const reporters = await rule.execute({ packageDir: fixturesDir, paths: ["fail-types-only.ts"], exclude: [] });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics).toHaveLength(1);
  });
});

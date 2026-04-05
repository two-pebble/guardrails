import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoGlobalThisRule } from "./rule";

const rule = new NoGlobalThisRule();
const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("NoGlobalThisRule", () => {
  test("happy: allows files without globalThis", async () => {
    const reporters = await rule.execute({ packageDir: fixturesDir, paths: ["pass.ts"], exclude: [] });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics).toHaveLength(0);
  });

  test("unhappy: fails files that use globalThis", async () => {
    const reporters = await rule.execute({ packageDir: fixturesDir, paths: ["fail.ts"], exclude: [] });
    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics).toHaveLength(1);
  });
});

import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoObjectDestructuringParametersRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-object-destructuring-parameters", () => {
  const rule = new NoObjectDestructuringParametersRule();

  test("unhappy: should fail when function parameters use object destructuring", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass when functions use named parameters", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

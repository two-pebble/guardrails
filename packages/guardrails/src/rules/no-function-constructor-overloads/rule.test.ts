import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoFunctionConstructorOverloadsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-function-constructor-overloads", () => {
  const rule = new NoFunctionConstructorOverloadsRule();

  test("unhappy: should fail on function overloads and constructor overloads", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(2);
  });

  test("happy: should pass on single function and constructor declarations", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

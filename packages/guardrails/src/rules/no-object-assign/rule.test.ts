import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoObjectAssignRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-object-assign", () => {
  const rule = new NoObjectAssignRule();

  test("unhappy: should fail when Object.assign is used", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("happy: should pass when spread syntax is used instead", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });
});

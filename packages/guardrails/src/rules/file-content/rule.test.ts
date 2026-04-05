import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { FileContentRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("file-content", () => {
  const rule = new FileContentRule();

  test("happy: should pass when files contain the required string", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*.ts"],
      exclude: [],
      options: { cases: [{ string: "tenantId: string", paths: "operations/pass.ts" }] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when a file is missing the required string", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["**/*.ts"],
      exclude: [],
      options: { cases: [{ string: "tenantId: string", paths: "operations/fail.ts" }] },
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.some((d) => d.error === "missing-content")).toBe(true);
  });
});

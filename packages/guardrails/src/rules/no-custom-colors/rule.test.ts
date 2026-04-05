import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NoCustomColorsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("no-custom-colors", () => {
  const rule = new NoCustomColorsRule();

  test("happy: passes with theme tokens only", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["clean.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: fails with hex color", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-hex.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("unhappy: fails with tailwind color class", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-tailwind-color.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

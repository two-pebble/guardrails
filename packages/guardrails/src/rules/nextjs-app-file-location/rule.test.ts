import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { NextjsAppFileLocationRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("nextjs-app-file-location", () => {
  const rule = new NextjsAppFileLocationRule();

  test("happy: should pass for route files like page.tsx and data.ts", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/app/settings/page.tsx", "src/app/settings/data.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("happy: should pass for files inside a components folder", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/app/settings/components/theme-toggle.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("happy: should pass for files inside an actions folder", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/app/settings/actions/save.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail for non-route files directly in an app folder", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["src/app/dashboard/my-widget.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics[0].error).toBe("misplaced-app-file");
  });
});

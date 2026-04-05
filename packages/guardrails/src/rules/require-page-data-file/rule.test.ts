import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { RequirePageDataFileRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("require-page-data-file", () => {
  const rule = new RequirePageDataFileRule();

  test("happy: should pass when page.tsx has a valid data.ts sidecar", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["with-data/page.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when page.tsx has no data.ts file", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["no-data/page.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics[0].error).toBe("missing-data-file");
  });

  test("unhappy: should fail when data.ts exists but lacks loadPageData export", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["bad-data/page.tsx"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics[0].error).toBe("missing-load-page-data");
  });
});

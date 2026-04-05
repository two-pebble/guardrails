import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { SnapshotTestsUseFileSnapshotsRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");

describe("snapshot-tests-use-file-snapshots", () => {
  const rule = new SnapshotTestsUseFileSnapshotsRule();

  test("happy: should pass on tests using toMatchFileSnapshot with correct path", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["pass.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail on tests using toMatchSnapshot", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail-inline.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });

  test("unhappy: should fail on tests using wrong snapshot path", async () => {
    const reporters = await rule.execute({
      packageDir: fixturesDir,
      paths: ["fail-path.test.ts"],
      exclude: [],
    });

    const diagnostics = reporters.flatMap((r) => r.diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});

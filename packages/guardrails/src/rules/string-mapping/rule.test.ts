import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { StringMappingRule } from "./rule";

const fixturesDir = resolve(import.meta.dirname, "fixtures");
const createContext = (scope: string) => ({
  packageDir: fixturesDir,
  paths: ["**/*.ts"],
  exclude: [],
  options: {
    cases: [
      {
        source: { type: "files-like", files: `${scope}/operations/*.ts` },
        matches: {
          type: "strings-like",
          files: `${scope}/testing/*.ts`,
          pattern: 'describe("Operation: $1"',
        },
      },
    ],
  },
});

describe("string-mapping", () => {
  const rule = new StringMappingRule();

  test("happy: should pass when every source file has a mapped string in target files", async () => {
    const reporters = await rule.execute(createContext("pass"));
    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics.length).toBe(0);
  });

  test("unhappy: should fail when a source file is missing its mapped string", async () => {
    const reporters = await rule.execute(createContext("fail"));
    const diagnostics = reporters.flatMap((reporter) => reporter.diagnostics);
    expect(diagnostics.some((diagnostic) => diagnostic.error === "missing-mapped-string")).toBe(true);
  });
});

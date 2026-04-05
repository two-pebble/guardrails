import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { buildGeneratedModule, collectRuleDocs, formatRuleTitle } from "./rule-docs";

const tempDirectories: string[] = [];

describe("feature: rule docs generation", () => {
  afterEach(() => {
    for (const directory of tempDirectories.splice(0)) {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  test("success: collects rule docs from sidecar md files", async () => {
    const repositoryRoot = createRepositoryFixture();
    const ruleDirectory = join(repositoryRoot, "packages/guardrails/src/rules/no-dynamic-imports");

    mkdirSync(ruleDirectory, { recursive: true });
    writeFileSync(join(ruleDirectory, "rule.ts"), "export class NoDynamicImportsRule {}\n");
    writeFileSync(
      join(ruleDirectory, "docs.md"),
      [
        "## What It Checks",
        "",
        "Disallows dynamic import() calls.",
        "",
        "## Passing Pattern",
        "",
        "```ts",
        'import "./x";',
        "```",
        "",
      ].join("\n"),
    );

    const docsPackageDir = join(repositoryRoot, "packages/docs");
    mkdirSync(docsPackageDir, { recursive: true });

    const ruleDocs = await collectRuleDocs(docsPackageDir);

    expect(ruleDocs).toEqual([
      {
        slug: "no-dynamic-imports",
        title: "No Dynamic Imports",
        summary: "Disallows dynamic import() calls.",
        markdown: expect.stringContaining("## What It Checks"),
        ruleSourcePath: "packages/guardrails/src/rules/no-dynamic-imports/rule.ts",
        docsSourcePath: "packages/guardrails/src/rules/no-dynamic-imports/docs.md",
      },
    ]);
  });

  test("success: builds a generated module from collected rule docs", () => {
    const moduleContents = buildGeneratedModule([
      {
        slug: "path-names-kebab-case",
        title: formatRuleTitle("path-names-kebab-case"),
        summary: "Requires lowercase path names.",
        markdown: "## What It Checks\n\nRequires lowercase path names.",
        ruleSourcePath: "packages/guardrails/src/rules/path-names-kebab-case/rule.ts",
        docsSourcePath: "packages/guardrails/src/rules/path-names-kebab-case/docs.md",
      },
    ]);

    expect(moduleContents).toContain("export const ruleDocs: RuleDoc[] = [");
    expect(moduleContents).toContain('slug: "path-names-kebab-case"');
  });
});

function createRepositoryFixture() {
  const directory = mkdtempSync(join(tmpdir(), "guardrails-docs-"));
  tempDirectories.push(directory);
  return directory;
}

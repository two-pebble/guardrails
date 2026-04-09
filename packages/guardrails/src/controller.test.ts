import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { Controller } from "./controller";
import { GuardrailsTsGroup } from "./groups/guardrails-ts-group";
import type { GuardrailConfig } from "./types";

describe("Controller", () => {
  test("happy: passes for the TypeScript group when files match the selected guardrails", async () => {
    const result = await withPackageFixture("passing-package", setupPassingPackage, runTypeScriptGroup);
    expect({ passed: result.passed, ruleCount: result.results.length }).toEqual({
      passed: true,
      ruleCount: GuardrailsTsGroup.baseRules().length,
    });
  });

  test("unhappy: reports dynamic imports and invalid path names", async () => {
    const result = await withPackageFixture("failing-package", setupFailingPackage, runTypeScriptGroup);
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toEqual(
      expect.arrayContaining(["folder-naming", "ts-uppercase", "dynamic-import"]),
    );
  });

  test("unhappy: reports a missing package root README.md", async () => {
    const result = await withPackageFixture("missing-readme-package", setupMissingReadmePackage, runTypeScriptGroup);
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toContain(
      "missing-readme-md",
    );
  });

  test("unhappy: rejects custom rule paths in config", async () => {
    const error = await withPackageFixture("invalid-config-package", async () => {}, getInvalidRulePathsError);
    const message = error?.message;
    const expected = "additional.@rule/no-dynamic-imports.paths is not supported";
    expect(message).toContain(expected);
  });

  test("unhappy: rejects nested rule options objects in config", async () => {
    const error = await withPackageFixture("invalid-nested-options-package", async () => {}, getNestedOptionsError);
    const message = error?.message;
    const expected = "additional.@rule/no-dynamic-imports.options is not supported";

    expect(message).toContain(expected);
  });

  test("unhappy: reports missing required package scripts", async () => {
    const result = await withPackageFixture(
      "missing-scripts-package",
      setupMissingScriptsPackage,
      runMissingScriptsRule,
    );
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toContain(
      "missing-required-scripts",
    );
  });

  test("unhappy: rejects required-scripts config without a script list", async () => {
    const error = await withPackageFixture(
      "invalid-required-scripts-config",
      async () => {},
      async (packageDir) => getRunError(packageDir, { additional: { "@rule/required-scripts": {} } }),
    );
    expect(error?.message).toContain(
      "additional.@rule/required-scripts.requiredScripts must be a non-empty array of strings",
    );
  });
});

const withPackageFixture = async <T>(
  prefix: string,
  setup: (packageDir: string) => Promise<void> | void,
  run: (packageDir: string) => Promise<T>,
) => {
  const packageDir = mkdtempSync(join(tmpdir(), `${prefix}-`));

  try {
    await setup(packageDir);
    return await run(packageDir);
  } finally {
    rmSync(packageDir, { force: true, recursive: true });
  }
};

const runTypeScriptGroup = async (packageDir: string) => {
  return new Controller().run(packageDir, { inherit: "@group/guardrails-typescript" });
};

const runMissingScriptsRule = async (packageDir: string) => {
  return new Controller().run(packageDir, {
    additional: {
      "@rule/required-scripts": {
        requiredScripts: ["build", "test", "typecheck"],
      },
    },
  });
};

const getRunError = async (packageDir: string, config: GuardrailConfig) => {
  try {
    await new Controller().run(packageDir, config);
    return undefined;
  } catch (error) {
    return error as Error;
  }
};

const getInvalidRulePathsError = async (packageDir: string) => {
  return getRunError(packageDir, {
    additional: {
      "@rule/no-dynamic-imports": {
        paths: ["src/**/*.ts"],
      },
    },
  });
};

const getNestedOptionsError = async (packageDir: string) => {
  return getRunError(packageDir, {
    additional: {
      "@rule/no-dynamic-imports": {
        options: {},
      },
    },
  });
};

const setupPassingPackage = (packageDir: string) => {
  writePackageReadme(packageDir, "Passing Package");
  writePackageJson(packageDir, { name: "passing-package", version: "0.1.0" });
  writeErrorsFile(packageDir);
  writePassingRuleFile(packageDir, join(packageDir, "src", "example-rule.ts"));
};

const setupFailingPackage = (packageDir: string) => {
  writePackageReadme(packageDir, "Failing Package");
  writePackageJson(packageDir, { name: "failing-package", version: "0.1.0" });
  writeErrorsFile(packageDir);
  mkdirSync(join(packageDir, "src", "Bad_Folder"), { recursive: true });
  writeFileSync(
    join(packageDir, "src", "Bad_Folder", "BadFile.ts"),
    [
      "/**",
      " * Demonstrates path-name and import failures without adding unrelated rule noise.",
      " */",
      "export class BadFile {",
      "  // Loads a module using a dynamic import so the rule reports it.",
      "  public async loadRule() {",
      '    return import("./other");',
      "  }",
      "}",
      "",
    ].join("\n"),
  );
};

const setupMissingReadmePackage = (packageDir: string) => {
  writePackageJson(packageDir, { name: "missing-readme-package", version: "0.1.0" });
  writeErrorsFile(packageDir);
  writePassingRuleFile(packageDir, join(packageDir, "src", "example-rule.ts"));
};

const setupMissingScriptsPackage = (packageDir: string) => {
  writePackageJson(packageDir, {
    name: "missing-scripts-package",
    version: "0.1.0",
    scripts: { build: "tsc --project tsconfig.build.json" },
  });
};

const writePackageReadme = (packageDir: string, title: string) => {
  writeFileSync(
    join(packageDir, "README.md"),
    [
      `# ${title}`,
      "",
      "## Intent",
      "",
      "Describe intent.",
      "",
      "## Examples",
      "",
      "```ts",
      "export {};",
      "```",
      "",
    ].join("\n"),
  );
};

const writePackageJson = (packageDir: string, packageJson: Record<string, unknown>) => {
  writeFileSync(join(packageDir, "package.json"), JSON.stringify(packageJson, null, 2));
};

const writeErrorsFile = (packageDir: string) => {
  mkdirSync(join(packageDir, "src"), { recursive: true });
  writeFileSync(
    join(packageDir, "src", "errors.ts"),
    [
      "/**",
      " * Defines the package-level error base class.",
      " */",
      "export class ExampleError extends Error {}",
      "",
    ].join("\n"),
  );
};

const writePassingRuleFile = (packageDir: string, filePath: string) => {
  mkdirSync(join(packageDir, "src"), { recursive: true });
  writeFileSync(
    filePath,
    [
      "/**",
      " * Demonstrates a package source file that satisfies the TypeScript group.",
      " */",
      "export class ExampleRule {",
      "  // Returns a stable rule label for the fixture package.",
      "  public getName() {",
      '    return "example-rule";',
      "  }",
      "}",
      "",
    ].join("\n"),
  );
};

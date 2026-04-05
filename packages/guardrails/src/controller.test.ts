import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { Controller } from "./controller";
import type { GuardrailConfig } from "./types";

const tempDirectories: string[] = [];

describe("Controller", () => {
  afterEach(() => {
    for (const directory of tempDirectories.splice(0)) {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it("passes for the TypeScript group when files match the selected guardrails", async () => {
    const packageDir = createPackageFixture("passing-package");
    writeFileSync(
      join(packageDir, "README.md"),
      [
        "# Passing Package",
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
    writeFileSync(
      join(packageDir, "package.json"),
      JSON.stringify({ name: "passing-package", version: "0.1.0" }, null, 2),
    );
    mkdirSync(join(packageDir, "src"), { recursive: true });
    writeFileSync(join(packageDir, "src", "example-rule.ts"), 'export const exampleRule = "ok";\n');

    const controller = new Controller();
    const config: GuardrailConfig = { inherit: "@group/guardrails-typescript" };
    const result = await controller.run(packageDir, config);

    expect(result.passed).toBe(true);
    expect(result.results).toHaveLength(4);
  });

  it("reports dynamic imports and invalid path names", async () => {
    const packageDir = createPackageFixture("failing-package");
    writeFileSync(
      join(packageDir, "README.md"),
      [
        "# Failing Package",
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
    writeFileSync(
      join(packageDir, "package.json"),
      JSON.stringify({ name: "failing-package", version: "0.1.0" }, null, 2),
    );
    mkdirSync(join(packageDir, "src", "Bad_Folder"), { recursive: true });
    writeFileSync(
      join(packageDir, "src", "Bad_Folder", "BadFile.ts"),
      'export async function loadRule() {\n  return import("./other.ts");\n}\n',
    );

    const controller = new Controller();
    const config: GuardrailConfig = { inherit: "@group/guardrails-typescript" };
    const result = await controller.run(packageDir, config);

    expect(result.passed).toBe(false);
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toEqual(
      expect.arrayContaining(["folder-naming", "ts-uppercase", "dynamic-import"]),
    );
  });

  it("reports a missing package root README.md", async () => {
    const packageDir = createPackageFixture("missing-readme-package");
    writeFileSync(
      join(packageDir, "package.json"),
      JSON.stringify({ name: "missing-readme-package", version: "0.1.0" }, null, 2),
    );
    mkdirSync(join(packageDir, "src"), { recursive: true });
    writeFileSync(join(packageDir, "src", "example-rule.ts"), 'export const exampleRule = "ok";\n');

    const controller = new Controller();
    const config: GuardrailConfig = { inherit: "@group/guardrails-typescript" };
    const result = await controller.run(packageDir, config);

    expect(result.passed).toBe(false);
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toContain(
      "missing-readme-md",
    );
  });

  it("rejects custom rule paths in config", async () => {
    const packageDir = createPackageFixture("invalid-config-package");
    const controller = new Controller();

    await expect(
      controller.run(packageDir, {
        additional: {
          "@rule/no-dynamic-imports": {
            paths: ["src/**/*.ts"],
          },
        },
      }),
    ).rejects.toThrow("additional.@rule/no-dynamic-imports.paths is not supported");
  });

  it("reports missing required package scripts", async () => {
    const packageDir = createPackageFixture("missing-scripts-package");
    writeFileSync(
      join(packageDir, "package.json"),
      JSON.stringify(
        {
          name: "missing-scripts-package",
          version: "0.1.0",
          scripts: {
            build: "tsc --project tsconfig.build.json",
          },
        },
        null,
        2,
      ),
    );

    const controller = new Controller();
    const result = await controller.run(packageDir, {
      additional: {
        "@rule/required-scripts": {
          requiredScripts: ["build", "test", "typecheck"],
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.results.flatMap((entry) => entry.diagnostics).map((entry) => entry.error)).toContain(
      "missing-required-scripts",
    );
  });

  it("rejects required-scripts config without a script list", async () => {
    const packageDir = createPackageFixture("invalid-required-scripts-config");
    const controller = new Controller();

    await expect(
      controller.run(packageDir, {
        additional: {
          "@rule/required-scripts": {},
        },
      }),
    ).rejects.toThrow("additional.@rule/required-scripts.requiredScripts must be a non-empty array of strings");
  });
});

function createPackageFixture(prefix: string) {
  const directory = mkdtempSync(join(tmpdir(), `${prefix}-`));
  tempDirectories.push(directory);
  return directory;
}

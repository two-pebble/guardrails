import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { describe, expect, test } from "vitest";
import type { GuardrailContext } from "../types";
import { Guardrail } from "./guardrail";

describe("Guardrail", () => {
  test("happy: iterates directories derived from file globs", async () => {
    const directories = await withPackageFixture(async (packageDir) => {
      mkdirSync(join(packageDir, "src", "rules", "path-names-kebab-case"), { recursive: true });
      writeFileSync(join(packageDir, "src", "index.ts"), "export {};\n");
      writeFileSync(join(packageDir, "src", "rules", "path-names-kebab-case", "rule.ts"), "export {};\n");
      return await getRelativeDirectories(packageDir);
    });
    expect(directories).toEqual(["src", "src/rules", "src/rules/path-names-kebab-case"]);
  });
});

const withPackageFixture = async <T>(run: (packageDir: string) => Promise<T>) => {
  const packageDir = mkdtempSync(join(tmpdir(), "guardrail-directories-"));

  try {
    return await run(packageDir);
  } finally {
    rmSync(packageDir, { force: true, recursive: true });
  }
};

const getRelativeDirectories = async (packageDir: string) => {
  const rule = createDirectoryProbeRule();
  const context: GuardrailContext = { packageDir, exclude: [] };
  await rule.execute(context);
  return rule.directories.map((directory) => relative(packageDir, directory));
};

const createDirectoryProbeRule = () =>
  new (class extends Guardrail {
    public readonly name = "directory-probe";
    public readonly directories: string[] = [];

    protected async check() {
      await this.forEachDirectory(["src/**/*.ts"], (directory) => {
        this.directories.push(directory);
      });
    }
  })();

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { GuardrailContext } from "../types";
import { Guardrail } from "./guardrail";

const tempDirectories: string[] = [];

describe("Guardrail", () => {
  afterEach(() => {
    for (const directory of tempDirectories.splice(0)) {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  it("iterates directories derived from file globs", async () => {
    const packageDir = createPackageFixture();
    mkdirSync(join(packageDir, "src", "rules", "path-names-kebab-case"), { recursive: true });
    writeFileSync(join(packageDir, "src", "index.ts"), "export {};\n");
    writeFileSync(join(packageDir, "src", "rules", "path-names-kebab-case", "rule.ts"), "export {};\n");

    const rule = new DirectoryProbeRule();
    const context: GuardrailContext = {
      packageDir,
      exclude: [],
    };

    await rule.execute(context);

    expect(rule.directories.map((directory) => relative(packageDir, directory))).toEqual([
      "src",
      "src/rules",
      "src/rules/path-names-kebab-case",
    ]);
  });
});

class DirectoryProbeRule extends Guardrail {
  public readonly name = "directory-probe";
  public readonly directories: string[] = [];

  protected async check() {
    await this.forEachDirectory(["src/**/*.ts"], (directory) => {
      this.directories.push(directory);
    });
  }
}

function createPackageFixture() {
  const directory = mkdtempSync(join(tmpdir(), "guardrail-directories-"));
  tempDirectories.push(directory);
  return directory;
}

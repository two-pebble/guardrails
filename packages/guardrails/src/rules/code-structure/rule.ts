import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { Guardrail } from "../../constructs/guardrail";
import { Reporter } from "../../constructs/reporter";

/**
 * Enforces directory structure conventions: required files, no direct files, no sub-folders.
 */
export class CodeStructureRule extends Guardrail {
  public readonly name = "code-structure";

  protected async check() {
    const reporter = new Reporter(this.name);

    const filePatterns = this.options.files as string[] | undefined;
    if (filePatterns) {
      for (const pattern of filePatterns) {
        CodeStructureRule.checkRequiredFiles(this.packageDir, pattern, reporter);
      }
    }

    const noDirectFiles = this.options["no-direct-files"] as string[] | undefined;
    if (noDirectFiles) {
      for (const dir of noDirectFiles) {
        CodeStructureRule.checkNoDirectFiles(this.packageDir, dir, reporter);
      }
    }

    const noSubFolders = this.options["no-sub-folders"] as string[] | undefined;
    if (noSubFolders) {
      for (const dir of noSubFolders) {
        CodeStructureRule.checkNoSubFolders(this.packageDir, dir, reporter);
      }
    }

    this.addReporter(reporter);
  }

  private static checkRequiredFiles(pkgDir: string, pattern: string, reporter: Reporter) {
    const parts = pattern.split("/**/");
    if (parts.length !== 2) return;

    const baseDir = resolve(pkgDir, parts[0]);
    const required = parts[1];

    if (!existsSync(baseDir)) return;

    for (const entry of readdirSync(baseDir)) {
      const entryPath = join(baseDir, entry);
      if (!statSync(entryPath).isDirectory()) continue;

      const target = join(entryPath, required);
      const isDir = !required.includes(".");
      const missing = isDir ? !existsSync(target) || !statSync(target).isDirectory() : !existsSync(target);

      if (missing) {
        reporter.fail({
          error: "missing-file",
          description: `Directory "${entry}" is missing required ${isDir ? "folder" : "file"} "${required}".`,
          recommendation: `Add ${required} to the directory.`,
        });
      }
    }
  }

  private static checkNoDirectFiles(pkgDir: string, dir: string, reporter: Reporter) {
    const targetDir = resolve(pkgDir, dir);
    if (!existsSync(targetDir)) return;

    for (const entry of readdirSync(targetDir)) {
      const entryPath = join(targetDir, entry);
      if (statSync(entryPath).isFile()) {
        reporter.fail({
          error: "no-direct-files",
          description: `"${dir}" must not contain files directly — found "${entry}".`,
          recommendation: `Move "${entry}" into a subdirectory of ${dir}/.`,
        });
      }
    }
  }

  private static checkNoSubFolders(pkgDir: string, dir: string, reporter: Reporter) {
    const targetDir = resolve(pkgDir, dir);
    if (!existsSync(targetDir)) return;

    for (const entry of readdirSync(targetDir)) {
      const entryPath = join(targetDir, entry);
      if (statSync(entryPath).isDirectory()) {
        reporter.fail({
          error: "no-sub-folders",
          description: `"${dir}" must not contain subdirectories — found "${entry}".`,
          recommendation: `Flatten "${entry}" or move it elsewhere.`,
        });
      }
    }
  }
}

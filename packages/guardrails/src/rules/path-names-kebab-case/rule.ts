import { basename } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

export class PathNamesKebabCaseRule extends Guardrail {
  public readonly name = "path-names-kebab-case";
  private static readonly tsPaths = ["src/**/*.ts", "src/**/*.tsx"] as const;

  protected async check() {
    await this.forEachDirectory(PathNamesKebabCaseRule.tsPaths, (directory, reporter) => {
      const folderName = basename(directory);
      if (folderName !== folderName.toLowerCase() || folderName.includes("_")) {
        reporter.fail({
          error: "folder-naming",
          description: "Folder names must stay lowercase and use hyphens instead of underscores.",
          recommendation: "Rename to lowercase kebab-case.",
        });
      }
    });

    await this.forEachMatchedFile(["**/*_*", "**/*[A-Z]*.ts", "**/*[A-Z]*.tsx"], (file, reporter) => {
      const fileName = basename(file);
      if (fileName.includes("_")) {
        reporter.fail({
          error: "file-underscore",
          description: "File names must use hyphens instead of underscores.",
          recommendation: "Rename to use hyphens.",
        });
      }

      if (/\.tsx?$/.test(fileName) && fileName !== fileName.toLowerCase()) {
        reporter.fail({
          error: "ts-uppercase",
          description: "TypeScript filenames must stay lowercase and use kebab-case.",
          recommendation: "Rename to lowercase kebab-case.",
        });
      }
    });
  }
}

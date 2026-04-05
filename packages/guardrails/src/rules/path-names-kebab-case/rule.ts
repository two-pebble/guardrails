import { basename, dirname } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

export class PathNamesKebabCaseRule extends Guardrail {
  public readonly name = "path-names-kebab-case";

  protected async check() {
    const checkedDirectories = new Set<string>();

    await this.forEachFile((file, reporter) => {
      const directory = dirname(file);

      if (!checkedDirectories.has(directory)) {
        checkedDirectories.add(directory);
        const folderName = basename(directory);
        if (folderName !== folderName.toLowerCase() || folderName.includes("_")) {
          reporter.fail({
            error: "folder-naming",
            description: "Folder names must stay lowercase and use hyphens instead of underscores.",
            recommendation: "Rename to lowercase kebab-case.",
          });
        }
      }

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

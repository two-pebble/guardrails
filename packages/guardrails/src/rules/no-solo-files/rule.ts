import { readdirSync } from "node:fs";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that directories do not exist solely to hold a single TypeScript file.
 */
export class NoSoloFilesRule extends Guardrail {
  public readonly name = "no-solo-files";

  protected async check() {
    await this.forEachDirectory((dir, reporter) => {
      const entries = readdirSync(dir, { withFileTypes: true });
      const tsFiles = entries.filter((e) => e.isFile() && /\.tsx?$/.test(e.name));
      const subdirs = entries.filter((e) => e.isDirectory());

      // A directory that contains exactly one TS file and no subdirectories
      if (tsFiles.length === 1 && subdirs.length === 0) {
        reporter.fail({
          error: "solo-file",
          description: "Directories must not exist only to hold a single TypeScript file.",
          recommendation: "Flatten the file into its parent or grow the folder.",
        });
      }
    });
  }
}

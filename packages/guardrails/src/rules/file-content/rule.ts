import { readFileSync } from "node:fs";
import { glob } from "tinyglobby";
import { Guardrail } from "../../constructs/guardrail";
import { Reporter } from "../../constructs/reporter";

/**
 * Checks that files matching a path pattern contain a required substring.
 */
export class FileContentRule extends Guardrail {
  public readonly name = "file-content";

  protected async check() {
    const cases = (this.options.cases ?? []) as { string: string; paths: string; reason?: string }[];

    for (const entry of cases) {
      const files = await glob(entry.paths, {
        cwd: this.packageDir,
        absolute: true,
        ignore: ["**/node_modules/**"],
      });

      for (const file of files) {
        const reporter = new Reporter(this.name, file);
        const content = readFileSync(file, "utf-8");

        if (!content.includes(entry.string)) {
          reporter.fail({
            error: "missing-content",
            description: `File must contain "${entry.string}".`,
            recommendation: entry.reason ?? "Add the required content to the file.",
          });
        }

        this.addReporter(reporter);
      }
    }
  }
}

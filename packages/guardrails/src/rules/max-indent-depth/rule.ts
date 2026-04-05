import { basename } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that non-test TypeScript source files do not exceed a maximum indentation depth.
 */
export class MaxIndentDepthRule extends Guardrail {
  public readonly name = "max-indent-depth";

  protected async check() {
    const maxLevels = (this.options.maxLevels as number) ?? 6;
    const indentWidth = (this.options.indentWidth as number) ?? 2;

    await this.forEachFileContent((file, content, reporter) => {
      const fileName = basename(file);

      if (fileName.includes(".test.") || fileName.includes(".spec.")) {
        return;
      }

      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") continue;

        const match = line.match(/^(\s*)/);
        if (!match) continue;

        const spaces = match[1].replace(/\t/g, "  ").length;
        const depth = Math.floor(spaces / indentWidth);

        if (depth > maxLevels) {
          reporter.fail(
            {
              error: "too-deep",
              description: `TypeScript source must not indent beyond ${maxLevels} levels.`,
              recommendation: "Flatten nested control flow or extract helpers.",
            },
            i + 1,
          );
        }
      }
    });
  }
}

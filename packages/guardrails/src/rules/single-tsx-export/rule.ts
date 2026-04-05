import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that TSX files define at most one top-level function.
 */
export class SingleTsxExportRule extends Guardrail {
  public readonly name = "single-tsx-export";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      if (!_file.endsWith(".tsx")) return;
      if (_file.endsWith(".story.tsx") || _file.endsWith(".test.tsx")) return;

      let count = 0;
      for (const statement of sourceFile.statements) {
        if (ts.isFunctionDeclaration(statement)) {
          count++;
        }
      }

      if (count > 1) {
        reporter.fail({
          error: "multiple-top-level-functions",
          description: `TSX files must define at most one top-level function, found ${count}.`,
          recommendation: "Extract additional functions into separate files.",
        });
      }
    });
  }
}

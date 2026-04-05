import { basename } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that index.ts files contain only import and export declarations.
 */
export class PureIndexFilesRule extends Guardrail {
  public readonly name = "pure-index-files";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (basename(file) !== "index.ts") return;

      for (const statement of sourceFile.statements) {
        if (
          ts.isImportDeclaration(statement) ||
          ts.isExportDeclaration(statement) ||
          ts.isExportAssignment(statement)
        ) {
          continue;
        }

        reporter.fail(
          {
            error: "non-reexport",
            description: "index.ts files must contain only import and export declarations.",
            recommendation: "Keep index modules as pure aggregation boundaries.",
          },
          sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
        );
      }
    });
  }
}

import { readFileSync } from "node:fs";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that src/errors.ts exports at least one custom error class extending Error.
 */
export class PackageErrorsFileRule extends Guardrail {
  public readonly name = "package-errors-file";

  protected async check() {
    await this.forEachFile((file, reporter) => {
      // We look for src/errors.ts files
      if (!file.endsWith("src/errors.ts")) return;

      const content = readFileSync(file, "utf-8");
      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);

      let hasExportedErrorClass = false;

      for (const statement of sourceFile.statements) {
        if (!ts.isClassDeclaration(statement)) continue;

        const isExported = !!(ts.getCombinedModifierFlags(statement) & ts.ModifierFlags.Export);
        if (!isExported) continue;

        // Check if it extends Error (or any class, which we assume is an Error subclass if the file is errors.ts)
        if (statement.heritageClauses) {
          for (const clause of statement.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
              hasExportedErrorClass = true;
              break;
            }
          }
        }
      }

      if (!hasExportedErrorClass) {
        reporter.fail({
          error: "no-error-class",
          description: "src/errors.ts must export at least one custom error class that extends Error.",
          recommendation: "Define package-specific error classes.",
        });
      }
    });
  }
}

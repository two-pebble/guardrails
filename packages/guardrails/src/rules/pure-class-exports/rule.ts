import { basename } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that files exporting a class do not export anything else.
 */
export class PureClassExportsRule extends Guardrail {
  public readonly name = "pure-class-exports";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (basename(file) === "errors.ts") return;

      let hasExportedClass = false;
      let exportedCount = 0;

      for (const statement of sourceFile.statements) {
        const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
        const isExported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
        if (!isExported) continue;

        exportedCount++;

        if (ts.isClassDeclaration(statement)) {
          hasExportedClass = true;
        }
      }

      if (hasExportedClass && exportedCount > 1) {
        reporter.fail(
          {
            error: "impure-export",
            description: "Files that export a class must export only that class.",
            recommendation: "Keep class files pure with a single export.",
          },
          1,
        );
      }
    });
  }
}

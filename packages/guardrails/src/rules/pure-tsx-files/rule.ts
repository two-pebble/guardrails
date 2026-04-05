import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that TSX files define and export only one top-level function.
 */
export class PureTsxFilesRule extends Guardrail {
  public readonly name = "pure-tsx-files";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.endsWith(".tsx")) return;

      let topLevelFunctions = 0;
      let exportedFunctions = 0;

      for (const statement of sourceFile.statements) {
        if (ts.isFunctionDeclaration(statement)) {
          topLevelFunctions++;
          const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
          const isExported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
          if (isExported) exportedFunctions++;
        }

        // Also count exported arrow/function expressions in variable declarations
        if (ts.isVariableStatement(statement)) {
          const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
          const isExported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
          for (const decl of statement.declarationList.declarations) {
            const isFnInit =
              decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer));
            if (isFnInit) {
              topLevelFunctions++;
              if (isExported) exportedFunctions++;
            }
          }
        }
      }

      if (topLevelFunctions > 1) {
        reporter.fail(
          {
            error: "multiple-functions",
            description: "TSX files must define only one top-level function.",
            recommendation: "Extract additional functions into separate files.",
          },
          1,
        );
      }

      if (exportedFunctions > 1) {
        reporter.fail(
          {
            error: "multiple-exports",
            description: "TSX files must export only one function.",
            recommendation: "Expose one component per TSX file.",
          },
          1,
        );
      }
    });
  }
}

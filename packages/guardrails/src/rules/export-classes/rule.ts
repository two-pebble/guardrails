import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that all classes are exported directly from the module scope.
 */
export class ExportClassesRule extends Guardrail {
  public readonly name = "export-classes";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isClassDeclaration(node)) {
          const isTopLevel = node.parent === sourceFile;

          if (!isTopLevel) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
            reporter.fail(
              {
                error: "unexported-class",
                description: "Classes must be exported directly from the module.",
                recommendation: "Move this class to module scope and export it explicitly.",
              },
              line,
            );
            return;
          }

          const modifiers = node.modifiers ?? [];
          const isExported = modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

          if (!isExported) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
            reporter.fail(
              {
                error: "unexported-class",
                description: "Classes must be exported directly from the module.",
                recommendation: "Move this class to module scope and export it explicitly.",
              },
              line,
            );
          }
        }

        if (ts.isClassExpression(node)) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          reporter.fail(
            {
              error: "unexported-class",
              description: "Classes must be exported directly from the module.",
              recommendation: "Move this class to module scope and export it explicitly.",
            },
            line,
          );
        }

        ts.forEachChild(node, visit);
      });
    });
  }
}

import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans dynamic imports and inline import type queries in package source files.
 */
export class NoDynamicImportsRule extends Guardrail {
  public readonly name = "no-dynamic-imports";
  private static readonly paths = ["src/**/*.ts", "src/**/*.tsx"] as const;

  protected async check() {
    await this.forEachTypeScriptFile(NoDynamicImportsRule.paths, (_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "dynamic-import",
              description: "Dynamic import() is not allowed in TypeScript source files.",
              recommendation: "Use a static import.",
            },
            line,
          );
        }

        if (ts.isImportTypeNode(node)) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "inline-import-type",
              description: "Inline import type queries are not allowed.",
              recommendation: "Promote to a top-level import type.",
            },
            line,
          );
        }

        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
    });
  }
}

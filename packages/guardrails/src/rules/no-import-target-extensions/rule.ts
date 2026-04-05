import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";
import type { Reporter } from "../../constructs/reporter";

/**
 * Checks that import and export specifiers do not end with .js or .ts extensions.
 */
export class NoImportTargetExtensionsRule extends Guardrail {
  public readonly name = "no-import-target-extensions";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        // Import declarations: import ... from '...'
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
          NoImportTargetExtensionsRule.checkSpecifier(node.moduleSpecifier, sourceFile, reporter);
        }

        // Export declarations: export ... from '...'
        if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          NoImportTargetExtensionsRule.checkSpecifier(node.moduleSpecifier, sourceFile, reporter);
        }

        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    });
  }

  private static checkSpecifier(specifier: ts.StringLiteral, sourceFile: ts.SourceFile, reporter: Reporter) {
    const value = specifier.text;
    if (value.endsWith(".js") || value.endsWith(".ts")) {
      const line = sourceFile.getLineAndCharacterOfPosition(specifier.getStart()).line + 1;
      reporter.fail(
        {
          error: "target-extension",
          description: "Import and export targets must not end with .js or .ts.",
          recommendation: "Use extensionless module specifiers.",
        },
        line,
      );
    }
  }
}

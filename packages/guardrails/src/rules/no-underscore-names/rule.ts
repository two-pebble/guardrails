import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that variable and class names do not contain underscores.
 */
export class NoUnderscoreNamesRule extends Guardrail {
  public readonly name = "no-underscore-names";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const check = (id: ts.Identifier, kind: string) => {
        if (id.text.includes("_")) {
          const line = sourceFile.getLineAndCharacterOfPosition(id.getStart()).line + 1;
          reporter.fail(
            {
              error: "underscore-name",
              description: `Identifier name must not contain underscores. Found ${kind} "${id.text}".`,
              recommendation: "Rename to use camelCase for variables or PascalCase for classes.",
            },
            line,
          );
        }
      };

      const visit = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
          check(node.name, "variable");
        }

        if (ts.isClassDeclaration(node) && node.name) {
          check(node.name, "class");
        }

        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    });
  }
}

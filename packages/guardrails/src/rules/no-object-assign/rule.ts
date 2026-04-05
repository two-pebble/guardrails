import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that Object.assign() is not used.
 */
export class NoObjectAssignRule extends Guardrail {
  public readonly name = "no-object-assign";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "Object" &&
          node.expression.name.text === "assign"
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "object-assign",
              description: "Object.assign(...) is not allowed.",
              recommendation: "Use explicit object literals or direct field assignment.",
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

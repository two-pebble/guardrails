import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that if-statement conditions do not mix && and || operators.
 */
export class NoMixedLogicalOperatorsInIfRule extends Guardrail {
  public readonly name = "no-mixed-logical-operators-in-if";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isIfStatement(node)) {
          if (NoMixedLogicalOperatorsInIfRule.hasMixedLogical(node.expression)) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "mixed-operators",
                description: "If statements must not mix && and || in the same condition.",
                recommendation: "Define named boolean intermediates before the branch.",
              },
              line,
            );
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    });
  }

  private static hasMixedLogical(expr: ts.Expression) {
    let hasAnd = false;
    let hasOr = false;

    const walk = (node: ts.Node) => {
      if (ts.isBinaryExpression(node)) {
        if (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
          hasAnd = true;
        } else if (node.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
          hasOr = true;
        }
      }
      ts.forEachChild(node, walk);
    };

    walk(expr);
    return hasAnd && hasOr;
  }
}

import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that function and class parameters do not use object destructuring.
 */
export class NoObjectDestructuringParametersRule extends Guardrail {
  public readonly name = "no-object-destructuring-parameters";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (NoObjectDestructuringParametersRule.isFunctionLike(node)) {
          for (const param of node.parameters) {
            if (!ts.isObjectBindingPattern(param.name)) continue;
            const line = sourceFile.getLineAndCharacterOfPosition(param.getStart()).line + 1;
            reporter.fail(
              {
                error: "destructured-param",
                description: "Function and class parameters must not use object destructuring.",
                recommendation: "Accept a named parameter and read fields inside the implementation.",
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

  private static isFunctionLike(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      ts.isConstructorDeclaration(node)
    );
  }
}

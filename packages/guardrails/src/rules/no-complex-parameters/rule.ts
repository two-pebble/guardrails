import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that function parameters use simple named types instead of inline complex types.
 */
export class NoComplexParametersRule extends Guardrail {
  public readonly name = "no-complex-parameters";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (NoComplexParametersRule.isFunctionLike(node)) {
          for (const param of node.parameters) {
            if (!param.type || !NoComplexParametersRule.isComplexType(param.type)) continue;
            const line = sourceFile.getLineAndCharacterOfPosition(param.getStart()).line + 1;
            reporter.fail(
              {
                error: "complex-param",
                description: "Parameter types must use simple named types.",
                recommendation: "Extract complex shapes into named type aliases.",
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
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isConstructorDeclaration(node)
    );
  }

  private static isComplexType(typeNode: ts.TypeNode): boolean {
    if (ts.isParenthesizedTypeNode(typeNode)) {
      return NoComplexParametersRule.isComplexType(typeNode.type);
    }

    return (
      ts.isTypeLiteralNode(typeNode) ||
      ts.isUnionTypeNode(typeNode) ||
      ts.isIntersectionTypeNode(typeNode) ||
      ts.isTupleTypeNode(typeNode) ||
      ts.isArrayTypeNode(typeNode) ||
      ts.isFunctionTypeNode(typeNode) ||
      ts.isConstructorTypeNode(typeNode) ||
      ts.isConditionalTypeNode(typeNode) ||
      ts.isMappedTypeNode(typeNode)
    );
  }
}

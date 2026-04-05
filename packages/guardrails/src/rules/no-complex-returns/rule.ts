import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that function return types use simple named types instead of inline complex types.
 */
export class NoComplexReturnsRule extends Guardrail {
  public readonly name = "no-complex-returns";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (
          NoComplexReturnsRule.isFunctionLike(node) &&
          node.body &&
          node.type &&
          NoComplexReturnsRule.isComplexType(node.type)
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.type.getStart()).line + 1;
          reporter.fail(
            {
              error: "complex-return",
              description: "Return types must use simple named types.",
              recommendation: "Extract complex return shapes into named type aliases.",
            },
            line,
          );
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
      ts.isGetAccessorDeclaration(node)
    );
  }

  private static isComplexType(typeNode: ts.TypeNode): boolean {
    if (ts.isParenthesizedTypeNode(typeNode)) {
      return NoComplexReturnsRule.isComplexType(typeNode.type);
    }

    return (
      ts.isTypeLiteralNode(typeNode) ||
      ts.isUnionTypeNode(typeNode) ||
      ts.isIntersectionTypeNode(typeNode) ||
      ts.isTupleTypeNode(typeNode) ||
      ts.isFunctionTypeNode(typeNode) ||
      ts.isConstructorTypeNode(typeNode) ||
      ts.isConditionalTypeNode(typeNode) ||
      ts.isMappedTypeNode(typeNode)
    );
  }
}

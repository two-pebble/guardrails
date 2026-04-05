import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that describe blocks are not nested inside other describe blocks.
 */
export class NoNestedDescribeBlocksRule extends Guardrail {
  public readonly name = "no-nested-describe-blocks";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node, insideDescribe: boolean) => {
        if (NoNestedDescribeBlocksRule.isDescribeCall(node)) {
          if (insideDescribe) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "nested-describe",
                description: "Nested describe(...) blocks are not allowed.",
                recommendation: "Flatten into multiple top-level describe blocks.",
              },
              line,
            );
          }
          ts.forEachChild(node, (child) => visit(child, true));
          return;
        }
        ts.forEachChild(node, (child) => visit(child, insideDescribe));
      };

      ts.forEachChild(sourceFile, (child) => visit(child, false));
    });
  }

  private static isDescribeCall(node: ts.Node) {
    if (!ts.isCallExpression(node)) return false;
    const expr = node.expression;
    return ts.isIdentifier(expr) && expr.text === "describe";
  }
}
